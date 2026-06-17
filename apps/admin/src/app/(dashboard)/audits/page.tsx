import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@kscsystem/ui";
import { getAudits, getOrganizationsForAudit } from "./_actions/audit-actions";
import { NewAuditForm } from "./_components/new-audit-form";

export const dynamic = "force-dynamic";

function readinessColor(r: number | null): string {
  if (r == null) return "text-gray-400";
  if (r >= 75) return "text-emerald-400";
  if (r >= 40) return "text-amber-400";
  return "text-red-400";
}

export default async function AuditsPage() {
  const [audits, organizations] = await Promise.all([getAudits(), getOrganizationsForAudit()]);

  return (
    <div>
      <PageHeader title="Audyty" description="Audyty zgodności z KSC — co firma ma, czego brakuje" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nowy audyt</CardTitle>
          </CardHeader>
          <CardContent>
            <NewAuditForm organizations={organizations} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historia audytów ({audits.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {audits.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">
                Brak audytów. Wybierz firmę powyżej i rozpocznij pierwszy audyt.
              </p>
            ) : (
              <div className="space-y-2">
                {audits.map((a) => (
                  <Link
                    key={a.id}
                    href={`/audits/${a.id}`}
                    className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4 hover:bg-surface-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{a.organization.name}</p>
                      <p className="text-xs text-gray-500">
                        {a.createdAt.toLocaleDateString("pl-PL")} ·{" "}
                        {a.conductedByType === "self" ? "Samoocena" : "Konsultant"} ·{" "}
                        {a.itemsDone}/{a.itemsTotal} punktów
                      </p>
                    </div>
                    <Badge variant={a.status === "completed" ? "default" : "warning"}>
                      {a.status === "completed" ? "Zakończony" : "Szkic"}
                    </Badge>
                    <div className={`text-lg font-bold tabular-nums ${readinessColor(a.readiness)}`}>
                      {a.readiness != null ? `${a.readiness}%` : "—"}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
