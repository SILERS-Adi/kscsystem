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

/**
 * Tworzy sesję re-audytu na podstawie zakończonego audytu:
 * - ta sama organizacja i szablon (porównywalność #N ↔ #N+1),
 * - kopiuje odpowiedzi z poprzedniej sesji (audytor weryfikuje tylko zmiany),
 * - PRZENOSI otwarte punkty z rejestru remediacji (odpowiedzialny + termin),
 *   oznaczając je w notatce, żeby było jasne co zostało do domknięcia.
 */
export async function createReauditSession(previousSessionId: string) {
  const prev = await prisma.auditSession.findUnique({
    where: { id: previousSessionId },
    include: {
      answers: true,
      template: { include: { sections: { include: { questions: true } } } },
    },
  });
  if (!prev) throw new Error("Nie znaleziono audytu źródłowego.");

  const [me, openActions] = await Promise.all([
    getSession(),
    prisma.remediationAction.findMany({
      where: { organizationId: prev.organizationId, status: { in: ["open", "in_progress"] } },
    }),
  ]);

  const actionByCode = new Map(
    openActions.filter((a) => a.questionCode).map((a) => [a.questionCode as string, a])
  );
  const codeByQId = new Map(
    prev.template.sections.flatMap((s) => s.questions).map((q) => [q.id, q.code])
  );

  const prevDate = prev.completedAt ?? prev.createdAt;
  const carried = prev.answers.filter((a) => {
    const c = codeByQId.get(a.questionId);
    return c != null && actionByCode.has(c);
  }).length;

  const created = await prisma.$transaction(async (tx) => {
    const session = await tx.auditSession.create({
      data: {
        organizationId: prev.organizationId,
        templateId: prev.templateId,
        templateVersion: prev.templateVersion,
        conductedById: me?.userId ?? null,
        status: "draft",
        startedAt: new Date(),
        note: `Re-audyt na podstawie audytu z ${prevDate.toLocaleDateString("pl-PL")} — przeniesiono ${carried} otwartych punktów.`,
      },
    });

    for (const a of prev.answers) {
      const code = codeByQId.get(a.questionId);
      const action = code ? actionByCode.get(code) : undefined;
      await tx.auditAnswer.create({
        data: {
          sessionId: session.id,
          questionId: a.questionId,
          status: a.status,
          valueText: a.valueText,
          note: action
            ? `↪ Otwarty punkt z poprzedniego audytu${action.responsiblePerson ? ` (odp.: ${action.responsiblePerson})` : ""}.${a.note ? ` ${a.note}` : ""}`
            : a.note,
          responsiblePerson: action?.responsiblePerson ?? a.responsiblePerson,
          dueDate: action?.dueDate ?? a.dueDate,
        },
      });
    }

    return session;
  });

  revalidatePath("/audit");
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

    // --- Rejestr remediacji (poziom organizacji): promocja + auto-weryfikacja ---
    // Każda luka (no/partial) trafia do trwałego rejestru per organizacja+questionCode.
    // Każde "yes" zamyka aktywne działanie z poprzednich audytów (weryfikacja).
    const orgId = session.organizationId;
    for (const q of questions) {
      if (q.inputType !== "status" || !q.code) continue;
      const ans = answerByQ.get(q.id);
      const st = ans?.status;
      const existing = await tx.remediationAction.findUnique({
        where: { organizationId_questionCode: { organizationId: orgId, questionCode: q.code } },
      });

      if (st === "no" || st === "partial") {
        const severity = st === "partial"
          ? SEVERITY_DOWNGRADE[q.severity as FindingSeverity]
          : (q.severity as FindingSeverity);
        if (!existing) {
          await tx.remediationAction.create({
            data: {
              organizationId: orgId,
              questionCode: q.code,
              sectionCode: q.sectionCode,
              severity,
              priority: SEVERITY_PRIORITY[severity],
              title: q.text,
              description: q.recommendation ?? `Wdrożyć: ${q.text}.`,
              status: "open",
              responsiblePerson: ans?.responsiblePerson ?? null,
              dueDate: ans?.dueDate ?? null,
              sourceSessionId: sessionId,
            },
          });
        } else {
          // Regresja: luka wróciła po wcześniejszym zamknięciu → otwórz ponownie.
          const reopen = existing.status === "done";
          await tx.remediationAction.update({
            where: { id: existing.id },
            data: {
              severity,
              priority: SEVERITY_PRIORITY[severity],
              sectionCode: q.sectionCode,
              ...(reopen ? { status: "open", closedSessionId: null, closedAt: null } : {}),
            },
          });
        }
      } else if (st === "yes" && existing && (existing.status === "open" || existing.status === "in_progress")) {
        // Auto-weryfikacja: aktywne działanie potwierdzone jako wdrożone w tym audycie.
        await tx.remediationAction.update({
          where: { id: existing.id },
          data: { status: "done", closedSessionId: sessionId, closedAt: new Date() },
        });
      }
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

// ============================================================
// Rejestr remediacji (poziom organizacji, ponad sesjami audytu)
// ============================================================

export async function getRemediationRegister(opts?: { organizationId?: string; status?: string }) {
  const where: { organizationId?: string; status?: string } = {};
  if (opts?.organizationId) where.organizationId = opts.organizationId;
  if (opts?.status) where.status = opts.status;
  return prisma.remediationAction.findMany({
    where,
    orderBy: [{ status: "asc" }, { priority: "asc" }, { dueDate: "asc" }],
    include: { organization: { select: { id: true, name: true } } },
  });
}

export async function getRemediationStats() {
  const now = new Date();
  const [open, inProgress, done, overdue, orgs] = await Promise.all([
    prisma.remediationAction.count({ where: { status: "open" } }),
    prisma.remediationAction.count({ where: { status: "in_progress" } }),
    prisma.remediationAction.count({ where: { status: "done" } }),
    prisma.remediationAction.count({
      where: { status: { in: ["open", "in_progress"] }, dueDate: { lt: now } },
    }),
    prisma.remediationAction.findMany({
      distinct: ["organizationId"],
      select: { organizationId: true },
    }),
  ]);
  return { open, inProgress, done, overdue, organizations: orgs.length };
}

export async function getRemediationOrganizations() {
  const rows = await prisma.remediationAction.findMany({
    distinct: ["organizationId"],
    select: { organization: { select: { id: true, name: true } } },
    orderBy: { organization: { name: "asc" } },
  });
  return rows.map((r) => r.organization);
}

export interface RemediationUpdateInput {
  status?: string;
  responsiblePerson?: string;
  dueDate?: string;
  evidenceUrl?: string;
  note?: string;
}

export async function updateRemediationAction(id: string, input: RemediationUpdateInput) {
  const data: Record<string, unknown> = {};
  if (input.status !== undefined) {
    data.status = input.status;
    if (input.status === "done") {
      data.closedAt = new Date();
    } else {
      data.closedAt = null;
      data.closedSessionId = null;
    }
  }
  if (input.responsiblePerson !== undefined) data.responsiblePerson = input.responsiblePerson.trim() || null;
  if (input.dueDate !== undefined) data.dueDate = input.dueDate ? new Date(input.dueDate) : null;
  if (input.evidenceUrl !== undefined) data.evidenceUrl = input.evidenceUrl.trim() || null;
  if (input.note !== undefined) data.note = input.note.trim() || null;

  await prisma.remediationAction.update({ where: { id }, data });
  revalidatePath("/remediation");
}

// ============================================================
// Porównanie audytów (#N vs #N+1) i historia dojrzałości
// ============================================================

export type CompareStatus = AuditAnswerStatus | null;
export type CompareTrend = "improved" | "regressed" | "unchanged" | "still_open" | "new";

export interface ComparisonRow {
  code: string;
  text: string;
  sectionCode: string;
  prev: CompareStatus;
  curr: CompareStatus;
  trend: CompareTrend;
}

export async function getOrganizationsForCompare() {
  const grouped = await prisma.auditSession.groupBy({
    by: ["organizationId"],
    where: { status: "completed" },
    _count: { _all: true },
  });
  const ids = grouped.filter((g) => g._count._all >= 2).map((g) => g.organizationId);
  if (ids.length === 0) return [];
  return prisma.organization.findMany({
    where: { id: { in: ids } },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

function statusValueForCompare(s: CompareStatus): number {
  if (s === "yes") return 2;
  if (s === "partial") return 1;
  return 0; // no / not_applicable / null
}

export async function compareOrganizationAudits(organizationId: string) {
  const sessions = await prisma.auditSession.findMany({
    where: { organizationId, status: "completed" },
    orderBy: { completedAt: "desc" },
    include: {
      organization: { select: { name: true } },
      template: { include: { sections: { include: { questions: true } } } },
      answers: true,
    },
  });

  const history = sessions
    .slice()
    .reverse()
    .map((s) => ({
      id: s.id,
      date: s.completedAt ?? s.createdAt,
      score: s.maturityScore != null ? Math.round(s.maturityScore) : null,
      level: s.maturityLevel,
    }));

  const orgName = sessions[0]?.organization.name ?? "";

  const norm = (s: (typeof sessions)[number] | undefined) =>
    s ? { id: s.id, score: s.maturityScore, level: s.maturityLevel, date: s.completedAt } : null;

  if (sessions.length < 2) {
    return { orgName, history, hasPair: false as const, rows: [] as ComparisonRow[], current: norm(sessions[0]), previous: null };
  }

  const current = sessions[0];
  const previous = sessions[1];

  const buildMap = (s: typeof current) => {
    const ans = new Map(s.answers.map((a) => [a.questionId, a.status as CompareStatus]));
    const m = new Map<string, { text: string; sectionCode: string; status: CompareStatus }>();
    for (const sec of s.template.sections) {
      for (const q of sec.questions) {
        if (q.inputType !== "status") continue;
        m.set(q.code, { text: q.text, sectionCode: sec.code, status: ans.get(q.id) ?? null });
      }
    }
    return m;
  };

  const currMap = buildMap(current);
  const prevMap = buildMap(previous);

  const rows: ComparisonRow[] = [];
  for (const [code, c] of currMap) {
    const p = prevMap.get(code);
    const prev: CompareStatus = p ? p.status : null;
    const curr = c.status;
    let trend: CompareTrend;
    if (!p) {
      trend = "new";
    } else {
      const dv = statusValueForCompare(curr) - statusValueForCompare(prev);
      if (dv > 0) trend = "improved";
      else if (dv < 0) trend = "regressed";
      else trend = curr === "yes" ? "unchanged" : "still_open";
    }
    rows.push({ code, text: c.text, sectionCode: c.sectionCode, prev, curr, trend });
  }

  const trendOrder: Record<CompareTrend, number> = {
    regressed: 0,
    still_open: 1,
    improved: 2,
    new: 3,
    unchanged: 4,
  };
  rows.sort((a, b) => trendOrder[a.trend] - trendOrder[b.trend] || a.text.localeCompare(b.text, "pl"));

  return {
    orgName,
    history,
    hasPair: true as const,
    rows,
    current: norm(current),
    previous: norm(previous),
  };
}
