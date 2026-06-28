import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@kscsystem/ui";
import { getOrganizations } from "./_actions/organization-actions";
import { OrgManager, type OrgView } from "./_components/org-manager";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const orgs = await getOrganizations();
  const items: OrgView[] = orgs.map((o) => ({
    id: o.id,
    name: o.name,
    nip: o.nip,
    sector: o.sector,
    size: o.size,
    type: o.type,
    website: o.website,
    phone: o.phone,
    address: o.address,
    users: o._count.users,
    audits: o._count.auditSessions,
    plan: o.subscription?.plan?.name ?? null,
  }));

  return (
    <div>
      <PageHeader title="Organizacje" description="Zarządzanie firmami w systemie" />
      <Card>
        <CardHeader>
          <CardTitle>Organizacje ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <OrgManager orgs={items} />
        </CardContent>
      </Card>
    </div>
  );
}
