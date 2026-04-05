"use server";

import { prisma } from "@kscsystem/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function loginUser(formData: FormData) {
  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Podaj email i hasło." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { organization: true },
  });

  if (!user || !user.passwordHash) {
    return { error: "Nieprawidłowy email lub hasło." };
  }

  if (!user.isActive) {
    return { error: "Konto jest nieaktywne. Skontaktuj się z administratorem." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Nieprawidłowy email lub hasło." };
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Create session
  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name ?? "",
    role: user.role,
    orgId: user.organizationId,
  });

  return { success: true, redirect: "/dashboard" };
}
