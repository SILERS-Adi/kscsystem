import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge, ProgressBar } from "@kscsystem/ui";

const mockOrgs = [
  { name: "TechCorp Sp. z o.o.", nip: "1234567890", type: "essential", sector: "Energia", plan: "Professional", compliance: 72, users: 5 },
  { name: "SecureIT S.A.", nip: "0987654321", type: "important", sector: "IT", plan: "Enterprise", compliance: 45, users: 12 },
  { name: "DataGuard Sp. z o.o.", nip: "1122334455", type: "essential", sector: "Telekomunikacja", plan: "Starter", compliance: 30, users: 2 },
];

const typeVariant = { essential: "destructive", important: "warning", unknown: "muted" } as const;

export default function OrganizationsPage() {
  return (
    <div>
      <PageHeader title="Organizacje" description="Zarządzanie firmami w systemie" />

      <Card>
        <CardHeader>
          <CardTitle>Organizacje ({mockOrgs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockOrgs.map((org, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface-50 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-white">{org.name}</p>
                    <p className="text-xs text-gray-500">NIP: {org.nip} · {org.sector} · {org.users} użytkowników</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={typeVariant[org.type as keyof typeof typeVariant]}>{org.type}</Badge>
                    <Badge variant="outline">{org.plan}</Badge>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Compliance</span>
                    <span className="text-xs font-medium text-gray-300">{org.compliance}%</span>
                  </div>
                  <ProgressBar
                    value={org.compliance}
                    showLabel={false}
                    variant={org.compliance > 60 ? "accent" : org.compliance > 30 ? "warning" : "destructive"}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
