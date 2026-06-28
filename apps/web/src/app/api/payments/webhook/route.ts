import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@kscsystem/db";
import { mapPaymentStatus, getPayment, type PaymentNotification } from "@kscsystem/payments";

/**
 * Webhook płatności. BEZPIECZEŃSTWO:
 * Ciału powiadomienia NIE ufamy co do statusu — używamy go tylko do ZNALEZIENIA
 * naszej płatności. Autorytatywny status pobieramy serwer-do-serwera z proxy
 * (`getPayment`) po proxy-UUID ZAPISANYM przy tworzeniu płatności. Dzięki temu
 * spreparowany POST `{externalId, status:"confirmed"}` nie aktywuje planu —
 * aktywacja następuje wyłącznie, gdy proxy potwierdzi płatność jako opłaconą.
 * Dodatkowo, jeśli ustawiono PAY_WEBHOOK_SECRET, wymagamy tokenu w URL (?token=).
 */
export async function POST(req: NextRequest) {
  // Opcjonalna pierwsza bramka: współdzielony sekret w URL (jeśli skonfigurowany).
  const secret = process.env.PAY_WEBHOOK_SECRET;
  if (secret && req.nextUrl.searchParams.get("token") !== secret) {
    return new NextResponse(null, { status: 401 });
  }

  let notification: PaymentNotification;
  try {
    notification = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Body służy WYŁĄCZNIE do znalezienia płatności (nie do ustalenia statusu).
  const externalId = notification.externalId ?? notification.external_id;
  const paynowId = notification.paymentId ?? notification.paynow_id;

  const payment = await prisma.payment.findFirst({
    where: {
      OR: [
        ...(externalId ? [{ externalId }] : []),
        ...(paynowId ? [{ paynowPaymentId: paynowId }] : []),
      ],
    },
  });

  if (!payment) {
    console.error("Webhook: payment not found", { externalId, paynowId });
    return new NextResponse(null, { status: 200 });
  }

  // Proxy-UUID z DANYCH ZAPISANYCH przy tworzeniu płatności (źródło prawdy),
  // a nie z ciała powiadomienia. Fallback do notification.id tylko gdy brak.
  const storedProxyId = (payment.paynowData as { id?: string } | null)?.id;
  const proxyId = storedProxyId ?? notification.id;

  if (!proxyId) {
    // Bez identyfikatora po stronie proxy nie zweryfikujemy — nie aktywujemy.
    console.error("Webhook: brak proxyId do weryfikacji statusu", { paymentId: payment.id });
    return new NextResponse(null, { status: 200 });
  }

  // AUTORYTATYWNY status z proxy (serwer-do-serwera). Błąd => fail-closed.
  let status: string | null;
  try {
    const details = await getPayment(proxyId);
    status = details.status ?? null;
  } catch (err) {
    console.error("Webhook: nie udało się pobrać statusu z proxy — pomijam (fail-closed)", err);
    return new NextResponse(null, { status: 200 });
  }

  const dbStatus = mapPaymentStatus(status);

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: dbStatus,
      paynowPaymentId: paynowId ?? payment.paynowPaymentId,
      ...(dbStatus === "confirmed" && !payment.paidAt ? { paidAt: new Date() } : {}),
    },
  });

  // Aktywacja subskrypcji wyłącznie po POTWIERDZONEJ przez proxy płatności.
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
