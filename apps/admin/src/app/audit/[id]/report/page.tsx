import { notFound } from "next/navigation";
import {
  computeMaturity,
  MATURITY_LABELS,
  SEVERITY_LABELS,
  AUDIT_ANSWER_LABELS,
  maturityLevelFromScore,
  type AuditAnswerStatus,
  type FindingSeverity,
} from "@kscsystem/types";
import { getAuditSession } from "../../../(dashboard)/audit/_actions/audit-actions";
import { PrintButton } from "./print-button";

export const dynamic = "force-dynamic";

const sevColor: Record<FindingSeverity, string> = {
  critical: "#b91c1c",
  high: "#b45309",
  medium: "#4f46e5",
  low: "#6b7280",
};
const ansColor: Record<AuditAnswerStatus, string> = {
  yes: "#15803d",
  partial: "#b45309",
  no: "#b91c1c",
  not_applicable: "#6b7280",
};
const classLabels: Record<string, string> = {
  essential: "Podmiot kluczowy",
  important: "Podmiot ważny",
  unknown: "Nieokreślona",
};

export default async function AuditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAuditSession(id);
  if (!audit) notFound();

  const answerByQ = new Map(audit.answers.map((a) => [a.questionId, a]));
  const statusQuestions = audit.template.sections.flatMap((s) => s.questions.filter((q) => q.inputType === "status"));
  const maturity = computeMaturity(
    statusQuestions.map((q) => ({ weight: q.weight, status: (answerByQ.get(q.id)?.status ?? null) as AuditAnswerStatus | null }))
  );
  const level = audit.maturityLevel ?? maturityLevelFromScore(maturity.score);
  const score = audit.maturityScore != null ? Math.round(audit.maturityScore) : maturity.score;

  const recsByFinding = new Map(audit.recommendations.map((r) => [r.findingId, r]));
  const severities: FindingSeverity[] = ["critical", "high", "medium", "low"];

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "auto", zIndex: 50, background: "#fff", color: "#111", fontFamily: "Arial, sans-serif" }}>
      <style>{`
        @media print { .no-print { display:none !important; } html,body{ background:#fff !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
        @page { margin: 16mm 14mm; }
        .r table { border-collapse: collapse; width: 100%; }
        .r th,.r td { text-align:left; padding:5px 7px; font-size:11.5px; border-bottom:1px solid #e5e7eb; vertical-align:top; }
        .r th { background:#f3f4f6; font-size:10px; text-transform:uppercase; letter-spacing:.03em; color:#374151; }
      `}</style>

      <div className="r" style={{ maxWidth: 820, margin: "0 auto", padding: "24px 20px" }}>
        <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <PrintButton />
        </div>

        <div style={{ borderBottom: "3px solid #4f46e5", paddingBottom: 12, marginBottom: 18 }}>
          <h1 style={{ fontSize: 22, margin: 0, color: "#4f46e5" }}>Raport Audytu Cyberbezpieczeństwa</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Gap Analysis · {audit.template.name} v{audit.templateVersion}</p>
        </div>

        {/* Dane firmy */}
        <table style={{ marginBottom: 18 }}>
          <tbody>
            <tr><td style={{ width: "28%", color: "#6b7280", borderBottom: "none" }}>Organizacja</td><td style={{ fontWeight: 700, borderBottom: "none" }}>{audit.organization.name}</td></tr>
            <tr><td style={{ color: "#6b7280", borderBottom: "none" }}>NIP</td><td style={{ borderBottom: "none" }}>{audit.organization.nip ?? "—"}</td></tr>
            <tr><td style={{ color: "#6b7280", borderBottom: "none" }}>Klasyfikacja</td><td style={{ borderBottom: "none" }}>{classLabels[audit.organization.type] ?? audit.organization.type}</td></tr>
            <tr><td style={{ color: "#6b7280", borderBottom: "none" }}>Data audytu</td><td style={{ borderBottom: "none" }}>{audit.createdAt.toLocaleDateString("pl-PL")}</td></tr>
            <tr><td style={{ color: "#6b7280", borderBottom: "none" }}>Audytor</td><td style={{ borderBottom: "none" }}>{audit.conductedBy?.name ?? audit.conductedBy?.email ?? "—"}</td></tr>
          </tbody>
        </table>

        {/* Maturity */}
        <div style={{ display: "flex", gap: 14, marginBottom: 22, alignItems: "stretch" }}>
          <div style={{ flex: "0 0 200px", border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px 18px", background: "#eef2ff" }}>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Cyber Maturity Score</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#4f46e5", lineHeight: 1.1 }}>{score}%</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#4f46e5" }}>Poziom: {MATURITY_LABELS[level]}</div>
          </div>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {severities.map((s) => {
              const n = audit.findings.filter((f) => f.severity === s).length;
              return (
                <div key={s} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>{SEVERITY_LABELS[s]}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: sevColor[s] }}>{n}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gap Analysis: findings + rekomendacje */}
        <h2 style={{ fontSize: 15, marginBottom: 8 }}>Gap Analysis — luki i rekomendacje</h2>
        {audit.findings.length === 0 ? (
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 18 }}>
            Brak zidentyfikowanych luk{audit.status !== "completed" ? " (audyt niezakończony — zakończ go, aby wygenerować findings)." : "."}
          </p>
        ) : (
          <table style={{ marginBottom: 22 }}>
            <thead><tr><th style={{ width: 64 }}>Istotność</th><th>Luka</th><th>Rekomendacja</th><th style={{ width: 110 }}>Odpowiedzialny</th><th style={{ width: 78 }}>Termin</th></tr></thead>
            <tbody>
              {severities.flatMap((s) =>
                audit.findings.filter((f) => f.severity === s).map((f) => {
                  const rec = recsByFinding.get(f.id);
                  return (
                    <tr key={f.id}>
                      <td style={{ color: sevColor[s], fontWeight: 700 }}>{SEVERITY_LABELS[s]}</td>
                      <td>{f.title}</td>
                      <td>{rec?.title ?? "—"}</td>
                      <td>{rec?.responsiblePerson ?? "—"}</td>
                      <td>{rec?.dueDate ? new Date(rec.dueDate).toLocaleDateString("pl-PL") : "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {/* Pełna ocena */}
        <h2 style={{ fontSize: 15, marginBottom: 8 }}>Szczegółowa ocena</h2>
        {audit.template.sections.map((section, i) => (
          <div key={section.id} style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, color: "#4f46e5", margin: "10px 0 4px" }}>{i + 1}. {section.title}</h3>
            <table>
              <tbody>
                {section.questions.map((q) => {
                  const a = answerByQ.get(q.id);
                  const isStatus = q.inputType === "status";
                  const st = a?.status as AuditAnswerStatus | undefined;
                  return (
                    <tr key={q.id}>
                      <td style={{ width: "62%" }}>{q.text}{a?.note ? <div style={{ color: "#6b7280", fontSize: 10 }}>{a.note}</div> : null}</td>
                      <td style={{ fontWeight: 700, color: isStatus && st ? ansColor[st] : "#111" }}>
                        {isStatus ? (st ? AUDIT_ANSWER_LABELS[st] : "—") : (a?.valueText || "—")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        <p style={{ marginTop: 26, fontSize: 10, color: "#9ca3af", borderTop: "1px solid #e5e7eb", paddingTop: 8 }}>
          Raport wygenerowany w systemie KSCSYSTEM. Ocena ma charakter pomocniczy i nie zastępuje formalnego audytu bezpieczeństwa wymaganego przepisami.
        </p>
      </div>
    </div>
  );
}
