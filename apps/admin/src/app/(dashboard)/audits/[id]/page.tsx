import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, StatCard } from "@kscsystem/ui";
import { ArrowLeft, FileDown, CheckCircle2, Trash2 } from "lucide-react";
import { computeReadiness, AUDIT_STATUS_LABELS, type ChecklistStatus } from "@kscsystem/types";
import { getAudit, completeAudit, deleteAudit } from "../_actions/audit-actions";
import { AuditAnswerRow } from "./_components/audit-answer-row";

export const dynamic = "force-dynamic";

function toDateInput(d: Date | null): string | null {
  if (!d) return null;
  return d.toISOString().slice(0, 10);
}

export default async function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) notFound();

  const readOnly = audit.status === "completed";

  // Podgląd gotowości na żywo (z bieżących odpowiedzi)
  const live = computeReadiness(
    audit.answers.map((a) => ({ priority: a.item.priority, status: a.status as ChecklistStatus }))
  );

  const gaps = audit.answers.filter((a) => a.status === "todo" || a.status === "in_progress");

  // Grupowanie po kategorii
  const byCategory = new Map<string, typeof audit.answers>();
  for (const a of audit.answers) {
    const list = byCategory.get(a.item.category) ?? [];
    list.push(a);
    byCategory.set(a.item.category, list);
  }

  const completeAuditBound = completeAudit.bind(null, audit.id);
  const deleteAuditBound = deleteAudit.bind(null, audit.id);

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/audits" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <PageHeader
          title={`Audyt — ${audit.organization.name}`}
          description={`${audit.createdAt.toLocaleDateString("pl-PL")} · ${
            audit.conductedByType === "self" ? "Samoocena klienta" : "Konsultant"
          }${audit.conductedBy?.name ? ` (${audit.conductedBy.name})` : ""}`}
        />
      </div>

      {/* Podsumowanie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Gotowość (ważona)" value={`${live.readiness}%`} />
        <StatCard label="Gotowość (surowa)" value={`${live.readinessRaw}%`} />
        <StatCard label="Spełnione" value={`${live.itemsDone} / ${live.itemsTotal}`} />
        <StatCard label="Luki do usunięcia" value={gaps.length} />
      </div>

      {/* Akcje */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Badge variant={readOnly ? "default" : "warning"}>
          {readOnly ? "Audyt zakończony" : "Szkic — w trakcie"}
        </Badge>

        <a href={`/admin/audits/${audit.id}/report`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <FileDown size={16} /> Raport PDF
          </Button>
        </a>

        {!readOnly && (
          <form action={completeAuditBound}>
            <Button type="submit" size="sm">
              <CheckCircle2 size={16} /> Zakończ audyt
            </Button>
          </form>
        )}

        <form action={deleteAuditBound} className="ml-auto">
          <Button type="submit" variant="ghost" size="sm" className="text-red-400">
            <Trash2 size={16} /> Usuń
          </Button>
        </form>
      </div>

      {/* Luki (skrót) */}
      {gaps.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Czego firma nie ma ({gaps.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {gaps.map((g) => (
                <div key={g.id} className="flex items-center gap-2 text-sm">
                  <span className="text-xs font-mono text-gray-500 w-16 shrink-0">{g.item.code}</span>
                  <span className="text-gray-300 flex-1 truncate">{g.item.title}</span>
                  <Badge variant={g.status === "in_progress" ? "warning" : "destructive"}>
                    {AUDIT_STATUS_LABELS[g.status as ChecklistStatus]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Odpowiedzi pogrupowane po kategorii */}
      <div className="space-y-6">
        {[...byCategory.entries()].map(([category, answers]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {answers.map((a) => (
                  <AuditAnswerRow
                    key={a.id}
                    readOnly={readOnly}
                    item={{
                      code: a.item.code,
                      title: a.item.title,
                      description: a.item.description,
                      category: a.item.category,
                      priority: a.item.priority,
                    }}
                    answer={{
                      id: a.id,
                      status: a.status as ChecklistStatus,
                      note: a.note,
                      evidenceUrl: a.evidenceUrl,
                      responsibleName: a.responsibleName,
                      dueDate: toDateInput(a.dueDate),
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
