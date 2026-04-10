"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@kscsystem/ui";
import { Check, CreditCard, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Plan {
  id: string;
  name: string;
  code: string;
  description: string | null;
  priceMonthly: number;
  priceYearly: number | null;
  features: string[] | null;
  maxUsers: number;
}

interface Subscription {
  id: string;
  planName: string;
  planCode: string;
  status: string;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

const statusLabels: Record<string, { label: string; variant: "default" | "accent" | "warning" | "destructive" }> = {
  trial: { label: "Okres probny", variant: "warning" },
  active: { label: "Aktywna", variant: "accent" },
  cancelled: { label: "Anulowana", variant: "destructive" },
  expired: { label: "Wygasla", variant: "destructive" },
};

const paymentStatusLabels: Record<string, { label: string; variant: "default" | "accent" | "warning" | "destructive" }> = {
  new: { label: "Nowa", variant: "default" },
  pending: { label: "Oczekuje", variant: "warning" },
  confirmed: { label: "Oplacona", variant: "accent" },
  rejected: { label: "Odrzucona", variant: "destructive" },
  abandoned: { label: "Porzucona", variant: "destructive" },
  expired: { label: "Wygasla", variant: "destructive" },
  error: { label: "Blad", variant: "destructive" },
};

export function BillingClient({
  plans,
  subscription,
  payments,
}: {
  plans: Plan[];
  subscription: Subscription | null;
  payments: Payment[];
}) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function handlePayment(planCode: string) {
    setLoading(planCode);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planCode, billingPeriod }),
      });

      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert(data.error || "Wystapil blad");
      }
    } catch {
      alert("Blad polaczenia z serwerem");
    } finally {
      setLoading(null);
    }
  }

  const subStatus = subscription
    ? statusLabels[subscription.status] ?? { label: subscription.status, variant: "default" as const }
    : null;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings">
              <ArrowLeft size={16} />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-white">Subskrypcja i platnosci</h1>
        </div>
        <p className="text-sm text-gray-400 ml-11">Zarzadzaj swoim planem i historia platnosci</p>
      </div>

      {/* Current subscription */}
      {subscription && (
        <Card className="mb-8 max-w-3xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Aktualny plan</CardTitle>
              <Badge variant={subStatus?.variant}>{subStatus?.label}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{subscription.planName}</p>
                {subscription.trialEndsAt && (
                  <p className="text-sm text-gray-400">
                    Trial do: {new Date(subscription.trialEndsAt).toLocaleDateString("pl-PL")}
                  </p>
                )}
                {subscription.currentPeriodEnd && (
                  <p className="text-sm text-gray-400">
                    Nastepne odnowienie: {new Date(subscription.currentPeriodEnd).toLocaleDateString("pl-PL")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing period toggle */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setBillingPeriod("monthly")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            billingPeriod === "monthly"
              ? "bg-brand-500 text-white"
              : "bg-surface-100 text-gray-400 hover:text-white"
          }`}
        >
          Miesiecznie
        </button>
        <button
          onClick={() => setBillingPeriod("yearly")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            billingPeriod === "yearly"
              ? "bg-brand-500 text-white"
              : "bg-surface-100 text-gray-400 hover:text-white"
          }`}
        >
          Rocznie
          <span className="ml-1 text-xs text-accent-400">-17%</span>
        </button>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mb-12">
        {plans.map((plan) => {
          const price = billingPeriod === "yearly"
            ? plan.priceYearly ?? plan.priceMonthly * 12
            : plan.priceMonthly;
          const monthlyPrice = billingPeriod === "yearly"
            ? Math.round(price / 12)
            : price;
          const isCurrent = subscription?.planCode === plan.code;
          const isPopular = plan.code === "professional";

          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden ${isPopular ? "border-brand-500" : ""}`}
            >
              {isPopular && (
                <div className="h-1 gradient-brand" />
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {isCurrent && <Badge variant="accent">Aktualny</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-3xl font-bold text-white">{monthlyPrice}</span>
                  <span className="text-gray-400 ml-1">PLN/mies.</span>
                  {billingPeriod === "yearly" && (
                    <p className="text-xs text-gray-500 mt-1">
                      {price} PLN/rok
                    </p>
                  )}
                </div>

                {plan.features && (
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check size={14} className="text-accent-400 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  className="w-full"
                  variant={isPopular ? "default" : "secondary"}
                  disabled={isCurrent || loading === plan.code}
                  onClick={() => handlePayment(plan.code)}
                >
                  {loading === plan.code ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Przekierowanie...
                    </>
                  ) : isCurrent ? (
                    "Aktualny plan"
                  ) : (
                    <>
                      <CreditCard size={16} />
                      {subscription ? "Zmien plan" : "Wybierz plan"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment history */}
      {payments.length > 0 && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Historia platnosci</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => {
                const ps = paymentStatusLabels[payment.status] ?? { label: payment.status, variant: "default" as const };
                return (
                  <div key={payment.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm text-white">{payment.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString("pl-PL")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-white">
                        {(payment.amount / 100).toFixed(2)} {payment.currency}
                      </span>
                      <Badge variant={ps.variant}>{ps.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
