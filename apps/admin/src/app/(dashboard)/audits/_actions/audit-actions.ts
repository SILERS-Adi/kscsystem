"use server";

import { prisma } from "@kscsystem/db";
import { computeReadiness, type ChecklistStatus } from "@kscsystem/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

/** Mapuje typ organizacji na wartości appliesToType punktów checklisty. */
function applicableTypes(orgType: string | null | undefined): string[] {
  if (orgType === "essential") return ["all", "essential"];
  if (orgType === "important") return ["all", "important"];
  return ["all"]; // unknown
}

export async function getOrganizationsForAudit() {
  return prisma.organization.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, nip: true, type: true },
  });
}

export async function getAudits() {
  return prisma.audit.findMany({
    orderBy: { createdAt: "desc" },
    include: { organization: { select: { name: true } } },
  });
}

export async function getAudit(id: string) {
  return prisma.audit.findUnique({
    where: { id },
    include: {
      organization: true,
      conductedBy: { select: { name: true, email: true } },
      answers: {
        include: { item: true },
        orderBy: { item: { sortOrder: "asc" } },
      },
    },
  });
}

/** Tworzy nowy audyt (migawkę) dla firmy i zalążkuje odpowiedzi z aktualnego stanu żywego. */
export async function createAudit(formData: FormData) {
  const organizationId = formData.get("organizationId") as string;
  const conductedByType = (formData.get("conductedByType") as string) || "consultant";

  if (!organizationId) {
    throw new Error("Wybierz organizację.");
  }

  const [session, org] = await Promise.all([
    getSession(),
    prisma.organization.findUnique({ where: { id: organizationId } }),
  ]);

  if (!org) throw new Error("Nie znaleziono organizacji.");

  // Punkty checklisty właściwe dla klasyfikacji firmy
  const items = await prisma.checklistItem.findMany({
    where: { isActive: true, appliesToType: { in: applicableTypes(org.type) } },
    orderBy: { sortOrder: "asc" },
  });

  // Aktualny stan żywy (jeśli istnieje) — zalążkujemy nim odpowiedzi
  const progress = await prisma.checklistProgress.findMany({
    where: { organizationId },
  });
  const progressByItem = new Map(progress.map((p) => [p.itemId, p]));

  const audit = await prisma.audit.create({
    data: {
      organizationId,
      conductedById: session?.userId ?? null,
      conductedByType,
      classification: org.type,
      status: "draft",
      itemsTotal: items.length,
      answers: {
        create: items.map((item) => {
          const p = progressByItem.get(item.id);
          return {
            itemId: item.id,
            status: (p?.status ?? "todo") as ChecklistStatus,
            note: p?.note ?? null,
            evidenceUrl: p?.evidenceUrl ?? null,
            responsibleName: p?.responsibleName ?? null,
            dueDate: p?.dueDate ?? null,
          };
        }),
      },
    },
  });

  redirect(`/audits/${audit.id}`);
}

export interface AuditAnswerInput {
  status: ChecklistStatus;
  note?: string;
  evidenceUrl?: string;
  responsibleName?: string;
  dueDate?: string; // ISO yyyy-mm-dd lub puste
}

export async function saveAuditAnswer(answerId: string, input: AuditAnswerInput) {
  const answer = await prisma.auditAnswer.update({
    where: { id: answerId },
    data: {
      status: input.status,
      note: input.note?.trim() || null,
      evidenceUrl: input.evidenceUrl?.trim() || null,
      responsibleName: input.responsibleName?.trim() || null,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    },
    select: { auditId: true },
  });

  revalidatePath(`/audits/${answer.auditId}`);
}

/** Finalizuje audyt: liczy gotowość, oznacza jako completed i synchronizuje stan żywy. */
export async function completeAudit(auditId: string) {
  const audit = await prisma.audit.findUnique({
    where: { id: auditId },
    include: { answers: { include: { item: true } } },
  });
  if (!audit) throw new Error("Nie znaleziono audytu.");

  const scored = audit.answers.map((a) => ({
    priority: a.item.priority,
    status: a.status as ChecklistStatus,
  }));
  const result = computeReadiness(scored);

  await prisma.$transaction([
    prisma.audit.update({
      where: { id: auditId },
      data: {
        status: "completed",
        completedAt: new Date(),
        readiness: result.readiness,
        readinessRaw: result.readinessRaw,
        itemsTotal: result.itemsTotal,
        itemsDone: result.itemsDone,
      },
    }),
    // Synchronizacja stanu żywego organizacji ze stanem z audytu
    ...audit.answers.map((a) =>
      prisma.checklistProgress.upsert({
        where: {
          organizationId_itemId: { organizationId: audit.organizationId, itemId: a.itemId },
        },
        create: {
          organizationId: audit.organizationId,
          itemId: a.itemId,
          status: a.status,
          note: a.note,
          evidenceUrl: a.evidenceUrl,
          responsibleName: a.responsibleName,
          dueDate: a.dueDate,
          completedAt: a.status === "done" ? new Date() : null,
        },
        update: {
          status: a.status,
          note: a.note,
          evidenceUrl: a.evidenceUrl,
          responsibleName: a.responsibleName,
          dueDate: a.dueDate,
          completedAt: a.status === "done" ? new Date() : null,
        },
      })
    ),
  ]);

  revalidatePath(`/audits/${auditId}`);
  revalidatePath("/audits");
}

export async function deleteAudit(auditId: string) {
  await prisma.audit.delete({ where: { id: auditId } });
  revalidatePath("/audits");
  redirect("/audits");
}
