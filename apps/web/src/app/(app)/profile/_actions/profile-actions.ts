"use server";

import { prisma } from "@kscsystem/db";
import { revalidatePath } from "next/cache";
import { getSessionOrgId } from "@/lib/auth";

export async function getMyOrg() {
  const orgId = await getSessionOrgId();
  if (!orgId) return null;
  return prisma.organization.findUnique({
    where: { id: orgId },
    include: { subscription: { include: { plan: true } }, _count: { select: { users: true } } },
  });
}

export interface OrgProfileInput {
  name: string;
  nip?: string;
  sector?: string;
  size?: string;
  website?: string;
  phone?: string;
  address?: string;
}

const clean = (s?: string) => {
  const t = s?.trim();
  return t ? t : null;
};

export async function updateMyOrg(input: OrgProfileInput): Promise<{ error?: string }> {
  const orgId = await getSessionOrgId();
  if (!orgId) return { error: "Brak sesji organizacji." };
  if (!input.name?.trim()) return { error: "Nazwa firmy jest wymagana." };
  try {
    // Tylko WŁASNA organizacja (id z sesji) — bez możliwości edycji cudzej.
    await prisma.organization.update({
      where: { id: orgId },
      data: {
        name: input.name.trim(),
        nip: clean(input.nip),
        sector: clean(input.sector),
        size: clean(input.size),
        website: clean(input.website),
        phone: clean(input.phone),
        address: clean(input.address),
      },
    });
  } catch (e) {
    if ((e as { code?: string })?.code === "P2002") return { error: "Ten NIP jest już zajęty." };
    return { error: "Nie udało się zapisać zmian." };
  }
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return {};
}
