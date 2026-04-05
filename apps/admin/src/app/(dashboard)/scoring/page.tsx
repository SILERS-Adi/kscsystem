import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@kscsystem/ui";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { getScoringRules, deleteScoringRule, toggleScoringRule } from "./_actions/scoring-actions";
import { RuleForm } from "./_components/rule-form";

export const dynamic = 'force-dynamic';

export default async function ScoringPage() {
  const rules = await getScoringRules();
  const activeCount = rules.filter((r) => r.isActive).length;

  return (
    <div>
      <PageHeader title="Scoring i klasyfikacja" description="Reguły scoringu do klasyfikacji podmiotów KSC" />

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
          <p className="text-2xl font-bold text-white">{activeCount}</p>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dodaj regułę</CardTitle>
          </CardHeader>
          <CardContent>
            <RuleForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reguły scoringu ({rules.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rules.map((rule) => {
                const cond = rule.condition as { field: string; operator: string; value: number };
                return (
                  <div key={rule.id} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={rule.isActive ? "accent" : "muted"}>
                          {rule.isActive ? "Aktywna" : "Nieaktywna"}
                        </Badge>
                        {rule.category && <Badge variant="outline">{rule.category}</Badge>}
                      </div>
                      <p className="text-sm font-medium text-white">{rule.name}</p>
                      {rule.description && <p className="text-xs text-gray-500 mt-0.5">{rule.description}</p>}
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        {cond.field} {cond.operator} {cond.value}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{rule.score > 0 ? `+${rule.score}` : rule.score}</p>
                      <p className="text-xs text-gray-500">punktów</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <form action={async () => { "use server"; await toggleScoringRule(rule.id, !rule.isActive); }}>
                        <Button variant="ghost" size="icon" type="submit">
                          {rule.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </form>
                      <form action={async () => { "use server"; await deleteScoringRule(rule.id); }}>
                        <Button variant="ghost" size="icon" type="submit" className="text-red-400 hover:text-red-300">
                          <Trash2 size={16} />
                        </Button>
                      </form>
                    </div>
                  </div>
                );
              })}
              {rules.length === 0 && (
                <p className="text-sm text-gray-500 py-8 text-center">Brak reguł. Dodaj pierwszą regułę scoringu.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
