import { PageHeader } from "@/components/page-header";
import { getPlans } from "./_actions/plan-actions";
import { PlanManager, type PlanView } from "./_components/plan-manager";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const plans = await getPlans();
  const items: PlanView[] = plans.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    description: p.description,
    priceMonthly: p.priceMonthly,
    priceYearly: p.priceYearly,
    maxUsers: p.maxUsers,
    features: Array.isArray(p.features) ? (p.features as string[]) : [],
    isActive: p.isActive,
    sortOrder: p.sortOrder,
  }));

  return (
    <div>
      <PageHeader title="Plany cenowe" description="Zarządzanie planami i cenami subskrypcji" />
      <PlanManager plans={items} />
    </div>
  );
}
