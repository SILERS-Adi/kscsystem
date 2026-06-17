"use server";

import { prisma, type ChecklistStatus } from "@kscsystem/db";
import { computeReadiness } from "@kscsystem/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";

async function getCurrentOrgId(): Promise<string | null> {
  const cookieStore = await cookies();
  const orgId = cookieStore.get("kscsystem_org_id")?.value;
  if (orgId) return orgId;
  const org = await prisma.organization.findFirst({ orderBy: { createdAt: "desc" } });
  return org?.id ?? null;
}

function applicableWhere(orgType: string | null | undefined) {
  return {
    isActive: true,
    OR: [
      { appliesToType: "all" },
      ...(orgType && orgType !== "unknown" ? [{ appliesToType: orgType }] : []),
    ],
  };
}

/** Bieżąca gotowość na podstawie stanu żywego (ChecklistProgress). */
export async function getCurrentReadiness() {
  const orgId = await getCurrentOrgId();
  if (!orgId) return null;

  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  const items = await prisma.checklistItem.findMany({ where: applicableWhere(org?.type) });
  const progress = await prisma.checklistProgress.findMany({ where: { organizationId: orgId } });
  const map = new Map(progress.map((p) => [p.itemId, p]));

  const scored = items.map((i) => ({
    priority: i.priority,
    status: (map.get(i.id)?.status ?? "todo") as ChecklistStatus,
  }));

  const gaps = items
    .map((i) => ({ item: i, p: map.get(i.id) }))
    .filter(({ p }) => {
      const s = (p?.status ?? "todo") as ChecklistStatus;
      return s === "todo" || s === "in_progress";
    })
    .map(({ item, p }) => ({
      code: item.code,
      title: item.title,
      status: (p?.status ?? "todo") as ChecklistStatus,
      responsibleName: p?.responsibleName ?? null,
      dueDate: p?.dueDate ? p.dueDate.toISOString().slice(0, 10) : null,
    }));

  return { ...computeReadiness(scored), gaps, orgName: org?.name ?? "" };
}

export async function getOrgAudits() {
  const orgId = await getCurrentOrgId();
  if (!orgId) return [];
  return prisma.audit.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });
}

/** Raport — pobiera audyt tylko jeśli należy do firmy z sesji. */
export async function getOrgAudit(id: string) {
  const orgId = await getCurrentOrgId();
  if (!orgId) return null;
  const audit = await prisma.audit.findUnique({
    where: { id },
    include: {
      organization: true,
      conductedBy: { select: { name: true, email: true } },
      answers: { include: { item: true }, orderBy: { item: { sortOrder: "asc" } } },
    },
  });
  if (!audit || audit.organizationId !== orgId) return null;
  return audit;
}

/** Wykonuje samoocenę: migawka bieżącego stanu żywego jako zakończony audyt. */
export async function runSelfAudit() {
  const orgId = await getCurrentOrgId();
  if (!orgId) throw new Error("Brak organizacji.");

  const [session, org] = await Promise.all([
    getSession(),
    prisma.organization.findUnique({ where: { id: orgId } }),
  ]);

  const items = await prisma.checklistItem.findMany({
    where: applicableWhere(org?.type),
    orderBy: { sortOrder: "asc" },
  });
  const progress = await prisma.checklistProgress.findMany({ where: { organizationId: orgId } });
  const map = new Map(progress.map((p) => [p.itemId, p]));

  const scored = items.map((i) => ({
    priority: i.priority,
    status: (map.get(i.id)?.status ?? "todo") as ChecklistStatus,
  }));
  const result = computeReadiness(scored);

  await prisma.audit.create({
    data: {
      organizationId: orgId,
      conductedById: session?.userId ?? null,
      conductedByType: "self",
      classification: org?.type ?? "unknown",
      status: "completed",
      completedAt: new Date(),
      readiness: result.readiness,
      readinessRaw: result.readinessRaw,
      itemsTotal: result.itemsTotal,
      itemsDone: result.itemsDone,
      answers: {
        create: items.map((item) => {
          const p = map.get(item.id);
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

  revalidatePath("/audit");
}
