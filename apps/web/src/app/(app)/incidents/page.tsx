import { Card, CardHeader, CardTitle, CardContent } from "@kscsystem/ui";
import { ShieldAlert, Info } from "lucide-react";
import { getIncidents, getIncidentStats } from "./_actions/incident-actions";
import { ReportForm } from "./_components/report-form";
import { IncidentRow, type IncidentView } from "./_components/incident-row";

export const dynamic = "force-dynamic";

function iso(d: Date | null): string | null {
  return d ? d.toISOString() : null;
}

export default async function IncidentsPage() {
  const [incidents, stats] = await Promise.all([getIncidents(), getIncidentStats()]);

  const items: IncidentView[] = incidents.map((i) => ({
    id: i.id,
    title: i.title,
    description: i.description,
    severity: i.severity,
    status: i.status,
    detectedAt: iso(i.detectedAt),
    createdAt: i.createdAt.toISOString(),
    csirtReportedAt: iso(i.csirtReportedAt),
    reportedByName: i.reportedBy?.name ?? null,
    reportedByEmail: i.reportedBy?.email ?? null,
  }));

  const tiles = [
    { label: "Otwarte", value: stats.open, cls: "text-red-400" },
    { label: "Badane", value: stats.investigating, cls: "text-amber-400" },
    { label: "Do zgłoszenia do CSIRT", value: stats.unreported, cls: "text-brand-400" },
    { label: "Po terminie 24h", value: stats.overdue, cls: "text-red-400" },
  ];

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Incydenty</h1>
          <p className="mt-1 text-sm text-gray-400">Rejestr incydentów bezpieczeństwa i terminy zgłoszeń do CSIRT</p>
        </div>
        <ReportForm />
      </div>

      {/* Baner KSC */}
      <div className="mb-6 flex items-start gap-2 rounded-lg border border-brand-500/20 bg-brand-500/5 px-3 py-2.5 text-sm text-brand-200">
        <Info size={16} className="mt-0.5 shrink-0" />
        <span>
          KSC/NIS2: poważny incydent zgłoś do właściwego <strong>CSIRT</strong> — <strong>wczesne ostrzeżenie w 24h</strong>,
          pełne zgłoszenie w <strong>72h</strong> od wykrycia. Zegar liczy się od momentu „Wykryto".
        </span>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tiles.map((t) => (
          <Card key={t.label}>
            <CardContent>
              <div className="pt-4 text-xs text-gray-500">{t.label}</div>
              <div className={`text-2xl font-bold ${t.cls}`}>{t.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incydenty ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="py-10 text-center">
              <ShieldAlert size={28} className="mx-auto text-gray-600 mb-2" />
              <p className="text-sm text-gray-500">Brak zgłoszonych incydentów. Użyj „Zgłoś incydent", aby dodać pierwszy.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((inc) => (
                <IncidentRow key={inc.id} inc={inc} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
