import { Link as RouterLink, useSearchParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useOrder } from "../../hooks/useOrders";
import { formatCurrency } from "../../utils/formatCurrency";
import { PATHS } from "../../routes/paths";
import type { PaymentStatus } from "../../types/order.types";

// ---------------------------------------------------------------------------
// OrderSuccessPage  (/order/success?orderId=…)
// ---------------------------------------------------------------------------
// Confirmation after placing an order (Stripe success_url and the COD landing).
// Stripe marks the order paid via webhook asynchronously, so the payment status
// may briefly read "pending" right after returning — we say so.
// ---------------------------------------------------------------------------

const paymentChip: Record<PaymentStatus, { label: string; color: "success" | "warning" | "error" | "default" }> = {
  paid: { label: "Paid", color: "success" },
  pending: { label: "Payment pending", color: "warning" },
  failed: { label: "Payment failed", color: "error" },
  refunded: { label: "Refunded", color: "default" },
};

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const { data: order, isLoading, isError } = useOrder(orderId);

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Order confirmed
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          We couldn’t load the order details, but your order may still have been
          placed. Check your order history.
        </Typography>
        <Button component={RouterLink} to={PATHS.orders} variant="contained">
          View my orders
        </Button>
      </Container>
    );
  }

  const pay = paymentChip[order.paymentStatus];

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <CheckCircleRoundedIcon color="success" sx={{ fontSize: 64, mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Thank you for your order!
        </Typography>
        <Typography color="text.secondary">
          Order <strong>{order.orderNumber}</strong> has been placed.
        </Typography>
      </Box>

      {order.paymentMethod === "stripe" && order.paymentStatus === "pending" && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Your payment is being confirmed — this can take a moment. The status
          will update automatically.
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Summary
          </Typography>
          <Chip label={pay.label} color={pay.color} size="small" />
        </Stack>

        {/* Items */}
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {order.items.map((item, i) => (
            <Box key={i} sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 0 }}>
                {item.name}
                {item.variant?.size || item.variant?.color
                  ? ` (${[item.variant?.size, item.variant?.color].filter(Boolean).join(" / ")})`
                  : ""}{" "}
                × {item.quantity}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                {formatCurrency(item.lineTotal)}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          <Line label="Subtotal" value={formatCurrency(order.subtotal)} />
          <Line label="Shipping" value={order.shippingFee === 0 ? "Free" : formatCurrency(order.shippingFee)} />
          {order.taxAmount > 0 && <Line label="Tax" value={formatCurrency(order.taxAmount)} />}
          {order.discountAmount > 0 && (
            <Line label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`} value={`−${formatCurrency(order.discountAmount)}`} />
          )}
          <Divider />
          <Line label="Total" value={formatCurrency(order.totalAmount)} bold />
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Shipping address */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
          Shipping to
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}
          {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""},{" "}
          {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </Typography>
      </Paper>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
        <Button component={RouterLink} to={PATHS.orderDetail(order._id)} variant="contained" fullWidth>
          View order
        </Button>
        <Button component={RouterLink} to={PATHS.products} variant="outlined" fullWidth>
          Continue shopping
        </Button>
      </Stack>
    </Container>
  );
};

const Line = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
    <Typography variant={bold ? "subtitle1" : "body2"} color={bold ? "text.primary" : "text.secondary"} sx={{ fontWeight: bold ? 700 : 400 }}>
      {label}
    </Typography>
    <Typography variant={bold ? "h6" : "body2"} sx={{ fontWeight: bold ? 800 : 600 }}>
      {value}
    </Typography>
  </Box>
);

export default OrderSuccessPage;
