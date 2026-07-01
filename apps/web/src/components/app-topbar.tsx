import Link from "next/link";
import { prisma } from "@kscsystem/db";
import { Avatar, Badge } from "@kscsystem/ui";
import { Bell } from "lucide-react";
import { getSession } from "@/lib/auth";

const classLabels: Record<string, string> = {
  essential: "Podmiot kluczowy",
  important: "Podmiot ważny",
  unknown: "Nieokreślony",
};

export async function AppTopbar() {
  const session = await getSession();

  // Organizacja WYŁĄCZNIE z sesji — bez fallbacku do losowej org w bazie.
  const org = session?.orgId
    ? await prisma.organization.findUnique({ where: { id: session.orgId } })
    : null;

  // Wskaźnik: incydenty po terminie zgłoszenia do CSIRT (24h), niezgłoszone.
  let attention = 0;
  if (session?.orgId) {
    const incs = await prisma.incident.findMany({
      where: { organizationId: session.orgId, status: { in: ["open", "investigating"] }, csirtReportedAt: null },
      select: { detectedAt: true, createdAt: true },
    });
    const now = Date.now();
    attention = incs.filter((i) => now - (i.detectedAt ?? i.createdAt).getTime() > 24 * 3600_000).length;
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-xl px-6">
      <div>
        <h2 className="text-sm font-medium text-gray-400">{org?.name ?? "—"}</h2>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="default">{classLabels[org?.type ?? "unknown"] ?? org?.type}</Badge>

        <Link
          href="/incidents"
          className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors"
          title={attention > 0 ? `${attention} incydent(ów) po terminie zgłoszenia do CSIRT` : "Incydenty"}
        >
          <Bell size={18} className="text-gray-400" />
          {attention > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {attention}
            </span>
          )}
        </Link>


        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-3">
          <Avatar fallback={session?.name ?? "U"} size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{session?.name ?? "Użytkownik"}</p>
            <p className="text-xs text-gray-500">{session?.role ?? "member"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
