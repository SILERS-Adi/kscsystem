import { prisma } from "@kscsystem/db";
import { Avatar, Badge } from "@kscsystem/ui";
import { Bell } from "lucide-react";

const classLabels: Record<string, string> = {
  essential: "Podmiot kluczowy",
  important: "Podmiot ważny",
  unknown: "Nieokreślony",
};

export async function AppTopbar() {
  const org = await prisma.organization.findFirst({
    where: { nip: "1234567890" },
    include: { users: { where: { role: "org_admin" }, take: 1 } },
  });

  const user = org?.users[0];

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
          <Avatar fallback={user?.name ?? "U"} size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name ?? "Użytkownik"}</p>
            <p className="text-xs text-gray-500">{user?.role ?? "member"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
