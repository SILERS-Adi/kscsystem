import { PageHeader } from "@/components/page-header";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@kscsystem/ui";
import { Plus } from "lucide-react";

const mockItems = [
  { code: "KSC-01", category: "Zarządzanie ryzykiem", title: "Wdrożenie systemu zarządzania ryzykiem", priority: 1, appliesToType: "all", isActive: true },
  { code: "KSC-02", category: "Zarządzanie ryzykiem", title: "Przeprowadzenie analizy ryzyka", priority: 1, appliesToType: "all", isActive: true },
  { code: "KSC-03", category: "Incydenty", title: "Procedura zgłaszania incydentów do CSIRT", priority: 2, appliesToType: "essential", isActive: true },
  { code: "KSC-04", category: "Bezpieczeństwo", title: "Polityka bezpieczeństwa informacji", priority: 1, appliesToType: "all", isActive: true },
  { code: "KSC-05", category: "Audyt", title: "Przeprowadzenie audytu bezpieczeństwa", priority: 3, appliesToType: "essential", isActive: false },
];

const priorityColors = { 1: "destructive", 2: "warning", 3: "outline" } as const;
const priorityLabels = { 1: "Krytyczny", 2: "Wysoki", 3: "Średni" };

export default function ChecklistPage() {
  return (
    <div>
      <PageHeader title="Checklista compliance" description="Obowiązki wynikające z ustawy o KSC">
        <Button size="sm">
          <Plus size={16} />
          Dodaj obowiązek
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Obowiązki ({mockItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockItems.map((item) => (
              <div key={item.code} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">{item.code}</span>
                    <Badge variant={priorityColors[item.priority as keyof typeof priorityColors]}>
                      {priorityLabels[item.priority as keyof typeof priorityLabels]}
                    </Badge>
                    <Badge variant="outline">{item.category}</Badge>
                    {item.appliesToType !== "all" && (
                      <Badge variant="default">{item.appliesToType}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-white">{item.title}</p>
                </div>
                <Badge variant={item.isActive ? "accent" : "muted"}>
                  {item.isActive ? "Aktywny" : "Nieaktywny"}
                </Badge>
                <Button variant="ghost" size="sm">Edytuj</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
