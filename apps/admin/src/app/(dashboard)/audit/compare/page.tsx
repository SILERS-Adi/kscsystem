import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@kscsystem/ui";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Circle, Sparkles } from "lucide-react";
import {
  AUDIT_ANSWER_LABELS,
  MATURITY_LABELS,
  type AuditAnswerStatus,
  type MaturityLevel,
} from "@kscsystem/types";
import {
  getOrganizationsForCompare,
  compareOrganizationAudits,
  type CompareTrend,
  type CompareStatus,
} from "../_actions/audit-actions";

export const dynamic = "force-dynamic";

const trendMeta: Record<CompareTrend, { label: string; cls: string; icon: typeof TrendingUp }> = {
  improved: { label: "Poprawione", cls: "text-emerald-400", icon: TrendingUp },
  regressed: { label: "Regresja", cls: "text-red-400", icon: TrendingDown },
  still_open: { label: "Nadal otwarte", cls: "text-amber-400", icon: Circle },
  unchanged: { label: "Utrzymane", cls: "text-gray-400", icon: Minus },
  new: { label: "Nowe pytanie", cls: "text-indigo-400", icon: Sparkles },
};

function ansLabel(s: CompareStatus): string {
  return s ? AUDIT_ANSWER_LABELS[s as AuditAnswerStatus] : "—";
}

export default async function AuditComparePage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string }>;
}) {
  const { org = "" } = await searchParams;
  const organizations = await getOrganizationsForCompare();
  const data = org ? await compareOrganizationAudits(org) : null;

  const scoreDelta =
    data?.hasPair && data.current?.score != null && data.previous?.score != null
      ? Math.round(data.current.score) - Math.round(data.previous.score)
      : null;

  const summary = data?.rows.reduce(
    (acc, r) => {
      acc[r.trend]++;
      return acc;
    },
    { improved: 0, regressed: 0, still_open: 0, unchanged: 0, new: 0 } as Record<CompareTrend, number>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/audit" className="text-gray-400 hover:text-white"><ArrowLeft size={18} /></Link>
        <PageHeader title="Porównanie audytów" description="Postęp punkt po punkcie między kolejnymi audytami tej samej organizacji" />
      </div>

      {/* Wybór organizacji */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs text-gray-500 mr-1">Organizacja:</span>
        {organizations.length === 0 ? (
          <span className="text-sm text-gray-500">Brak organizacji z co najmniej dwoma zakończonymi audytami.</span>
        ) : (
          organizations.map((o) => (
            <Link
              key={o.id}
              href={`/audit/compare?org=${o.id}`}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                org === o.id ? "bg-brand-500/10 text-brand-400 border-brand-500/30" : "bg-surface-200 text-gray-400 border-border hover:text-white"
              }`}
            >
              {o.name}
            </Link>
          ))
        )}
      </div>

      {data && !data.hasPair && (
        <Card><CardContent><p className="text-sm text-gray-500 py-6 text-center">Ta organizacja ma mniej niż dwa zakończone audyty — brak czego porównywać.</p></CardContent></Card>
      )}

      {data && data.hasPair && summary && (
        <>
          {/* Nagłówek porównania */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent>
                <div className="text-xs text-gray-500 pt-4">Poprzedni audyt</div>
                <div className="text-2xl font-bold text-white">{data.previous?.score != null ? `${Math.round(data.previous.score)}%` : "—"}</div>
                <div className="text-xs text-gray-500">{data.previous?.level ? MATURITY_LABELS[data.previous.level as MaturityLevel] : ""} · {data.previous?.date ? new Date(data.previous.date).toLocaleDateString("pl-PL") : ""}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-xs text-gray-500 pt-4">Ostatni audyt</div>
                <div className="text-2xl font-bold text-brand-400">{data.current?.score != null ? `${Math.round(data.current.score)}%` : "—"}</div>
                <div className="text-xs text-gray-500">{data.current?.level ? MATURITY_LABELS[data.current.level as MaturityLevel] : ""} · {data.current?.date ? new Date(data.current.date).toLocaleDateString("pl-PL") : ""}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-xs text-gray-500 pt-4">Zmiana dojrzałości</div>
                <div className={`text-2xl font-bold ${scoreDelta != null && scoreDelta > 0 ? "text-emerald-400" : scoreDelta != null && scoreDelta < 0 ? "text-red-400" : "text-gray-300"}`}>
                  {scoreDelta != null ? `${scoreDelta > 0 ? "+" : ""}${scoreDelta} pkt` : "—"}
                </div>
                <div className="text-xs text-gray-500">
                  {summary.improved} poprawione · {summary.regressed} regresji · {summary.still_open} otwarte
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela różnic */}
          <Card>
            <CardHeader>
              <CardTitle>Postęp punkt po punkcie ({data.rows.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {data.rows.map((r) => {
                  const m = trendMeta[r.trend];
                  const Icon = m.icon;
                  return (
                    <div key={r.code} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                      <Icon size={16} className={`${m.cls} shrink-0`} />
                      <span className="text-sm text-gray-200 flex-1 min-w-0 truncate">{r.text}</span>
                      <span className="text-xs text-gray-500 tabular-nums w-44 text-right shrink-0">
                        {ansLabel(r.prev)} <span className="text-gray-600">→</span> {ansLabel(r.curr)}
                      </span>
                      <Badge variant={r.trend === "regressed" ? "destructive" : r.trend === "improved" ? "default" : "muted"}>
                        {m.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Historia dojrzałości */}
          {data.history.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Historia dojrzałości ({data.history.length} audytów)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.history.map((h, i) => (
                    <div key={h.id} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-24 shrink-0">{new Date(h.date).toLocaleDateString("pl-PL")}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-surface-200 overflow-hidden">
                        <div className="h-full bg-brand-500" style={{ width: `${h.score ?? 0}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-white tabular-nums w-12 text-right">{h.score != null ? `${h.score}%` : "—"}</span>
                      <span className="text-xs text-gray-500 w-28 shrink-0">{h.level ? MATURITY_LABELS[h.level as MaturityLevel] : ""}{i === data.history.length - 1 ? " (ost.)" : ""}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
