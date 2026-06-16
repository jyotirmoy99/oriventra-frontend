import { loadStripe, type Stripe } from "@stripe/stripe-js";
import type { CheckoutSession } from "../services/payment.service";

// ---------------------------------------------------------------------------
// Stripe (hosted Checkout)
// ---------------------------------------------------------------------------
// The backend creates a Stripe Checkout SESSION and returns its hosted `url`.
// The primary, recommended path is to redirect the browser straight to that
// url. We still lazy-load Stripe.js with the publishable key as a fallback
// (`redirectToCheckout({ sessionId })`) and for any future Elements use.
// ---------------------------------------------------------------------------

let stripePromise: Promise<Stripe | null> | null = null;

/** Lazy-load the Stripe.js singleton (only when checkout is actually used). */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
    stripePromise = key ? loadStripe(key) : Promise.resolve(null);
  }
  return stripePromise;
}

/**
 * Send the shopper to Stripe's hosted Checkout. We initialise Stripe.js with the
 * publishable key first (this validates the key and readies the SDK), then
 * redirect to the session's hosted `url` — the approach Stripe recommends for
 * Checkout Sessions created server-side.
 */
export async function redirectToCheckout(session: CheckoutSession): Promise<void> {
  await getStripe();
  if (!session.url) {
    throw new Error("Could not start checkout — no session URL was returned");
  }
  window.location.assign(session.url);
}
