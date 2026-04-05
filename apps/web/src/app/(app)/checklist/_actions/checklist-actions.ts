"use server";

import { prisma, type ChecklistStatus } from "@kscsystem/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function getCurrentOrgId(): Promise<string | null> {
  const cookieStore = await cookies();
  const orgId = cookieStore.get("kscsystem_org_id")?.value;
  if (orgId) return orgId;

  // Fallback: first org in DB (demo mode)
  const org = await prisma.organization.findFirst({ orderBy: { createdAt: "desc" } });
  return org?.id ?? null;
}

export async function getChecklistWithProgress() {
  const orgId = await getCurrentOrgId();
  if (!orgId) return { items: [], orgId: null };

  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  const items = await prisma.checklistItem.findMany({
    where: {
      isActive: true,
      OR: [
        { appliesToType: "all" },
        ...(org?.type && org.type !== "unknown"
          ? [{ appliesToType: org.type }]
          : []),
      ],
    },
    orderBy: { sortOrder: "asc" },
  });

  const progress = await prisma.checklistProgress.findMany({
    where: { organizationId: orgId },
  });

  const progressMap = new Map(progress.map((p) => [p.itemId, p]));

  const enriched = items.map((item) => {
    const p = progressMap.get(item.id);
    return {
      ...item,
      status: (p?.status ?? "todo") as ChecklistStatus,
      completedAt: p?.completedAt?.toISOString() ?? null,
      note: p?.note ?? null,
      progressId: p?.id ?? null,
    };
  });

  return { items: enriched, orgId };
}

export async function updateChecklistStatus(
  itemId: string,
  status: ChecklistStatus,
  note?: string
) {
  const orgId = await getCurrentOrgId();
  if (!orgId) return;

  await prisma.checklistProgress.upsert({
    where: {
      organizationId_itemId: { organizationId: orgId, itemId },
    },
    update: {
      status,
      note: note ?? null,
      completedAt: status === "done" ? new Date() : null,
    },
    create: {
      organizationId: orgId,
      itemId,
      status,
      note: note ?? null,
      completedAt: status === "done" ? new Date() : null,
    },
  });

  revalidatePath("/checklist");
  revalidatePath("/dashboard");
}

export async function getComplianceStats() {
  const orgId = await getCurrentOrgId();
  if (!orgId) return { percentage: 0, done: 0, inProgress: 0, todo: 0, total: 0, critical: 0, classification: "unknown", orgName: "" };

  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  const items = await prisma.checklistItem.findMany({
    where: {
      isActive: true,
      OR: [
        { appliesToType: "all" },
        ...(org?.type && org.type !== "unknown"
          ? [{ appliesToType: org.type }]
          : []),
      ],
    },
  });

  const progress = await prisma.checklistProgress.findMany({
    where: { organizationId: orgId },
  });

  const progressMap = new Map(progress.map((p) => [p.itemId, p.status]));

  let done = 0;
  let inProgress = 0;
  let todo = 0;
  let critical = 0;
  let applicable = 0;

  for (const item of items) {
    const status = progressMap.get(item.id) ?? "todo";
    if (status === "not_applicable") continue;
    applicable++;
    if (status === "done") done++;
    else if (status === "in_progress") inProgress++;
    else {
      todo++;
      if (item.priority === 1) critical++;
    }
  }

  const maxScore = applicable * 100;
  const currentScore = done * 100 + inProgress * 50;
  const percentage = maxScore > 0 ? Math.round((currentScore / maxScore) * 100) : 0;

  return {
    percentage,
    done,
    inProgress,
    todo,
    total: items.length,
    critical,
    classification: org?.type ?? "unknown",
    orgName: org?.name ?? "",
    sector: org?.sector ?? "",
  };
}
