import { notFound } from "next/navigation";
import { computeReadiness, AUDIT_STATUS_LABELS, type ChecklistStatus } from "@kscsystem/types";
import { getAudit } from "../../../(dashboard)/audits/_actions/audit-actions";
import { PrintButton } from "./print-button";

export const dynamic = "force-dynamic";

const statusColor: Record<ChecklistStatus, string> = {
  done: "#15803d",
  in_progress: "#b45309",
  todo: "#b91c1c",
  not_applicable: "#6b7280",
};

const priorityLabels: Record<number, string> = { 1: "Krytyczny", 2: "Wysoki", 3: "Średni" };
const classLabels: Record<string, string> = {
  essential: "Podmiot kluczowy",
  important: "Podmiot ważny",
  unknown: "Nieokreślona",
};

export default async function AuditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) notFound();

  const live = computeReadiness(
    audit.answers.map((a) => ({ priority: a.item.priority, status: a.status as ChecklistStatus }))
  );
  const gaps = audit.answers.filter((a) => a.status === "todo" || a.status === "in_progress");

  const byCategory = new Map<string, typeof audit.answers>();
  for (const a of audit.answers) {
    const list = byCategory.get(a.item.category) ?? [];
    list.push(a);
    byCategory.set(a.item.category, list);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "auto",
        zIndex: 50,
        background: "#fff",
        color: "#111",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <style>{`
        @media print { .no-print { display: none !important; } html, body { background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        @page { margin: 18mm 16mm; }
        .ksc-report table { border-collapse: collapse; width: 100%; }
        .ksc-report th, .ksc-report td { text-align: left; padding: 6px 8px; font-size: 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
        .ksc-report th { background: #f3f4f6; font-size: 11px; text-transform: uppercase; letter-spacing: .03em; color: #374151; }
      `}</style>

      <div className="ksc-report" style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px" }}>
          {/* Pasek akcji (nie drukuje się) */}
          <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <PrintButton />
          </div>

          {/* Nagłówek */}
          <div style={{ borderBottom: "3px solid #4f46e5", paddingBottom: 12, marginBottom: 20 }}>
            <h1 style={{ fontSize: 22, margin: 0, color: "#4f46e5" }}>Raport audytu zgodności z KSC</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
              Krajowy System Cyberbezpieczeństwa — ocena obowiązków podmiotu
            </p>
          </div>

          {/* Dane firmy */}
          <table style={{ marginBottom: 20 }}>
            <tbody>
              <tr>
                <td style={{ width: "30%", color: "#6b7280", borderBottom: "none" }}>Firma</td>
                <td style={{ fontWeight: 700, borderBottom: "none" }}>{audit.organization.name}</td>
              </tr>
              <tr>
                <td style={{ color: "#6b7280", borderBottom: "none" }}>NIP</td>
                <td style={{ borderBottom: "none" }}>{audit.organization.nip ?? "—"}</td>
              </tr>
              <tr>
                <td style={{ color: "#6b7280", borderBottom: "none" }}>Klasyfikacja</td>
                <td style={{ borderBottom: "none" }}>{classLabels[audit.classification ?? "unknown"] ?? audit.classification}</td>
              </tr>
              <tr>
                <td style={{ color: "#6b7280", borderBottom: "none" }}>Data audytu</td>
                <td style={{ borderBottom: "none" }}>{audit.createdAt.toLocaleDateString("pl-PL")}</td>
              </tr>
              <tr>
                <td style={{ color: "#6b7280", borderBottom: "none" }}>Przeprowadził</td>
                <td style={{ borderBottom: "none" }}>
                  {audit.conductedByType === "self" ? "Samoocena klienta" : "Konsultant"}
                  {audit.conductedBy?.name ? ` — ${audit.conductedBy.name}` : ""}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Podsumowanie */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <SummaryBox label="Gotowość (ważona)" value={`${live.readiness}%`} big />
            <SummaryBox label="Gotowość (surowa)" value={`${live.readinessRaw}%`} />
            <SummaryBox label="Spełnione" value={`${live.itemsDone}/${live.itemsTotal}`} />
            <SummaryBox label="Luki" value={`${gaps.length}`} />
          </div>

          {/* Luki / plan naprawczy */}
          {gaps.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, color: "#111", marginBottom: 8 }}>Czego firma nie ma — plan naprawczy</h2>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 56 }}>Kod</th>
                    <th>Obowiązek</th>
                    <th style={{ width: 80 }}>Status</th>
                    <th style={{ width: 110 }}>Odpowiedzialny</th>
                    <th style={{ width: 80 }}>Termin</th>
                  </tr>
                </thead>
                <tbody>
                  {gaps.map((g) => (
                    <tr key={g.id}>
                      <td style={{ fontFamily: "monospace" }}>{g.item.code}</td>
                      <td>{g.item.title}</td>
                      <td style={{ color: statusColor[g.status as ChecklistStatus], fontWeight: 700 }}>
                        {AUDIT_STATUS_LABELS[g.status as ChecklistStatus]}
                      </td>
                      <td>{g.responsibleName ?? "—"}</td>
                      <td>{g.dueDate ? g.dueDate.toLocaleDateString("pl-PL") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pełna lista wg kategorii */}
          <h2 style={{ fontSize: 15, color: "#111", marginBottom: 8 }}>Pełna ocena obowiązków</h2>
          {[...byCategory.entries()].map(([category, answers]) => (
            <div key={category} style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, color: "#4f46e5", margin: "12px 0 4px" }}>{category}</h3>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 56 }}>Kod</th>
                    <th>Obowiązek</th>
                    <th style={{ width: 70 }}>Priorytet</th>
                    <th style={{ width: 80 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {answers.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontFamily: "monospace" }}>{a.item.code}</td>
                      <td>
                        {a.item.title}
                        {a.note ? <div style={{ color: "#6b7280", fontSize: 11 }}>{a.note}</div> : null}
                      </td>
                      <td>{priorityLabels[a.item.priority] ?? `P${a.item.priority}`}</td>
                      <td style={{ color: statusColor[a.status as ChecklistStatus], fontWeight: 700 }}>
                        {AUDIT_STATUS_LABELS[a.status as ChecklistStatus]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <p style={{ marginTop: 28, fontSize: 10, color: "#9ca3af", borderTop: "1px solid #e5e7eb", paddingTop: 8 }}>
            Raport wygenerowany w systemie KSCSYSTEM. Ocena ma charakter pomocniczy i nie zastępuje
            formalnego audytu bezpieczeństwa wymaganego ustawą.
          </p>
        </div>
    </div>
  );
}

function SummaryBox({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "12px 14px",
        background: big ? "#eef2ff" : "#fff",
      }}
    >
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: big ? 28 : 20, fontWeight: 700, color: big ? "#4f46e5" : "#111" }}>{value}</div>
    </div>
  );
}
