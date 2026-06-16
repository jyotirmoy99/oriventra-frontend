import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import * as orderService from "../services/order.service";
import * as paymentService from "../services/payment.service";
import { redirectToCheckout } from "../lib/stripe";
import { cartKeys } from "../features/cart/cartKeys";
import { orderKeys } from "./useOrders";
import { getErrorMessage } from "../utils/getErrorMessage";
import { PATHS } from "../routes/paths";
import type { PlaceOrderPayload } from "../types/order.types";

// ---------------------------------------------------------------------------
// useCheckout
// ---------------------------------------------------------------------------
// Orchestrates placing an order and (for Stripe) starting the hosted checkout:
//   1. POST /orders            → creates the order, empties the cart
//   2a. stripe → POST /payments/checkout → redirect to Stripe's hosted page
//   2b. cod    → straight to the confirmation page
// Errors surface via `error`; `isSubmitting` covers both network steps and the
// redirect window (so the button stays disabled until the page navigates away).
// ---------------------------------------------------------------------------

export function useCheckout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (payload: PlaceOrderPayload) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const order = await orderService.placeOrder(payload);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      if (payload.paymentMethod === "stripe") {
        // Create the session and redirect BEFORE touching the cart cache.
        // Clearing it here would flash the empty-cart state on the checkout
        // page while the (async) session request is in flight. The cart is
        // emptied server-side; returning from Stripe is a fresh page load that
        // refetches everything.
        const session = await paymentService.createCheckout(order._id);
        await redirectToCheckout(session); // leaves the SPA; keep isSubmitting true
        return;
      }

      // Cash on delivery — order placed, cart emptied server-side. Drop the
      // cached cart so the badge/cart page reflect it, then confirm.
      queryClient.removeQueries({ queryKey: cartKeys.cart });
      navigate(`${PATHS.orderSuccess}?orderId=${order._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, error };
}
