"use server";

import { prisma } from "@kscsystem/db";
import { revalidatePath } from "next/cache";

export async function getQuizQuestions() {
  return prisma.quizQuestion.findMany({
    include: { options: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getQuizQuestion(id: string) {
  return prisma.quizQuestion.findUnique({
    where: { id },
    include: { options: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function createQuizQuestion(formData: FormData) {
  const code = formData.get("code") as string;
  const text = formData.get("text") as string;
  const description = (formData.get("description") as string) || undefined;
  const type = (formData.get("type") as string) || "single";
  const category = (formData.get("category") as string) || undefined;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  await prisma.quizQuestion.create({
    data: { code, text, description, type, category, sortOrder },
  });

  revalidatePath("/quiz");
}

export async function updateQuizQuestion(id: string, formData: FormData) {
  const code = formData.get("code") as string;
  const text = formData.get("text") as string;
  const description = (formData.get("description") as string) || null;
  const type = (formData.get("type") as string) || "single";
  const category = (formData.get("category") as string) || null;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isActive = formData.get("isActive") === "true";

  await prisma.quizQuestion.update({
    where: { id },
    data: { code, text, description, type, category, sortOrder, isActive },
  });

  revalidatePath("/quiz");
  revalidatePath(`/quiz/${id}`);
}

export async function deleteQuizQuestion(id: string) {
  await prisma.quizQuestion.delete({ where: { id } });
  revalidatePath("/quiz");
}

export async function toggleQuizQuestion(id: string, isActive: boolean) {
  await prisma.quizQuestion.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath("/quiz");
}

// --- Quiz Options ---

export async function createQuizOption(formData: FormData) {
  const questionId = formData.get("questionId") as string;
  const text = formData.get("text") as string;
  const value = formData.get("value") as string;
  const weight = parseFloat(formData.get("weight") as string) || 0;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  await prisma.quizOption.create({
    data: { questionId, text, value, weight, sortOrder },
  });

  revalidatePath(`/quiz/${questionId}`);
}

export async function updateQuizOption(id: string, formData: FormData) {
  const text = formData.get("text") as string;
  const value = formData.get("value") as string;
  const weight = parseFloat(formData.get("weight") as string) || 0;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  const option = await prisma.quizOption.update({
    where: { id },
    data: { text, value, weight, sortOrder },
  });

  revalidatePath(`/quiz/${option.questionId}`);
}

export async function deleteQuizOption(id: string) {
  const option = await prisma.quizOption.findUnique({ where: { id } });
  await prisma.quizOption.delete({ where: { id } });
  if (option) revalidatePath(`/quiz/${option.questionId}`);
}
