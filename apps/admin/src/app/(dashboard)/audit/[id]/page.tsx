import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, StatCard } from "@kscsystem/ui";
import { ArrowLeft, FileDown, CheckCircle2, RotateCcw, Trash2 } from "lucide-react";
import {
  computeMaturity,
  MATURITY_LABELS,
  SEVERITY_LABELS,
  type AuditAnswerStatus,
  type FindingSeverity,
} from "@kscsystem/types";
import {
  getAuditSession,
  completeAuditSession,
  reopenAuditSession,
  deleteAuditSession,
} from "../_actions/audit-actions";
import { QuestionRow } from "./_components/question-row";

export const dynamic = "force-dynamic";

const sevColor: Record<FindingSeverity, "destructive" | "warning" | "default" | "muted"> = {
  critical: "destructive",
  high: "warning",
  medium: "default",
  low: "muted",
};

function toDateInput(d: Date | null): string | null {
  return d ? d.toISOString().slice(0, 10) : null;
}
function scoreColor(s: number): string {
  if (s >= 61) return "text-emerald-400";
  if (s >= 41) return "text-amber-400";
  return "text-red-400";
}

export default async function AuditSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAuditSession(id);
  if (!audit) notFound();

  const readOnly = audit.status === "completed";
  const answerByQ = new Map(audit.answers.map((a) => [a.questionId, a]));

  const statusQuestions = audit.template.sections.flatMap((s) =>
    s.questions.filter((q) => q.inputType === "status")
  );
  const live = computeMaturity(
    statusQuestions.map((q) => ({
      weight: q.weight,
      status: (answerByQ.get(q.id)?.status ?? null) as AuditAnswerStatus | null,
    }))
  );

  const completeBound = completeAuditSession.bind(null, audit.id);
  const reopenBound = reopenAuditSession.bind(null, audit.id);
  const deleteBound = deleteAuditSession.bind(null, audit.id);

  const findingsBySeverity = (["critical", "high", "medium", "low"] as FindingSeverity[]).map((sev) => ({
    sev,
    items: audit.findings.filter((f) => f.severity === sev),
  }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/audit" className="text-gray-400 hover:text-white"><ArrowLeft size={18} /></Link>
        <PageHeader
          title={`Audyt — ${audit.organization.name}`}
          description={`${audit.template.name} v${audit.templateVersion} · ${audit.createdAt.toLocaleDateString("pl-PL")}${audit.conductedBy?.name ? ` · ${audit.conductedBy.name}` : ""}`}
        />
      </div>

      {/* Podsumowanie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Cyber Maturity Score" value={`${live.score}%`} changeLabel={MATURITY_LABELS[live.level]} />
        <StatCard label="Odpowiedzi" value={`${live.answered} / ${statusQuestions.length}`} />
        <StatCard label="Findings" value={audit.findings.length} />
        <StatCard label="Rekomendacje" value={audit.recommendations.length} />
      </div>

      {/* Akcje */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Badge variant={readOnly ? "default" : "warning"}>
          {readOnly ? "Zakończony" : audit.status === "in_progress" ? "W trakcie" : "Szkic"}
        </Badge>
        <a href={`/admin/audit/${audit.id}/report`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm"><FileDown size={16} /> Raport PDF</Button>
        </a>
        {readOnly ? (
          <form action={reopenBound}>
            <Button type="submit" variant="secondary" size="sm"><RotateCcw size={16} /> Wznów edycję</Button>
          </form>
        ) : (
          <form action={completeBound}>
            <Button type="submit" size="sm"><CheckCircle2 size={16} /> Zakończ i wygeneruj raport</Button>
          </form>
        )}
        <form action={deleteBound} className="ml-auto">
          <Button type="submit" variant="ghost" size="sm" className="text-red-400"><Trash2 size={16} /> Usuń</Button>
        </form>
      </div>

      {/* Findings + rekomendacje (po finalizacji) */}
      {readOnly && audit.findings.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Findings — luki ({audit.findings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {findingsBySeverity.filter((g) => g.items.length > 0).map((g) => (
                <div key={g.sev}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    {SEVERITY_LABELS[g.sev]} ({g.items.length})
                  </p>
                  <div className="space-y-1">
                    {g.items.map((f) => (
                      <div key={f.id} className="flex items-center gap-2 text-sm">
                        <Badge variant={sevColor[g.sev]}>{SEVERITY_LABELS[g.sev]}</Badge>
                        <span className="text-gray-300 flex-1">{f.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sekcje audytu */}
      <div className="space-y-6">
        {audit.template.sections.map((section, i) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>
                <span className="text-gray-500 mr-2">{i + 1}.</span>{section.title}
              </CardTitle>
              {section.description && <p className="text-xs text-gray-500 mt-1">{section.description}</p>}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.questions.map((q) => {
                  const a = answerByQ.get(q.id);
                  return (
                    <QuestionRow
                      key={q.id}
                      sessionId={audit.id}
                      readOnly={readOnly}
                      question={{ id: q.id, text: q.text, helpText: q.helpText, inputType: q.inputType, severity: q.severity }}
                      answer={a ? {
                        status: a.status as AuditAnswerStatus | null,
                        valueText: a.valueText,
                        note: a.note,
                        responsiblePerson: a.responsiblePerson,
                        dueDate: toDateInput(a.dueDate),
                      } : undefined}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
