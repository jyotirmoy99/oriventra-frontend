import Chip from "@mui/material/Chip";
import type { OrderStatus, PaymentStatus } from "../../types/order.types";
import {
  PAYMENT_COLORS,
  PAYMENT_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from "./orderStatusConfig";

// ---------------------------------------------------------------------------
// OrderStatusChip / PaymentStatusChip — small labelled status badges.
// ---------------------------------------------------------------------------

export const OrderStatusChip = ({
  status,
  size = "small",
}: {
  status: OrderStatus;
  size?: "small" | "medium";
}) => (
  <Chip label={STATUS_LABELS[status]} color={STATUS_COLORS[status]} size={size} />
);

export const PaymentStatusChip = ({
  status,
  size = "small",
}: {
  status: PaymentStatus;
  size?: "small" | "medium";
}) => (
  <Chip
    label={PAYMENT_LABELS[status]}
    color={PAYMENT_COLORS[status]}
    size={size}
    variant="outlined"
  />
);
