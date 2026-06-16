import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { formatCurrency } from "../../utils/formatCurrency";
import type { Order } from "../../types/order.types";

// ---------------------------------------------------------------------------
// OrderTotals — subtotal / shipping / tax / discount / total breakdown.
// ---------------------------------------------------------------------------

const Line = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
    <Typography
      variant={bold ? "subtitle1" : "body2"}
      color={bold ? "text.primary" : "text.secondary"}
      sx={{ fontWeight: bold ? 700 : 400 }}
    >
      {label}
    </Typography>
    <Typography variant={bold ? "h6" : "body2"} sx={{ fontWeight: bold ? 800 : 600 }}>
      {value}
    </Typography>
  </Box>
);

const OrderTotals = ({ order }: { order: Order }) => (
  <Stack spacing={1}>
    <Line label="Subtotal" value={formatCurrency(order.subtotal)} />
    <Line label="Shipping" value={order.shippingFee === 0 ? "Free" : formatCurrency(order.shippingFee)} />
    {order.taxAmount > 0 && <Line label="Tax" value={formatCurrency(order.taxAmount)} />}
    {order.discountAmount > 0 && (
      <Line
        label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`}
        value={`−${formatCurrency(order.discountAmount)}`}
      />
    )}
    <Divider />
    <Line label="Total" value={formatCurrency(order.totalAmount)} bold />
  </Stack>
);

export default OrderTotals;
