import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@kscsystem/db";
import { createPayment } from "@kscsystem/payments";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { planCode, billingPeriod } = body as {
    planCode: string;
    billingPeriod: "monthly" | "yearly";
  };

  // Find the plan
  const plan = await prisma.plan.findUnique({ where: { code: planCode } });
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const amount = billingPeriod === "yearly"
    ? Math.round((plan.priceYearly ?? plan.priceMonthly * 12) * 100)
    : Math.round(plan.priceMonthly * 100);

  const externalId = `ksc-${session.orgId}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  const appUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://kscsystem.pl";

  // Create payment record in DB
  const payment = await prisma.payment.create({
    data: {
      organizationId: session.orgId,
      externalId,
      amount,
      description: `${plan.name} — ${billingPeriod === "yearly" ? "roczny" : "miesieczny"}`,
      planCode: plan.code,
      billingPeriod,
    },
  });

  // Create payment via pay.infradesk.pl
  const result = await createPayment({
    amount,
    description: `KSC System — ${plan.name} (${billingPeriod === "yearly" ? "rok" : "miesiac"})`,
    buyerEmail: session.email,
    buyerName: session.name || undefined,
    externalId,
    continueUrl: `${appUrl}/settings/billing?payment=${payment.id}`,
    webhookUrl: `${appUrl}/api/payments/webhook`,
    metadata: {
      paymentId: payment.id,
      organizationId: session.orgId,
      planCode: plan.code,
      billingPeriod,
    },
  });

  // Update payment with proxy + Paynow IDs
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      paynowPaymentId: result.paymentId,
      paynowData: JSON.parse(JSON.stringify(result)),
    },
  });

  return NextResponse.json({
    redirectUrl: result.redirectUrl,
    paymentId: payment.id,
  });
}
