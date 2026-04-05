import { Card, CardHeader, CardTitle, CardContent, ProgressBar } from "@kscsystem/ui";
import { getChecklistWithProgress, getComplianceStats } from "./_actions/checklist-actions";
import { ChecklistItemRow } from "./_components/checklist-item-row";

export const dynamic = 'force-dynamic';

export default async function ChecklistPage() {
  const [{ items }, stats] = await Promise.all([
    getChecklistWithProgress(),
    (await import("./_actions/checklist-actions")).getComplianceStats(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Checklista compliance</h1>
        <p className="mt-1 text-sm text-gray-400">
          Obowiązki wynikające z ustawy o KSC. Kliknij ikonę statusu aby zmienić stan.
        </p>
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">Ukończone</p>
          <p className="text-2xl font-bold text-accent-400">{stats.done}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">W toku</p>
          <p className="text-2xl font-bold text-amber-400">{stats.inProgress}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">Do zrobienia</p>
          <p className="text-2xl font-bold text-white">{stats.todo}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">Gotowość</p>
          <div className="mt-1">
            <ProgressBar
              value={stats.percentage}
              variant={stats.percentage > 60 ? "accent" : stats.percentage > 30 ? "warning" : "destructive"}
            />
          </div>
        </Card>
      </div>

      {/* Checklist items */}
      <Card>
        <CardHeader>
          <CardTitle>Obowiązki ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item) => (
              <ChecklistItemRow
                key={item.id}
                itemId={item.id}
                code={item.code}
                category={item.category}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                note={item.note}
              />
            ))}
            {items.length === 0 && (
              <p className="text-sm text-gray-500 py-8 text-center">
                Brak obowiązków do wyświetlenia. Upewnij się, że administrator dodał pozycje checklisty.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
