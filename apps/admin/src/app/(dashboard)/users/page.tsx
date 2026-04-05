import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge, Avatar, Button } from "@kscsystem/ui";
import { Plus } from "lucide-react";

const mockUsers = [
  { name: "Adrian Silers", email: "adrian@silers.pl", role: "superadmin", org: "—", isActive: true },
  { name: "Jan Kowalski", email: "jan@techcorp.pl", role: "org_admin", org: "TechCorp", isActive: true },
  { name: "Anna Nowak", email: "anna@secureit.pl", role: "member", org: "SecureIT S.A.", isActive: true },
  { name: "Piotr Wiśniewski", email: "piotr@dataguard.pl", role: "org_admin", org: "DataGuard", isActive: false },
];

const roleVariant = { superadmin: "destructive", org_admin: "default", member: "outline" } as const;

export default function UsersPage() {
  return (
    <div>
      <PageHeader title="Użytkownicy" description="Zarządzanie użytkownikami systemu">
        <Button size="sm">
          <Plus size={16} />
          Dodaj użytkownika
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Wszyscy użytkownicy ({mockUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockUsers.map((user, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4">
                <Avatar fallback={user.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className="text-xs text-gray-500">{user.org}</span>
                <Badge variant={roleVariant[user.role as keyof typeof roleVariant]}>{user.role}</Badge>
                <Badge variant={user.isActive ? "accent" : "muted"}>
                  {user.isActive ? "Aktywny" : "Nieaktywny"}
                </Badge>
                <Button variant="ghost" size="sm">Edytuj</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
