import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@kscsystem/ui";
import { Plus, Check } from "lucide-react";

const mockPlans = [
  {
    name: "Starter",
    code: "starter",
    priceMonthly: 199,
    priceYearly: 1990,
    maxUsers: 3,
    isActive: true,
    features: ["Checklista compliance", "Profil firmy", "1 szablon dokumentu", "Email support"],
  },
  {
    name: "Professional",
    code: "professional",
    priceMonthly: 499,
    priceYearly: 4990,
    maxUsers: 10,
    isActive: true,
    features: ["Wszystko ze Starter", "Pełna checklista", "Wszystkie szablony", "Rejestr incydentów", "Priority support"],
  },
  {
    name: "Enterprise",
    code: "enterprise",
    priceMonthly: 999,
    priceYearly: 9990,
    maxUsers: 50,
    isActive: true,
    features: ["Wszystko z Professional", "Dedykowany opiekun", "Custom integracje", "SLA 99.9%", "Onboarding"],
  },
];

export default function PlansPage() {
  return (
    <div>
      <PageHeader title="Plany cenowe" description="Zarządzanie planami i cenami subskrypcji">
        <Button size="sm">
          <Plus size={16} />
          Dodaj plan
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
          <Card key={plan.code} className="relative overflow-hidden">
            {plan.code === "professional" && (
              <div className="absolute top-0 left-0 right-0 h-1 gradient-brand" />
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                <Badge variant={plan.isActive ? "accent" : "muted"}>
                  {plan.isActive ? "Aktywny" : "Nieaktywny"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">{plan.priceMonthly}</span>
                <span className="text-gray-400"> PLN/mies.</span>
                <p className="text-xs text-gray-500 mt-1">
                  lub {plan.priceYearly} PLN/rok · do {plan.maxUsers} użytkowników
                </p>
              </div>
              <ul className="space-y-2">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={14} className="text-accent-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full mt-6" size="sm">Edytuj plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
