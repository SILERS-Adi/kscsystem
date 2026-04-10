import { prisma } from "@kscsystem/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BillingClient } from "./billing-client";

export default async function BillingPage() {
  const session = await getSession();
  if (!session?.orgId) redirect("/login");

  const [plans, subscription, payments] = await Promise.all([
    prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.subscription.findUnique({
      where: { organizationId: session.orgId },
      include: { plan: true },
    }),
    prisma.payment.findMany({
      where: { organizationId: session.orgId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const serializedPlans = plans.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    description: p.description,
    priceMonthly: p.priceMonthly,
    priceYearly: p.priceYearly,
    features: p.features as string[] | null,
    maxUsers: p.maxUsers,
  }));

  const serializedSub = subscription
    ? {
        id: subscription.id,
        planName: subscription.plan.name,
        planCode: subscription.plan.code,
        status: subscription.status,
        trialEndsAt: subscription.trialEndsAt?.toISOString() ?? null,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
      }
    : null;

  const serializedPayments = payments.map((p) => ({
    id: p.id,
    amount: p.amount,
    currency: p.currency,
    description: p.description,
    status: p.status,
    paidAt: p.paidAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <BillingClient
      plans={serializedPlans}
      subscription={serializedSub}
      payments={serializedPayments}
    />
  );
}
