import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge, StatCard } from "@kscsystem/ui";
import { ClipboardList, CheckCircle2, Clock, Gauge } from "lucide-react";
import { MATURITY_LABELS, maturityLevelFromScore } from "@kscsystem/types";
import { getAuditDashboard, getOrganizationsForAudit, getAuditTemplates } from "./_actions/audit-actions";
import { NewSessionForm } from "./_components/new-session-form";

export const dynamic = "force-dynamic";

function scoreColor(s: number | null): string {
  if (s == null) return "text-gray-400";
  if (s >= 61) return "text-emerald-400";
  if (s >= 41) return "text-amber-400";
  return "text-red-400";
}

const statusLabel: Record<string, string> = { draft: "Szkic", in_progress: "W trakcie", completed: "Zakończony" };
const statusVariant: Record<string, "muted" | "warning" | "default"> = {
  draft: "muted",
  in_progress: "warning",
  completed: "default",
};

export default async function AuditDashboardPage() {
  const [dash, organizations, templates] = await Promise.all([
    getAuditDashboard(),
    getOrganizationsForAudit(),
    getAuditTemplates(),
  ]);

  return (
    <div>
      <PageHeader title="Audyt Startowy" description="Audyty cyberbezpieczeństwa organizacji — Gap Analysis i poziom dojrzałości" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Audyty (łącznie)" value={dash.total} icon={<ClipboardList size={20} />} />
        <StatCard label="Zakończone" value={dash.completed} icon={<CheckCircle2 size={20} />} />
        <StatCard label="W toku" value={dash.inProgress} icon={<Clock size={20} />} />
        <StatCard
          label="Śr. dojrzałość"
          value={dash.avgMaturity != null ? `${dash.avgMaturity}%` : "—"}
          changeLabel={dash.avgMaturity != null ? MATURITY_LABELS[maturityLevelFromScore(dash.avgMaturity)] : undefined}
          icon={<Gauge size={20} />}
        />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nowy audyt</CardTitle>
          </CardHeader>
          <CardContent>
            <NewSessionForm organizations={organizations} templates={templates} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audyty ({dash.recent.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {dash.recent.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">Brak audytów. Wybierz firmę powyżej i rozpocznij pierwszy.</p>
            ) : (
              <div className="space-y-2">
                {dash.recent.map((a) => (
                  <Link
                    key={a.id}
                    href={`/audit/${a.id}`}
                    className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4 hover:bg-surface-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{a.organization.name}</p>
                      <p className="text-xs text-gray-500">
                        {a.createdAt.toLocaleDateString("pl-PL")} · {a._count.findings} findings
                      </p>
                    </div>
                    <Badge variant={statusVariant[a.status]}>{statusLabel[a.status]}</Badge>
                    <span className={`text-lg font-bold tabular-nums ${scoreColor(a.maturityScore)}`}>
                      {a.maturityScore != null ? `${Math.round(a.maturityScore)}%` : "—"}
                    </span>
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
