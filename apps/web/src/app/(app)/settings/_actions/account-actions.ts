"use server";

import { prisma } from "@kscsystem/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";

export async function getMyAccount() {
  const s = await getSession();
  if (!s?.userId) return null;
  return prisma.user.findUnique({
    where: { id: s.userId },
    select: { name: true, email: true, role: true },
  });
}

export async function updateMyName(name: string): Promise<{ error?: string; ok?: boolean }> {
  const s = await getSession();
  if (!s?.userId) return { error: "Brak sesji." };
  await prisma.user.update({ where: { id: s.userId }, data: { name: name.trim() || null } });
  revalidatePath("/settings");
  return { ok: true };
}

export async function changeMyPassword(current: string, next: string): Promise<{ error?: string; ok?: boolean }> {
  const s = await getSession();
  if (!s?.userId) return { error: "Brak sesji." };
  if (!next || next.length < 8) return { error: "Nowe hasło musi mieć min. 8 znaków." };

  const user = await prisma.user.findUnique({ where: { id: s.userId } });
  if (!user?.passwordHash) return { error: "Konto bez hasła — skorzystaj z resetu hasła." };

  const ok = await bcrypt.compare(current, user.passwordHash);
  if (!ok) return { error: "Obecne hasło jest nieprawidłowe." };

  await prisma.user.update({ where: { id: s.userId }, data: { passwordHash: await bcrypt.hash(next, 12) } });
  return { ok: true };
}
