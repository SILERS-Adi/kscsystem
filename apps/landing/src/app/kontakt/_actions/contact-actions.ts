"use server";

import { prisma } from "@kscsystem/db";
import { sendContactNotification } from "@kscsystem/email";

export interface ContactInput {
  name?: string;
  email: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(input: ContactInput): Promise<{ error?: string; ok?: boolean }> {
  const email = input.email?.trim().toLowerCase();
  const message = input.message?.trim();
  if (!email || !EMAIL_RE.test(email)) return { error: "Podaj poprawny adres email." };
  if (!message) return { error: "Wpisz treść wiadomości." };

  try {
    await prisma.lead.create({
      data: {
        email,
        name: input.name?.trim() || null,
        source: "contact",
        notes: message,
      },
    });
  } catch {
    return { error: "Nie udało się wysłać wiadomości. Spróbuj ponownie." };
  }

  // Powiadomienie mailowe (nie blokuje zapisu leada w razie błędu SMTP).
  sendContactNotification({ name: input.name?.trim(), email, message }).catch(() => {});

  return { ok: true };
}
