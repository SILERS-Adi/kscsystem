"use server";

import { prisma } from "@kscsystem/db";
import { revalidatePath } from "next/cache";

export async function getScoringRules() {
  return prisma.scoringRule.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function createScoringRule(formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || undefined;
  const category = (formData.get("category") as string) || undefined;
  const score = parseFloat(formData.get("score") as string) || 0;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  const conditionField = formData.get("conditionField") as string;
  const conditionOperator = formData.get("conditionOperator") as string;
  const conditionValue = parseFloat(formData.get("conditionValue") as string) || 0;

  await prisma.scoringRule.create({
    data: {
      name,
      description,
      category,
      score,
      sortOrder,
      condition: { field: conditionField, operator: conditionOperator, value: conditionValue },
    },
  });

  revalidatePath("/scoring");
}

export async function updateScoringRule(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const category = (formData.get("category") as string) || null;
  const score = parseFloat(formData.get("score") as string) || 0;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isActive = formData.get("isActive") === "true";

  const conditionField = formData.get("conditionField") as string;
  const conditionOperator = formData.get("conditionOperator") as string;
  const conditionValue = parseFloat(formData.get("conditionValue") as string) || 0;

  await prisma.scoringRule.update({
    where: { id },
    data: {
      name,
      description,
      category,
      score,
      sortOrder,
      isActive,
      condition: { field: conditionField, operator: conditionOperator, value: conditionValue },
    },
  });

  revalidatePath("/scoring");
}

export async function deleteScoringRule(id: string) {
  await prisma.scoringRule.delete({ where: { id } });
  revalidatePath("/scoring");
}

export async function toggleScoringRule(id: string, isActive: boolean) {
  await prisma.scoringRule.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath("/scoring");
}
