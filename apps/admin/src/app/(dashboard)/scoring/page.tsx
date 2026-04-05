import { PageHeader } from "@/components/page-header";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@kscsystem/ui";
import { Plus } from "lucide-react";

const mockRules = [
  { id: "1", name: "Sektor kluczowy — energia", category: "Sektor", score: 30, isActive: true },
  { id: "2", name: "Powyżej 250 pracowników", category: "Rozmiar", score: 20, isActive: true },
  { id: "3", name: "Obrót > 50M EUR", category: "Rozmiar", score: 20, isActive: true },
  { id: "4", name: "Usługi DNS / TLD", category: "Usługi", score: 40, isActive: false },
];

export default function ScoringPage() {
  return (
    <div>
      <PageHeader title="Scoring i klasyfikacja" description="Reguły scoringu do klasyfikacji podmiotów KSC">
        <Button size="sm">
          <Plus size={16} />
          Dodaj regułę
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-5">
          <p className="text-sm text-gray-400 mb-1">Próg: Podmiot kluczowy</p>
          <p className="text-2xl font-bold text-brand-400">&ge; 60 pkt</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-400 mb-1">Próg: Podmiot ważny</p>
          <p className="text-2xl font-bold text-amber-400">&ge; 30 pkt</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-400 mb-1">Aktywne reguły</p>
          <p className="text-2xl font-bold text-white">{mockRules.filter(r => r.isActive).length}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reguły scoringu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockRules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={rule.isActive ? "accent" : "muted"}>
                      {rule.isActive ? "Aktywna" : "Nieaktywna"}
                    </Badge>
                    <Badge variant="outline">{rule.category}</Badge>
                  </div>
                  <p className="text-sm text-white">{rule.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">+{rule.score}</p>
                  <p className="text-xs text-gray-500">punktów</p>
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
