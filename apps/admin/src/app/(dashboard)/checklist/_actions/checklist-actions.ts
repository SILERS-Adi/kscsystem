"use server";

import { prisma } from "@kscsystem/db";
import { revalidatePath } from "next/cache";

export async function getChecklistItems() {
  return prisma.checklistItem.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function createChecklistItem(formData: FormData) {
  const code = formData.get("code") as string;
  const category = formData.get("category") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = parseInt(formData.get("priority") as string) || 1;
  const appliesToType = (formData.get("appliesToType") as string) || "all";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  await prisma.checklistItem.create({
    data: { code, category, title, description, priority, appliesToType, sortOrder },
  });

  revalidatePath("/checklist");
}

export async function updateChecklistItem(id: string, formData: FormData) {
  const code = formData.get("code") as string;
  const category = formData.get("category") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = parseInt(formData.get("priority") as string) || 1;
  const appliesToType = (formData.get("appliesToType") as string) || "all";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isActive = formData.get("isActive") === "true";

  await prisma.checklistItem.update({
    where: { id },
    data: { code, category, title, description, priority, appliesToType, sortOrder, isActive },
  });

  revalidatePath("/checklist");
}

export async function deleteChecklistItem(id: string) {
  await prisma.checklistItem.delete({ where: { id } });
  revalidatePath("/checklist");
}

export async function toggleChecklistItem(id: string, isActive: boolean) {
  await prisma.checklistItem.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath("/checklist");
}
