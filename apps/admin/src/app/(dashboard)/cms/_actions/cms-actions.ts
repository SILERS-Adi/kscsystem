"use server";

import { prisma } from "@kscsystem/db";
import { revalidatePath } from "next/cache";

export interface CmsInput {
  key: string;
  section: string;
  title?: string;
  content?: string;
  isPublished?: boolean;
}

const clean = (s?: string) => {
  const t = s?.trim();
  return t ? t : null;
};
const errcode = (e: unknown) => (e as { code?: string })?.code;

export async function getCmsContent() {
  return prisma.cmsContent.findMany({ orderBy: [{ section: "asc" }, { key: "asc" }] });
}

function validate(input: CmsInput): string | null {
  if (!input.key?.trim()) return "Klucz jest wymagany.";
  if (!/^[a-z0-9_]+$/.test(input.key.trim())) return "Klucz: tylko małe litery, cyfry i _.";
  if (!input.section?.trim()) return "Sekcja jest wymagana.";
  return null;
}

export async function createCmsContent(input: CmsInput): Promise<{ error?: string }> {
  const err = validate(input);
  if (err) return { error: err };
  try {
    await prisma.cmsContent.create({
      data: {
        key: input.key.trim(),
        section: input.section.trim(),
        title: clean(input.title),
        content: clean(input.content),
        isPublished: input.isPublished ?? false,
      },
    });
  } catch (e) {
    if (errcode(e) === "P2002") return { error: "Treść z tym kluczem już istnieje." };
    return { error: "Nie udało się zapisać treści." };
  }
  revalidatePath("/cms");
  return {};
}

export async function updateCmsContent(id: string, input: CmsInput): Promise<{ error?: string }> {
  const err = validate(input);
  if (err) return { error: err };
  try {
    await prisma.cmsContent.update({
      where: { id },
      data: {
        key: input.key.trim(),
        section: input.section.trim(),
        title: clean(input.title),
        content: clean(input.content),
        isPublished: input.isPublished ?? false,
      },
    });
  } catch (e) {
    if (errcode(e) === "P2002") return { error: "Treść z tym kluczem już istnieje." };
    return { error: "Nie udało się zapisać treści." };
  }
  revalidatePath("/cms");
  return {};
}

export async function toggleCmsPublished(id: string, isPublished: boolean) {
  await prisma.cmsContent.update({ where: { id }, data: { isPublished } });
  revalidatePath("/cms");
}

export async function deleteCmsContent(id: string): Promise<{ error?: string }> {
  try {
    await prisma.cmsContent.delete({ where: { id } });
  } catch {
    return { error: "Nie udało się usunąć treści." };
  }
  revalidatePath("/cms");
  return {};
}
