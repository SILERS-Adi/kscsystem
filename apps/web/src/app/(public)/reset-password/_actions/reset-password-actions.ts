"use server";

import { prisma } from "@kscsystem/db";
import { hashPassword } from "@/lib/auth";

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token) {
    return { error: "Brak tokenu resetowania." };
  }

  if (!password || password.length < 8) {
    return { error: "Haslo musi miec minimum 8 znakow." };
  }

  if (password !== confirmPassword) {
    return { error: "Hasla nie sa identyczne." };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return { error: "Nieprawidlowy link resetowania. Sprobuj ponownie." };
  }

  if (resetToken.usedAt) {
    return { error: "Ten link zostal juz uzyty. Wygeneruj nowy." };
  }

  if (resetToken.expiresAt < new Date()) {
    return { error: "Link wygasl. Wygeneruj nowy link resetowania hasla." };
  }

  // Update password and mark token as used
  const pwHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash: pwHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true };
}
