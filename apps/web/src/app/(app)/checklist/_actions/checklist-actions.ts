"use server";

import { prisma, type ChecklistStatus } from "@kscsystem/db";
import { revalidatePath } from "next/cache";

// TODO: Replace with real auth — for now hardcoded org
const DEMO_ORG_ID_QUERY = { nip: "1234567890" };

async function getDemoOrgId() {
  const org = await prisma.organization.findUnique({ where: DEMO_ORG_ID_QUERY });
  return org?.id ?? null;
}

export async function getChecklistWithProgress() {
  const orgId = await getDemoOrgId();
  if (!orgId) return { items: [], orgId: null };

  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  // Get active checklist items applicable to this org type
  const items = await prisma.checklistItem.findMany({
    where: {
      isActive: true,
      OR: [
        { appliesToType: "all" },
        { appliesToType: org?.type === "essential" ? "essential" : org?.type === "important" ? "important" : "all" },
      ],
    },
    orderBy: { sortOrder: "asc" },
  });

  // Get existing progress for this org
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
  const orgId = await getDemoOrgId();
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
  const orgId = await getDemoOrgId();
  if (!orgId) return { percentage: 0, done: 0, inProgress: 0, todo: 0, total: 0, classification: "unknown" };

  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  const items = await prisma.checklistItem.findMany({
    where: {
      isActive: true,
      OR: [
        { appliesToType: "all" },
        { appliesToType: org?.type === "essential" ? "essential" : org?.type === "important" ? "important" : "all" },
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
  let applicable = 0;

  for (const item of items) {
    const status = progressMap.get(item.id) ?? "todo";
    if (status === "not_applicable") continue;
    applicable++;
    if (status === "done") done++;
    else if (status === "in_progress") inProgress++;
    else todo++;
  }

  // done = 100, in_progress = 50, todo = 0, not_applicable = skip
  const maxScore = applicable * 100;
  const currentScore = done * 100 + inProgress * 50;
  const percentage = maxScore > 0 ? Math.round((currentScore / maxScore) * 100) : 0;

  return {
    percentage,
    done,
    inProgress,
    todo,
    total: items.length,
    classification: org?.type ?? "unknown",
    orgName: org?.name ?? "",
  };
}
