"use server";

import { redirect } from "next/navigation";
import { prisma } from "@kscsystem/db";
import { verifyPassword, createSession } from "@/lib/auth";

function safeRedirectTarget(raw: FormDataEntryValue | null): string {
  const value = typeof raw === "string" ? raw : "";
  // Zezwalamy tylko na ścieżki wewnętrzne (bez //, bez http)
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return "/";
}

export interface LoginState {
  error?: string;
}

export async function loginAdmin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = ((formData.get("email") as string) ?? "").trim().toLowerCase();
  const password = (formData.get("password") as string) ?? "";

  if (!email || !password) {
    return { error: "Podaj email i hasło." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Ten sam komunikat dla różnych przyczyn — nie ujawniamy, co konkretnie nie pasuje
  if (!user || !user.passwordHash || !user.isActive) {
    return { error: "Nieprawidłowy email lub hasło." };
  }

  // Tylko superadmin ma dostęp do panelu
  if (user.role !== "superadmin") {
    return { error: "Brak uprawnień do panelu administracyjnego." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Nieprawidłowy email lub hasło." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name ?? "",
    role: user.role,
  });

  redirect(safeRedirectTarget(formData.get("redirect")));
}
