import { PageHeader } from "@/components/page-header";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@kscsystem/ui";
import { Plus, GripVertical } from "lucide-react";

const mockQuestions = [
  { id: "1", code: "Q001", text: "Czy Twoja firma zatrudnia powyżej 50 pracowników?", type: "single", category: "Klasyfikacja", isActive: true },
  { id: "2", code: "Q002", text: "W jakim sektorze działa Twoja organizacja?", type: "single", category: "Sektor", isActive: true },
  { id: "3", code: "Q003", text: "Czy świadczysz usługi kluczowe wg załącznika nr 1 ustawy?", type: "single", category: "Klasyfikacja", isActive: true },
  { id: "4", code: "Q004", text: "Czy posiadasz system zarządzania bezpieczeństwem informacji?", type: "single", category: "Gotowość", isActive: false },
];

export default function QuizPage() {
  return (
    <div>
      <PageHeader title="Quiz Manager" description="Zarządzaj pytaniami quizu klasyfikacyjnego">
        <Button size="sm">
          <Plus size={16} />
          Dodaj pytanie
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Pytania ({mockQuestions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockQuestions.map((q) => (
              <div
                key={q.id}
                className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4 hover:bg-surface-200 transition-colors"
              >
                <GripVertical size={16} className="text-gray-600 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">{q.code}</span>
                    <Badge variant={q.isActive ? "default" : "muted"}>
                      {q.isActive ? "Aktywne" : "Nieaktywne"}
                    </Badge>
                    <Badge variant="outline">{q.category}</Badge>
                  </div>
                  <p className="text-sm text-white truncate">{q.text}</p>
                </div>
                <Button variant="ghost" size="sm">Edytuj</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
