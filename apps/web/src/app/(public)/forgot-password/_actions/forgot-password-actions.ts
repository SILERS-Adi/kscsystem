"use server";

import { prisma } from "@kscsystem/db";
import { sendPasswordResetEmail } from "@kscsystem/email";
import { randomBytes } from "crypto";

export async function requestPasswordReset(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email) {
    return { error: "Podaj adres email." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (!user || !user.passwordHash) {
    return { success: true };
  }

  // Invalidate existing tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  // Create new token
  const token = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_WEB_URL || "https://kscsystem.pl"}/reset-password?token=${token}`;

  sendPasswordResetEmail(user.email, resetUrl).catch(console.error);

  return { success: true };
}
