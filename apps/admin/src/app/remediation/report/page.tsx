import {
  SEVERITY_LABELS,
  REMEDIATION_STATUS_LABELS,
  REMEDIATION_STATUS_ORDER,
  type FindingSeverity,
  type RemediationStatus,
} from "@kscsystem/types";
import {
  getRemediationRegister,
  getRemediationOrganizations,
} from "../../(dashboard)/audit/_actions/audit-actions";
import { PrintButton } from "../../audit/[id]/report/print-button";
import { ReportLogo } from "@/components/report-logo";

export const dynamic = "force-dynamic";

const sevColor: Record<FindingSeverity, string> = {
  critical: "#b91c1c",
  high: "#b45309",
  medium: "#4f46e5",
  low: "#6b7280",
};
const statusColor: Record<RemediationStatus, string> = {
  open: "#b91c1c",
  in_progress: "#b45309",
  done: "#15803d",
  deferred: "#6b7280",
  accepted_risk: "#4f46e5",
};

function fmtDate(d: Date | null): string {
  return d ? new Date(d).toLocaleDateString("pl-PL") : "—";
}

export default async function RemediationReportPage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string; status?: string }>;
}) {
  const { org = "", status = "" } = await searchParams;

  const [actions, organizations] = await Promise.all([
    getRemediationRegister({ organizationId: org || undefined, status: status || undefined }),
    getRemediationOrganizations(),
  ]);

  const orgName = org ? organizations.find((o) => o.id === org)?.name ?? "—" : null;
  const now = new Date(new Date().toDateString());

  const counts = {
    open: actions.filter((a) => a.status === "open").length,
    in_progress: actions.filter((a) => a.status === "in_progress").length,
    done: actions.filter((a) => a.status === "done").length,
    overdue: actions.filter(
      (a) => (a.status === "open" || a.status === "in_progress") && a.dueDate && new Date(a.dueDate) < now
    ).length,
  };

  // Grupowanie wg statusu (kolejność robocza), w grupie wg priorytetu
  const grouped = REMEDIATION_STATUS_ORDER.map((st) => ({
    status: st,
    items: actions
      .filter((a) => a.status === st)
      .sort((a, b) => a.priority - b.priority),
  })).filter((g) => g.items.length > 0);

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "auto", zIndex: 50, background: "#fff", color: "#111", fontFamily: "Arial, sans-serif" }}>
      <style>{`
        @media print { .no-print { display:none !important; } html,body{ background:#fff !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
        @page { margin: 16mm 14mm; }
        .r table { border-collapse: collapse; width: 100%; }
        .r th,.r td { text-align:left; padding:5px 7px; font-size:11px; border-bottom:1px solid #e5e7eb; vertical-align:top; }
        .r th { background:#f3f4f6; font-size:9.5px; text-transform:uppercase; letter-spacing:.03em; color:#374151; }
      `}</style>

      <div className="r" style={{ maxWidth: 860, margin: "0 auto", padding: "24px 20px" }}>
        <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <PrintButton />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, borderBottom: "3px solid #4f46e5", paddingBottom: 12, marginBottom: 18 }}>
          <div>
            <h1 style={{ fontSize: 22, margin: 0, color: "#4f46e5" }}>Rejestr działań naprawczych</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
              Plan remediacji{orgName ? ` · ${orgName}` : " · wszystkie organizacje"} · wygenerowano {fmtDate(new Date())}
            </p>
          </div>
          <ReportLogo />
        </div>

        {/* Podsumowanie */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 22 }}>
          {([
            ["Otwarte", counts.open, "#b91c1c"],
            ["W trakcie", counts.in_progress, "#b45309"],
            ["Wykonane", counts.done, "#15803d"],
            ["Po terminie", counts.overdue, "#b91c1c"],
          ] as const).map(([label, n, c]) => (
            <div key={label} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{n}</div>
            </div>
          ))}
        </div>

        {actions.length === 0 ? (
          <p style={{ fontSize: 12, color: "#6b7280" }}>Brak działań dla wybranych filtrów.</p>
        ) : (
          grouped.map((g) => (
            <div key={g.status} style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 14, margin: "10px 0 6px", color: statusColor[g.status] }}>
                {REMEDIATION_STATUS_LABELS[g.status]} ({g.items.length})
              </h2>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 58 }}>Istotność</th>
                    <th>Działanie</th>
                    {!org && <th style={{ width: 110 }}>Organizacja</th>}
                    <th style={{ width: 96 }}>Odpowiedzialny</th>
                    <th style={{ width: 70 }}>Termin</th>
                    <th style={{ width: 120 }}>Dowód</th>
                  </tr>
                </thead>
                <tbody>
                  {g.items.map((a) => {
                    const sev = (a.severity ?? "medium") as FindingSeverity;
                    const overdue = (a.status === "open" || a.status === "in_progress") && a.dueDate && new Date(a.dueDate) < now;
                    return (
                      <tr key={a.id}>
                        <td style={{ color: sevColor[sev], fontWeight: 700 }}>{SEVERITY_LABELS[sev]}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{a.title}</div>
                          {a.description && <div style={{ color: "#6b7280", fontSize: 10, marginTop: 2 }}>{a.description}</div>}
                          {a.note && <div style={{ color: "#9ca3af", fontSize: 10, marginTop: 2 }}>Notatka: {a.note}</div>}
                        </td>
                        {!org && <td>{a.organization?.name ?? "—"}</td>}
                        <td>{a.responsiblePerson ?? "—"}</td>
                        <td style={{ color: overdue ? "#b91c1c" : "#111", fontWeight: overdue ? 700 : 400 }}>
                          {fmtDate(a.dueDate)}{overdue ? " ⚠" : ""}
                        </td>
                        <td style={{ fontSize: 10, color: "#6b7280", wordBreak: "break-word" }}>{a.evidenceUrl ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))
        )}

        <p style={{ marginTop: 26, fontSize: 10, color: "#9ca3af", borderTop: "1px solid #e5e7eb", paddingTop: 8 }}>
          Raport wygenerowany w systemie KSCSYSTEM. Rejestr działań naprawczych wynika z audytów cyberbezpieczeństwa
          i podlega cyklicznej weryfikacji w kolejnych audytach.
        </p>
      </div>
    </div>
  );
}
