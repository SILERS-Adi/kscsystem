"use server";

import { prisma } from "@kscsystem/db";
import { revalidatePath } from "next/cache";

export async function getDocumentTemplates() {
  return prisma.documentTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getDocumentTemplate(id: string) {
  return prisma.documentTemplate.findUnique({ where: { id } });
}

export async function createDocumentTemplate(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const description = (formData.get("description") as string) || null;
  const content = formData.get("content") as string;

  await prisma.documentTemplate.create({
    data: { name, type, description, content, status: "draft" },
  });

  revalidatePath("/templates");
}

export async function updateDocumentTemplate(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const description = (formData.get("description") as string) || null;
  const content = formData.get("content") as string;
  const status = formData.get("status") as "draft" | "published" | "archived";
  const bumpVersion = formData.get("bumpVersion") === "true";

  const current = await prisma.documentTemplate.findUnique({ where: { id } });

  await prisma.documentTemplate.update({
    where: { id },
    data: {
      name,
      type,
      description,
      content,
      status,
      version: bumpVersion ? (current?.version ?? 0) + 1 : undefined,
    },
  });

  revalidatePath("/templates");
}

export async function deleteDocumentTemplate(id: string) {
  await prisma.documentTemplate.delete({ where: { id } });
  revalidatePath("/templates");
}
