import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, StatCard } from "@kscsystem/ui";
import { ListChecks, CircleDot, Loader, CheckCircle2, AlertTriangle, FileDown } from "lucide-react";
import { REMEDIATION_STATUS_LABELS, type RemediationStatus } from "@kscsystem/types";
import {
  getRemediationRegister,
  getRemediationStats,
  getRemediationOrganizations,
} from "../audit/_actions/audit-actions";
import { RemediationRow, type RemediationItem } from "./_components/remediation-row";

export const dynamic = "force-dynamic";

function toDateInput(d: Date | null): string | null {
  return d ? d.toISOString().slice(0, 10) : null;
}

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Wszystkie" },
  ...(Object.keys(REMEDIATION_STATUS_LABELS) as RemediationStatus[]).map((s) => ({
    value: s,
    label: REMEDIATION_STATUS_LABELS[s],
  })),
];

export default async function RemediationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; org?: string }>;
}) {
  const { status = "", org = "" } = await searchParams;

  const [stats, organizations, actions] = await Promise.all([
    getRemediationStats(),
    getRemediationOrganizations(),
    getRemediationRegister({ status: status || undefined, organizationId: org || undefined }),
  ]);

  const items: RemediationItem[] = actions.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    severity: a.severity,
    status: a.status,
    sectionCode: a.sectionCode,
    responsiblePerson: a.responsiblePerson,
    dueDate: toDateInput(a.dueDate),
    evidenceUrl: a.evidenceUrl,
    note: a.note,
    organizationName: a.organization?.name,
  }));

  const mkHref = (patch: { status?: string; org?: string }) => {
    const sp = new URLSearchParams();
    const s = patch.status ?? status;
    const o = patch.org ?? org;
    if (s) sp.set("status", s);
    if (o) sp.set("org", o);
    const qs = sp.toString();
    return `/remediation${qs ? `?${qs}` : ""}`;
  };

  const reportQs = (() => {
    const sp = new URLSearchParams();
    if (status) sp.set("status", status);
    if (org) sp.set("org", org);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  })();

  return (
    <div>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <PageHeader
          title="Remediacja"
          description="Trwały rejestr działań naprawczych z audytów — realizacja punkt po punkcie, ponad pojedynczą sesją"
        />
        <a
          href={`/admin/remediation/report${reportQs}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-2 rounded-lg border border-border bg-surface-100 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-surface-200 transition-colors"
        >
          <FileDown size={16} /> Eksport PDF
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Otwarte" value={stats.open} icon={<CircleDot size={20} />} />
        <StatCard label="W trakcie" value={stats.inProgress} icon={<Loader size={20} />} />
        <StatCard label="Wykonane" value={stats.done} icon={<CheckCircle2 size={20} />} />
        <StatCard label="Po terminie" value={stats.overdue} icon={<AlertTriangle size={20} />} />
        <StatCard label="Organizacje" value={stats.organizations} icon={<ListChecks size={20} />} />
      </div>

      {/* Filtry */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-gray-500 mr-1">Status:</span>
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value || "all"}
            href={mkHref({ status: f.value })}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              status === f.value
                ? "bg-brand-500/10 text-brand-400 border-brand-500/30"
                : "bg-surface-200 text-gray-400 border-border hover:text-white"
            }`}
          >
            {f.label}
          </Link>
        ))}
        {organizations.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 ml-2">
            <span className="text-xs text-gray-500 mr-1">Organizacja:</span>
            <Link
              href={mkHref({ org: "" })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                !org ? "bg-brand-500/10 text-brand-400 border-brand-500/30" : "bg-surface-200 text-gray-400 border-border hover:text-white"
              }`}
            >
              Wszystkie
            </Link>
            {organizations.map((o) => (
              <Link
                key={o.id}
                href={mkHref({ org: o.id })}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  org === o.id ? "bg-brand-500/10 text-brand-400 border-brand-500/30" : "bg-surface-200 text-gray-400 border-border hover:text-white"
                }`}
              >
                {o.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Działania ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">
              Brak działań dla wybranych filtrów. Działania pojawiają się automatycznie po zakończeniu audytu
              (każda luka → wpis w rejestrze).
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((it) => (
                <RemediationRow key={it.id} item={it} showOrg={!org} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
