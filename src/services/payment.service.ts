import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse } from "../types";

// ---------------------------------------------------------------------------
// payment.service
// ---------------------------------------------------------------------------
// The backend uses Stripe Checkout (hosted): we create a session for an order
// and get back a redirect URL.
// ---------------------------------------------------------------------------

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

/** POST /payments/checkout — create a Stripe Checkout session for an order. */
export async function createCheckout(orderId: string): Promise<CheckoutSession> {
  const { data } = await axiosInstance.post<ApiResponse<CheckoutSession>>(
    "/payments/checkout",
    { orderId },
  );
  return data.data!;
}
