"use server";

import { prisma } from "@kscsystem/db";
import {
  computeMaturity,
  maturityLevelFromScore,
  type AuditAnswerStatus,
  type FindingSeverity,
} from "@kscsystem/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export async function getOrganizationsForAudit() {
  return prisma.organization.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, nip: true, type: true },
  });
}

export async function getAuditTemplates() {
  return prisma.auditTemplate.findMany({
    where: { isActive: true },
    orderBy: [{ name: "asc" }, { version: "desc" }],
    include: { _count: { select: { sections: true } } },
  });
}

export async function getAuditDashboard() {
  const [total, completed, inProgress, avg, recent] = await Promise.all([
    prisma.auditSession.count(),
    prisma.auditSession.count({ where: { status: "completed" } }),
    prisma.auditSession.count({ where: { status: { in: ["draft", "in_progress"] } } }),
    prisma.auditSession.aggregate({ _avg: { maturityScore: true }, where: { status: "completed" } }),
    prisma.auditSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { organization: { select: { name: true } }, _count: { select: { findings: true } } },
    }),
  ]);
  return {
    total,
    completed,
    inProgress,
    avgMaturity: avg._avg.maturityScore != null ? Math.round(avg._avg.maturityScore) : null,
    recent,
  };
}

export async function getAuditSession(id: string) {
  return prisma.auditSession.findUnique({
    where: { id },
    include: {
      organization: true,
      conductedBy: { select: { name: true, email: true } },
      template: {
        include: {
          sections: {
            orderBy: { sortOrder: "asc" },
            include: { questions: { orderBy: { sortOrder: "asc" } } },
          },
        },
      },
      answers: true,
      findings: { orderBy: { severity: "asc" } },
      recommendations: { orderBy: { priority: "asc" } },
    },
  });
}

export async function createAuditSession(formData: FormData) {
  const organizationId = formData.get("organizationId") as string;
  const templateId = formData.get("templateId") as string;
  if (!organizationId || !templateId) throw new Error("Wybierz organizację i szablon audytu.");

  const [session, template] = await Promise.all([
    getSession(),
    prisma.auditTemplate.findUnique({ where: { id: templateId } }),
  ]);
  if (!template) throw new Error("Nie znaleziono szablonu.");

  const created = await prisma.auditSession.create({
    data: {
      organizationId,
      templateId,
      templateVersion: template.version,
      conductedById: session?.userId ?? null,
      status: "draft",
      startedAt: new Date(),
    },
  });

  redirect(`/audit/${created.id}`);
}

export interface AnswerInput {
  status?: AuditAnswerStatus | null;
  valueText?: string;
  note?: string;
  responsiblePerson?: string;
  dueDate?: string;
}

export async function saveAuditAnswer(sessionId: string, questionId: string, input: AnswerInput) {
  const data = {
    status: input.status ?? null,
    valueText: input.valueText?.trim() || null,
    note: input.note?.trim() || null,
    responsiblePerson: input.responsiblePerson?.trim() || null,
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  };

  await prisma.auditAnswer.upsert({
    where: { sessionId_questionId: { sessionId, questionId } },
    create: { sessionId, questionId, ...data },
    update: data,
  });

  // Pierwsza odpowiedź przełącza audyt w stan "w trakcie"
  await prisma.auditSession.updateMany({
    where: { id: sessionId, status: "draft" },
    data: { status: "in_progress" },
  });

  revalidatePath(`/audit/${sessionId}`);
}

const SEVERITY_DOWNGRADE: Record<FindingSeverity, FindingSeverity> = {
  critical: "high",
  high: "medium",
  medium: "low",
  low: "low",
};
const SEVERITY_PRIORITY: Record<FindingSeverity, number> = { critical: 1, high: 2, medium: 3, low: 4 };

/** Finalizuje audyt: liczy maturity score, generuje findings i recommendations. */
export async function completeAuditSession(sessionId: string) {
  const session = await prisma.auditSession.findUnique({
    where: { id: sessionId },
    include: {
      answers: true,
      template: { include: { sections: { include: { questions: true } } } },
    },
  });
  if (!session) throw new Error("Nie znaleziono audytu.");

  // Mapa pytań (tylko status-owe liczą się do scoringu)
  const questions = session.template.sections.flatMap((s) =>
    s.questions.map((q) => ({ ...q, sectionCode: s.code }))
  );
  const qById = new Map(questions.map((q) => [q.id, q]));
  const answerByQ = new Map(session.answers.map((a) => [a.questionId, a]));

  // Maturity score
  const scored = questions
    .filter((q) => q.inputType === "status")
    .map((q) => ({
      weight: q.weight,
      status: (answerByQ.get(q.id)?.status ?? null) as AuditAnswerStatus | null,
    }));
  const maturity = computeMaturity(scored);

  // Findings z braków (NO) i częściowych (PARTIAL)
  const findingsData = questions
    .filter((q) => q.inputType === "status")
    .map((q) => {
      const ans = answerByQ.get(q.id);
      const st = ans?.status;
      if (st !== "no" && st !== "partial") return null;
      const severity = st === "partial" ? SEVERITY_DOWNGRADE[q.severity as FindingSeverity] : (q.severity as FindingSeverity);
      return {
        questionId: q.id,
        sectionCode: q.sectionCode,
        severity,
        title: q.text,
        description: st === "partial" ? "Wdrożone częściowo — wymaga uzupełnienia." : "Brak wdrożenia.",
        recommendation: q.recommendation ?? `Wdrożyć: ${q.text}.`,
        responsiblePerson: ans?.responsiblePerson ?? null,
        dueDate: ans?.dueDate ?? null,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  await prisma.$transaction(async (tx) => {
    // Re-generacja: usuń stare findings/recommendations
    await tx.auditRecommendation.deleteMany({ where: { sessionId } });
    await tx.auditFinding.deleteMany({ where: { sessionId } });

    for (const f of findingsData) {
      const finding = await tx.auditFinding.create({
        data: {
          sessionId,
          questionId: f.questionId,
          sectionCode: f.sectionCode,
          severity: f.severity,
          title: f.title,
          description: f.description,
        },
      });
      await tx.auditRecommendation.create({
        data: {
          sessionId,
          findingId: finding.id,
          priority: SEVERITY_PRIORITY[f.severity],
          title: f.recommendation,
          status: "open",
          responsiblePerson: f.responsiblePerson,
          dueDate: f.dueDate,
        },
      });
    }

    await tx.auditSession.update({
      where: { id: sessionId },
      data: {
        status: "completed",
        completedAt: new Date(),
        maturityScore: maturity.score,
        maturityLevel: maturityLevelFromScore(maturity.score),
      },
    });
  });

  revalidatePath(`/audit/${sessionId}`);
  revalidatePath("/audit");
}

export async function reopenAuditSession(sessionId: string) {
  await prisma.auditSession.update({
    where: { id: sessionId },
    data: { status: "in_progress", completedAt: null },
  });
  revalidatePath(`/audit/${sessionId}`);
}

export async function deleteAuditSession(sessionId: string) {
  await prisma.auditSession.delete({ where: { id: sessionId } });
  revalidatePath("/audit");
  redirect("/audit");
}
