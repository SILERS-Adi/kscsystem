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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-xl px-6">
      <div>
        <h2 className="text-sm font-medium text-gray-400">{org?.name ?? "—"}</h2>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="default">{classLabels[org?.type ?? "unknown"] ?? org?.type}</Badge>

        <button className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors">
          <Bell size={18} className="text-gray-400" />
        </button>

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
