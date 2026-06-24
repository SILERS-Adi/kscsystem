"use server";

import { prisma, type IncidentSeverity, type IncidentStatus } from "@kscsystem/db";
import { revalidatePath } from "next/cache";
import { getSession, getSessionOrgId } from "@/lib/auth";

export async function getIncidents() {
  const orgId = await getSessionOrgId();
  if (!orgId) return [];
  return prisma.incident.findMany({
    where: { organizationId: orgId },
    include: { reportedBy: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getIncidentStats() {
  const orgId = await getSessionOrgId();
  if (!orgId) return { open: 0, investigating: 0, total: 0, overdue: 0, unreported: 0 };

  const incidents = await prisma.incident.findMany({
    where: { organizationId: orgId },
    select: { status: true, detectedAt: true, createdAt: true, csirtReportedAt: true },
  });

  const now = Date.now();
  let open = 0, investigating = 0, overdue = 0, unreported = 0;
  for (const i of incidents) {
    if (i.status === "open") open++;
    if (i.status === "investigating") investigating++;
    const active = i.status === "open" || i.status === "investigating";
    if (active && !i.csirtReportedAt) {
      unreported++;
      const basis = (i.detectedAt ?? i.createdAt).getTime();
      if (now - basis > 24 * 3600_000) overdue++;
    }
  }
  return { open, investigating, total: incidents.length, overdue, unreported };
}

export interface CreateIncidentInput {
  title: string;
  description: string;
  severity: IncidentSeverity;
  detectedAt?: string; // datetime-local
}

export async function createIncident(input: CreateIncidentInput): Promise<{ error?: string }> {
  const [orgId, session] = await Promise.all([getSessionOrgId(), getSession()]);
  if (!orgId || !session?.userId) return { error: "Brak sesji organizacji." };

  const title = input.title?.trim();
  const description = input.description?.trim();
  if (!title || !description) return { error: "Podaj tytuł i opis incydentu." };

  await prisma.incident.create({
    data: {
      organizationId: orgId,
      reportedById: session.userId,
      title,
      description,
      severity: input.severity ?? "medium",
      status: "open",
      detectedAt: input.detectedAt ? new Date(input.detectedAt) : new Date(),
    },
  });

  revalidatePath("/incidents");
  revalidatePath("/dashboard");
  return {};
}

export async function updateIncidentStatus(id: string, status: IncidentStatus) {
  const orgId = await getSessionOrgId();
  if (!orgId) return;
  const resolved = status === "resolved" || status === "closed";
  // updateMany z filtrem org → anty-IDOR (no-op gdy nie nasza organizacja).
  await prisma.incident.updateMany({
    where: { id, organizationId: orgId },
    data: { status, resolvedAt: resolved ? new Date() : null },
  });
  revalidatePath("/incidents");
}

export async function markCsirtReported(id: string) {
  const orgId = await getSessionOrgId();
  if (!orgId) return;
  await prisma.incident.updateMany({
    where: { id, organizationId: orgId, csirtReportedAt: null },
    data: { csirtReportedAt: new Date() },
  });
  revalidatePath("/incidents");
}
