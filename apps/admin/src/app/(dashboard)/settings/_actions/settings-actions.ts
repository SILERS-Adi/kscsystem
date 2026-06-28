"use server";

import { prisma } from "@kscsystem/db";
import { revalidatePath } from "next/cache";

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
}

export async function saveSettings(entries: Record<string, string>): Promise<{ ok: boolean }> {
  await Promise.all(
    Object.entries(entries).map(([key, value]) =>
      prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );
  revalidatePath("/settings");
  return { ok: true };
}
