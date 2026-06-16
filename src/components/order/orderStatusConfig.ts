import type { OrderStatus, PaymentStatus } from "../../types/order.types";

// ---------------------------------------------------------------------------
// Order status display config (shared by chips, timeline, cards)
// ---------------------------------------------------------------------------

type ChipColor = "default" | "primary" | "info" | "success" | "warning" | "error";

/** The linear fulfilment path (cancelled is a separate terminal branch). */
export const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/** Short description shown under each timeline step. */
export const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  pending: "Order placed",
  processing: "Payment confirmed, preparing your order",
  shipped: "On its way to you",
  delivered: "Delivered",
  cancelled: "Order cancelled",
};

export const STATUS_COLORS: Record<OrderStatus, ChipColor> = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  pending: "Payment pending",
  paid: "Paid",
  failed: "Payment failed",
  refunded: "Refunded",
};

export const PAYMENT_COLORS: Record<PaymentStatus, ChipColor> = {
  pending: "warning",
  paid: "success",
  failed: "error",
  refunded: "default",
};
