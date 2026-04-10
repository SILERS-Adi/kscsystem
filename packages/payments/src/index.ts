// Payment integration via pay.infradesk.pl (custom Paynow proxy)
// This service handles all Paynow API key management server-side.

const PAY_API_URL = process.env.PAY_API_URL || "https://pay.infradesk.pl";

// --- Types ---

export interface CreatePaymentParams {
  amount: number; // in grosze (1 PLN = 100 groszy)
  description: string;
  buyerEmail: string;
  buyerName?: string;
  buyerPhone?: string;
  externalId?: string;
  currency?: string;
  continueUrl?: string;
  webhookUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentResponse {
  id: string;          // pay.infradesk.pl internal UUID
  paymentId: string;   // Paynow payment ID (e.g. PAAK-BNV-77V-O21)
  redirectUrl: string; // Paywall URL
}

export interface PaymentDetails {
  id: string;
  paynow_id: string;
  external_id: string;
  amount: number;
  currency: string;
  description: string;
  status: string | null;
  buyer_email: string;
  buyer_name: string | null;
  buyer_phone: string | null;
  client_id: string | null;
  session_id: string | null;
  invoice_id: string | null;
  type: string;
  metadata: Record<string, unknown> | null;
  redirect_url: string | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
}

export interface PaymentNotification {
  id?: string;
  paymentId?: string;
  paynow_id?: string;
  externalId?: string;
  external_id?: string;
  status: string;
  modifiedAt?: string;
}

// --- API calls ---

export async function createPayment(params: CreatePaymentParams): Promise<CreatePaymentResponse> {
  const response = await fetch(`${PAY_API_URL}/api/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: params.amount,
      description: params.description,
      buyerEmail: params.buyerEmail,
      buyerName: params.buyerName,
      buyerPhone: params.buyerPhone,
      externalId: params.externalId,
      currency: params.currency ?? "PLN",
      continueUrl: params.continueUrl,
      webhookUrl: params.webhookUrl,
      metadata: params.metadata,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Payment API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function getPayment(id: string): Promise<PaymentDetails> {
  const response = await fetch(`${PAY_API_URL}/api/payments/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Payment API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// Map pay.infradesk.pl / Paynow status to our DB enum
export function mapPaymentStatus(status: string | null | undefined): "new" | "pending" | "confirmed" | "rejected" | "abandoned" | "expired" | "error" {
  if (!status) return "new";
  const upper = status.toUpperCase();
  switch (upper) {
    case "NEW":
      return "new";
    case "PENDING":
    case "PROCESSING":
      return "pending";
    case "CONFIRMED":
    case "PAID":
    case "SUCCESS":
      return "confirmed";
    case "REJECTED":
      return "rejected";
    case "ABANDONED":
      return "abandoned";
    case "EXPIRED":
      return "expired";
    case "ERROR":
      return "error";
    default:
      return "new";
  }
}
