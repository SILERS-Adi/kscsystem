"use server";

import { prisma } from "@kscsystem/db";
import { revalidatePath } from "next/cache";

export interface PlanInput {
  name: string;
  code: string;
  description?: string;
  priceMonthly: number;
  priceYearly?: number | null;
  maxUsers: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

const code = (e: unknown) => (e as { code?: string })?.code;

export async function getPlans() {
  return prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });
}

function validate(input: PlanInput): string | null {
  if (!input.name?.trim()) return "Nazwa jest wymagana.";
  if (!input.code?.trim()) return "Kod jest wymagany.";
  if (!/^[a-z0-9_-]+$/.test(input.code.trim())) return "Kod może zawierać tylko małe litery, cyfry, - i _.";
  if (!Number.isFinite(input.priceMonthly) || input.priceMonthly < 0) return "Cena miesięczna musi być liczbą ≥ 0.";
  return null;
}

function toData(input: PlanInput) {
  return {
    name: input.name.trim(),
    code: input.code.trim(),
    description: input.description?.trim() || null,
    priceMonthly: input.priceMonthly,
    priceYearly: input.priceYearly ?? null,
    maxUsers: Math.max(1, Math.round(input.maxUsers || 1)),
    features: input.features.map((f) => f.trim()).filter(Boolean),
    isActive: input.isActive,
    sortOrder: Math.round(input.sortOrder || 0),
  };
}

export async function createPlan(input: PlanInput): Promise<{ error?: string }> {
  const err = validate(input);
  if (err) return { error: err };
  try {
    await prisma.plan.create({ data: toData(input) });
  } catch (e) {
    if (code(e) === "P2002") return { error: "Plan z tym kodem już istnieje." };
    return { error: "Nie udało się zapisać planu." };
  }
  revalidatePath("/plans");
  return {};
}

export async function updatePlan(id: string, input: PlanInput): Promise<{ error?: string }> {
  const err = validate(input);
  if (err) return { error: err };
  try {
    await prisma.plan.update({ where: { id }, data: toData(input) });
  } catch (e) {
    if (code(e) === "P2002") return { error: "Plan z tym kodem już istnieje." };
    return { error: "Nie udało się zapisać planu." };
  }
  revalidatePath("/plans");
  return {};
}

export async function togglePlanActive(id: string, isActive: boolean) {
  await prisma.plan.update({ where: { id }, data: { isActive } });
  revalidatePath("/plans");
}

export async function deletePlan(id: string): Promise<{ error?: string }> {
  try {
    await prisma.plan.delete({ where: { id } });
  } catch {
    return { error: "Nie można usunąć — plan ma powiązane subskrypcje." };
  }
  revalidatePath("/plans");
  return {};
}
