import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@kscsystem/db";
import { mapPaymentStatus, getPayment, type PaymentNotification } from "@kscsystem/payments";

export async function POST(req: NextRequest) {
  let notification: PaymentNotification;
  try {
    notification = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // pay.infradesk.pl may forward Paynow notification or send its own format
  const externalId = notification.externalId ?? notification.external_id;
  const paynowId = notification.paymentId ?? notification.paynow_id;
  const proxyId = notification.id;

  // Find payment
  const payment = await prisma.payment.findFirst({
    where: {
      OR: [
        ...(externalId ? [{ externalId }] : []),
        ...(paynowId ? [{ paynowPaymentId: paynowId }] : []),
      ],
    },
  });

  if (!payment) {
    console.error(`Webhook: payment not found`, { externalId, paynowId, proxyId });
    return new NextResponse(null, { status: 200 });
  }

  // If status not in payload, fetch fresh from proxy using its UUID
  let status = notification.status;
  if (!status && proxyId) {
    try {
      const details = await getPayment(proxyId);
      status = details.status ?? "NEW";
    } catch (err) {
      console.error("Webhook: failed to fetch payment status", err);
    }
  }

  const dbStatus = mapPaymentStatus(status);

  // Update payment
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: dbStatus,
      paynowPaymentId: paynowId ?? payment.paynowPaymentId,
      ...(dbStatus === "confirmed" && !payment.paidAt ? { paidAt: new Date() } : {}),
    },
  });

  // Activate subscription on confirmation
  if (dbStatus === "confirmed" && payment.planCode) {
    const plan = await prisma.plan.findUnique({ where: { code: payment.planCode } });

    if (plan) {
      const periodDays = payment.billingPeriod === "yearly" ? 365 : 30;
      const periodEnd = new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000);

      await prisma.subscription.upsert({
        where: { organizationId: payment.organizationId },
        update: {
          planId: plan.id,
          status: "active",
          trialEndsAt: null,
          currentPeriodStart: new Date(),
          currentPeriodEnd: periodEnd,
        },
        create: {
          organizationId: payment.organizationId,
          planId: plan.id,
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: periodEnd,
        },
      });

      const sub = await prisma.subscription.findUnique({
        where: { organizationId: payment.organizationId },
      });
      if (sub) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { subscriptionId: sub.id },
        });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
