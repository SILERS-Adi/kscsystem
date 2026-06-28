import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@kscsystem/ui";
import { getUsers, getOrganizationsLite } from "./_actions/user-actions";
import { UserManager, type UserView } from "./_components/user-manager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [users, orgs] = await Promise.all([getUsers(), getOrganizationsLite()]);
  const items: UserView[] = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    organizationId: u.organizationId,
    isActive: u.isActive,
    orgName: u.organization?.name ?? null,
  }));

  return (
    <div>
      <PageHeader title="Użytkownicy" description="Zarządzanie użytkownikami systemu" />
      <Card>
        <CardHeader>
          <CardTitle>Wszyscy użytkownicy ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UserManager users={items} orgs={orgs} />
        </CardContent>
      </Card>
    </div>
  );
}
