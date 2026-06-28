"use server";

import { prisma, type OrganizationType } from "@kscsystem/db";
import { revalidatePath } from "next/cache";

export interface OrgInput {
  name: string;
  nip?: string;
  sector?: string;
  size?: string;
  type?: string;
  website?: string;
  phone?: string;
  address?: string;
}

const clean = (s?: string) => {
  const t = s?.trim();
  return t ? t : null;
};
const code = (e: unknown) => (e as { code?: string })?.code;

export async function getOrganizations() {
  return prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { users: true, auditSessions: true } },
      subscription: { include: { plan: { select: { name: true } } } },
    },
  });
}

function toData(input: OrgInput) {
  return {
    name: input.name.trim(),
    nip: clean(input.nip),
    sector: clean(input.sector),
    size: clean(input.size),
    type: ((input.type as OrganizationType) || "unknown") as OrganizationType,
    website: clean(input.website),
    phone: clean(input.phone),
    address: clean(input.address),
  };
}

export async function createOrganization(input: OrgInput): Promise<{ error?: string }> {
  if (!input.name?.trim()) return { error: "Nazwa jest wymagana." };
  try {
    await prisma.organization.create({ data: toData(input) });
  } catch (e) {
    if (code(e) === "P2002") return { error: "Organizacja z tym NIP już istnieje." };
    return { error: "Nie udało się zapisać organizacji." };
  }
  revalidatePath("/organizations");
  return {};
}

export async function updateOrganization(id: string, input: OrgInput): Promise<{ error?: string }> {
  if (!input.name?.trim()) return { error: "Nazwa jest wymagana." };
  try {
    await prisma.organization.update({ where: { id }, data: toData(input) });
  } catch (e) {
    if (code(e) === "P2002") return { error: "Organizacja z tym NIP już istnieje." };
    return { error: "Nie udało się zapisać organizacji." };
  }
  revalidatePath("/organizations");
  return {};
}

export async function deleteOrganization(id: string): Promise<{ error?: string }> {
  try {
    await prisma.organization.delete({ where: { id } });
  } catch {
    return { error: "Nie można usunąć — organizacja ma powiązane dane (użytkownicy, audyty, płatności)." };
  }
  revalidatePath("/organizations");
  return {};
}
