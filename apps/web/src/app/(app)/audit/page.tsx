import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, ProgressBar, Badge } from "@kscsystem/ui";
import { AUDIT_STATUS_LABELS, type ChecklistStatus } from "@kscsystem/types";
import { getCurrentReadiness, getOrgAudits } from "./_actions/audit-actions";
import { RunAuditButton } from "./_components/run-audit-button";

export const dynamic = "force-dynamic";

function readinessColor(r: number): string {
  if (r >= 75) return "text-accent-400";
  if (r >= 40) return "text-amber-400";
  return "text-red-400";
}

export default async function AuditPage() {
  const [readiness, audits] = await Promise.all([getCurrentReadiness(), getOrgAudits()]);

  if (!readiness) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white">Audyt KSC</h1>
        <p className="mt-2 text-sm text-gray-400">Najpierw uzupełnij profil firmy.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Audyt KSC</h1>
        <p className="mt-1 text-sm text-gray-400">
          Twój aktualny poziom zgodności i czego jeszcze brakuje. Stan zmieniasz w{" "}
          <Link href="/checklist" className="text-brand-400 hover:underline">
            Checkliście
          </Link>
          .
        </p>
      </div>

      {/* Podsumowanie gotowości */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 md:col-span-2">
          <p className="text-xs text-gray-400 mb-1">Gotowość zgodności (ważona)</p>
          <p className={`text-4xl font-bold tabular-nums ${readinessColor(readiness.readiness)}`}>
            {readiness.readiness}%
          </p>
          <div className="mt-3">
            <ProgressBar value={readiness.readiness} showLabel={false} variant="brand" />
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-gray-400 mb-1">Spełnione</p>
          <p className="text-2xl font-bold text-white">
            {readiness.itemsDone} / {readiness.itemsTotal}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-gray-400 mb-1">Luki do usunięcia</p>
          <p className="text-2xl font-bold text-amber-400">{readiness.gaps.length}</p>
        </Card>
      </div>

      {/* Akcja: samoocena */}
      <Card className="mb-8">
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-5">
          <div>
            <p className="text-sm font-medium text-white">Zapisz migawkę stanu</p>
            <p className="text-xs text-gray-400">
              Tworzy datowany raport bieżącego stanu — do śledzenia postępu w czasie.
            </p>
          </div>
          <RunAuditButton />
        </CardContent>
      </Card>

      {/* Luki */}
      {readiness.gaps.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Czego firma jeszcze nie ma ({readiness.gaps.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {readiness.gaps.map((g) => (
                <div key={g.code} className="flex items-center gap-2 text-sm">
                  <span className="text-xs font-mono text-gray-500 w-16 shrink-0">{g.code}</span>
                  <span className="text-gray-300 flex-1 truncate">{g.title}</span>
                  {g.dueDate && <span className="text-xs text-gray-500">do {g.dueDate}</span>}
                  <Badge variant={g.status === "in_progress" ? "warning" : "destructive"}>
                    {AUDIT_STATUS_LABELS[g.status as ChecklistStatus]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historia migawek */}
      <Card>
        <CardHeader>
          <CardTitle>Historia audytów ({audits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {audits.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              Brak zapisanych migawek. Kliknij „Wykonaj samoocenę", aby zapisać pierwszą.
            </p>
          ) : (
            <div className="space-y-2">
              {audits.map((a) => (
                <a
                  key={a.id}
                  href={`/audit/${a.id}/report`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4 hover:bg-surface-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {a.createdAt.toLocaleDateString("pl-PL")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {a.conductedByType === "self" ? "Samoocena" : "Konsultant"} · {a.itemsDone}/
                      {a.itemsTotal} punktów · raport →
                    </p>
                  </div>
                  <div className={`text-lg font-bold tabular-nums ${readinessColor(a.readiness ?? 0)}`}>
                    {a.readiness != null ? `${a.readiness}%` : "—"}
                  </div>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
