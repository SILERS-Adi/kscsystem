import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@kscsystem/ui";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { getChecklistItems, deleteChecklistItem, toggleChecklistItem } from "./_actions/checklist-actions";
import { ChecklistForm } from "./_components/checklist-form";

export const dynamic = 'force-dynamic';

const priorityColors = { 1: "destructive", 2: "warning", 3: "outline" } as const;
const priorityLabels: Record<number, string> = { 1: "Krytyczny", 2: "Wysoki", 3: "Średni" };

export default async function ChecklistPage() {
  const items = await getChecklistItems();

  return (
    <div>
      <PageHeader title="Checklista compliance" description="Obowiązki wynikające z ustawy o KSC" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dodaj obowiązek</CardTitle>
          </CardHeader>
          <CardContent>
            <ChecklistForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Obowiązki ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">{item.code}</span>
                      <Badge variant={priorityColors[item.priority as keyof typeof priorityColors] ?? "outline"}>
                        {priorityLabels[item.priority] ?? `P${item.priority}`}
                      </Badge>
                      <Badge variant="outline">{item.category}</Badge>
                      {item.appliesToType !== "all" && (
                        <Badge variant="default">{item.appliesToType}</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                  <Badge variant={item.isActive ? "accent" : "muted"}>
                    {item.isActive ? "Aktywny" : "Nieaktywny"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <form action={async () => { "use server"; await toggleChecklistItem(item.id, !item.isActive); }}>
                      <Button variant="ghost" size="icon" type="submit">
                        {item.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </form>
                    <form action={async () => { "use server"; await deleteChecklistItem(item.id); }}>
                      <Button variant="ghost" size="icon" type="submit" className="text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-gray-500 py-8 text-center">Brak obowiązków. Dodaj pierwszy obowiązek.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
