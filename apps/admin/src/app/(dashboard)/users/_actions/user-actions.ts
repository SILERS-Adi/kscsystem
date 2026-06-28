"use server";

import { prisma, type UserRole } from "@kscsystem/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export interface UserInput {
  email: string;
  name?: string;
  role?: string;
  organizationId?: string;
  isActive?: boolean;
  password?: string;
}

const clean = (s?: string) => {
  const t = s?.trim();
  return t ? t : null;
};
const code = (e: unknown) => (e as { code?: string })?.code;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { organization: { select: { name: true } } },
  });
}

export async function getOrganizationsLite() {
  return prisma.organization.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
}

export async function createUser(input: UserInput): Promise<{ error?: string }> {
  const email = input.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) return { error: "Podaj poprawny adres email." };
  try {
    await prisma.user.create({
      data: {
        email,
        name: clean(input.name),
        role: ((input.role as UserRole) || "member") as UserRole,
        organizationId: clean(input.organizationId),
        isActive: input.isActive ?? true,
        passwordHash: input.password?.trim() ? await bcrypt.hash(input.password.trim(), 12) : null,
      },
    });
  } catch (e) {
    if (code(e) === "P2002") return { error: "Użytkownik z tym emailem już istnieje." };
    return { error: "Nie udało się zapisać użytkownika." };
  }
  revalidatePath("/users");
  return {};
}

export async function updateUser(id: string, input: UserInput): Promise<{ error?: string }> {
  const email = input.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) return { error: "Podaj poprawny adres email." };
  try {
    await prisma.user.update({
      where: { id },
      data: {
        email,
        name: clean(input.name),
        role: ((input.role as UserRole) || "member") as UserRole,
        organizationId: clean(input.organizationId),
        isActive: input.isActive ?? true,
        // Hasło zmieniamy tylko gdy podane (puste = bez zmiany).
        ...(input.password?.trim() ? { passwordHash: await bcrypt.hash(input.password.trim(), 12) } : {}),
      },
    });
  } catch (e) {
    if (code(e) === "P2002") return { error: "Użytkownik z tym emailem już istnieje." };
    return { error: "Nie udało się zapisać użytkownika." };
  }
  revalidatePath("/users");
  return {};
}

export async function toggleUserActive(id: string, isActive: boolean) {
  await prisma.user.update({ where: { id }, data: { isActive } });
  revalidatePath("/users");
}

export async function deleteUser(id: string): Promise<{ error?: string }> {
  try {
    await prisma.user.delete({ where: { id } });
  } catch {
    return { error: "Nie można usunąć — użytkownik ma powiązane dane (audyty, dokumenty)." };
  }
  revalidatePath("/users");
  return {};
}
