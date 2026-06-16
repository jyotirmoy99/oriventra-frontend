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

      // The cart was emptied server-side; drop any cached order lists.
      queryClient.setQueryData(cartKeys.cart, undefined);
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      if (payload.paymentMethod === "stripe") {
        const session = await paymentService.createCheckout(order._id);
        await redirectToCheckout(session); // leaves the SPA
        return; // keep isSubmitting true while the browser navigates
      }

      // Cash on delivery — order is placed; go to confirmation.
      navigate(`${PATHS.orderSuccess}?orderId=${order._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, error };
}
