"use server";

import { prisma, type ChecklistStatus } from "@kscsystem/db";
import { cookies } from "next/headers";

async function getCurrentOrgId(): Promise<string | null> {
  const cookieStore = await cookies();
  const orgId = cookieStore.get("kscsystem_org_id")?.value;
  if (orgId) return orgId;
  const org = await prisma.organization.findFirst({ orderBy: { createdAt: "desc" } });
  return org?.id ?? null;
}

export async function getDashboardData() {
  const orgId = await getCurrentOrgId();
  if (!orgId) {
    return {
      org: null,
      stats: { percentage: 0, done: 0, inProgress: 0, todo: 0, critical: 0, total: 0 },
      nextSteps: [],
      gaps: [],
      documentCount: 0,
      subscription: null,
    };
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: { subscription: { include: { plan: true } } },
  });

  // Checklist data
  const items = await prisma.checklistItem.findMany({
    where: {
      isActive: true,
      OR: [
        { appliesToType: "all" },
        ...(org?.type && org.type !== "unknown" ? [{ appliesToType: org.type }] : []),
      ],
    },
    orderBy: { sortOrder: "asc" },
  });

  const progress = await prisma.checklistProgress.findMany({
    where: { organizationId: orgId },
  });

  const progressMap = new Map(progress.map((p) => [p.itemId, p]));

  let done = 0, inProgress = 0, todo = 0, critical = 0, applicable = 0;

  const enrichedItems = items.map((item) => {
    const p = progressMap.get(item.id);
    const status = (p?.status ?? "todo") as ChecklistStatus;
    if (status !== "not_applicable") {
      applicable++;
      if (status === "done") done++;
      else if (status === "in_progress") inProgress++;
      else {
        todo++;
        if (item.priority === 1) critical++;
      }
    }
    return { ...item, status };
  });

  const maxScore = applicable * 100;
  const currentScore = done * 100 + inProgress * 50;
  const percentage = maxScore > 0 ? Math.round((currentScore / maxScore) * 100) : 0;

  // Next steps: in_progress items first, then highest priority todo items
  const nextSteps = enrichedItems
    .filter((i) => i.status === "in_progress" || (i.status === "todo" && i.priority <= 2))
    .sort((a, b) => {
      if (a.status === "in_progress" && b.status !== "in_progress") return -1;
      if (a.status !== "in_progress" && b.status === "in_progress") return 1;
      return a.priority - b.priority || a.sortOrder - b.sortOrder;
    })
    .slice(0, 5)
    .map((i) => ({ id: i.id, code: i.code, title: i.title, category: i.category, priority: i.priority, status: i.status }));

  // Gaps: critical items still todo
  const gaps = enrichedItems
    .filter((i) => i.status === "todo" && i.priority === 1)
    .map((i) => ({ id: i.id, code: i.code, title: i.title, category: i.category }));

  // Document count
  const documentCount = await prisma.document.count({ where: { organizationId: orgId } });

  return {
    org: org ? {
      name: org.name,
      type: org.type,
      sector: org.sector,
      nip: org.nip,
    } : null,
    stats: { percentage, done, inProgress, todo, critical, total: items.length },
    nextSteps,
    gaps,
    documentCount,
    subscription: org?.subscription ? {
      plan: org.subscription.plan.name,
      status: org.subscription.status,
      trialEndsAt: org.subscription.trialEndsAt?.toISOString() ?? null,
    } : null,
  };
}
