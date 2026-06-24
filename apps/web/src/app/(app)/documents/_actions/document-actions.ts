"use server";

import { prisma } from "@kscsystem/db";
import { revalidatePath } from "next/cache";
import { getSession, getSessionOrgId as getCurrentOrgId } from "@/lib/auth";

async function getOrgData(orgId: string) {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  return {
    orgName: org?.name ?? "—",
    nip: org?.nip ?? "—",
    sector: org?.sector ?? "—",
    date: new Date().toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" }),
  };
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

export async function getAvailableTemplates() {
  return prisma.documentTemplate.findMany({
    where: { status: "published", isActive: true },
    select: { id: true, name: true, type: true, description: true, version: true },
    orderBy: { name: "asc" },
  });
}

export async function getOrganizationDocuments() {
  const orgId = await getCurrentOrgId();
  if (!orgId) return [];

  return prisma.document.findMany({
    where: { organizationId: orgId },
    include: { template: { select: { name: true, type: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDocument(id: string) {
  const orgId = await getCurrentOrgId();
  if (!orgId) return null;
  // Tylko dokument WŁASNEJ organizacji (zapobiega IDOR po id).
  return prisma.document.findFirst({
    where: { id, organizationId: orgId },
    include: {
      template: { select: { name: true, type: true, version: true } },
      organization: { select: { name: true } },
    },
  });
}

export async function generateDocument(templateId: string) {
  const orgId = await getCurrentOrgId();
  if (!orgId) return { error: "Brak organizacji" };

  const template = await prisma.documentTemplate.findUnique({ where: { id: templateId } });
  if (!template) return { error: "Szablon nie istnieje" };

  const vars = await getOrgData(orgId);
  const filledContent = fillTemplate(template.content, vars);

  // Check if org already has a document from this template
  const existing = await prisma.document.findFirst({
    where: { organizationId: orgId, templateId },
    orderBy: { version: "desc" },
  });

  const session = await getSession();
  const doc = await prisma.document.create({
    data: {
      templateId,
      organizationId: orgId,
      createdById: session?.userId ?? "",
      name: template.name,
      type: template.type,
      content: filledContent,
      version: existing ? existing.version + 1 : 1,
      status: "draft",
    },
  });

  revalidatePath("/documents");
  return { documentId: doc.id };
}

export async function updateDocumentStatus(id: string, status: "draft" | "published" | "archived") {
  const orgId = await getCurrentOrgId();
  if (!orgId) return;
  // updateMany z filtrem org → no-op gdy dokument nie należy do organizacji (anty-IDOR).
  await prisma.document.updateMany({
    where: { id, organizationId: orgId },
    data: { status },
  });
  revalidatePath("/documents");
  revalidatePath(`/documents/${id}`);
}

export async function deleteDocument(id: string) {
  const orgId = await getCurrentOrgId();
  if (!orgId) return;
  await prisma.document.deleteMany({ where: { id, organizationId: orgId } });
  revalidatePath("/documents");
}
