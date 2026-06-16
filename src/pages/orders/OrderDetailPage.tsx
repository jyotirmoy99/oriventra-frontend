import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useOrder, useCancelOrder } from "../../hooks/useOrders";
import { useSnackbar } from "../../hooks/useSnackbar";
import * as paymentService from "../../services/payment.service";
import { redirectToCheckout } from "../../lib/stripe";
import { getErrorMessage } from "../../utils/getErrorMessage";
import OrderStatusTimeline from "../../components/order/OrderStatusTimeline";
import OrderItems from "../../components/order/OrderItems";
import OrderTotals from "../../components/order/OrderTotals";
import { OrderStatusChip, PaymentStatusChip } from "../../components/order/OrderStatusChip";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// OrderDetailPage  (/orders/:id — behind PrivateRoute)
// ---------------------------------------------------------------------------
// Full order: status timeline, items, totals, shipping address, and actions
// (cancel while pending/processing; complete payment for unpaid Stripe orders).
// ---------------------------------------------------------------------------

const CANCELLABLE = ["pending", "processing"];

const OrderDetailPage = () => {
  const { id = "" } = useParams();
  const { data: order, isLoading, isError } = useOrder(id);
  const cancelOrder = useCancelOrder();
  const { notify } = useSnackbar();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [paying, setPaying] = useState(false);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Order not found
        </Typography>
        <Button component={RouterLink} to={PATHS.orders} variant="contained" sx={{ mt: 2 }}>
          Back to orders
        </Button>
      </Container>
    );
  }

  const canCancel = CANCELLABLE.includes(order.status);
  const canPay =
    order.paymentMethod === "stripe" &&
    order.paymentStatus === "pending" &&
    order.status !== "cancelled";

  const handleCancel = () => {
    cancelOrder.mutate(
      { id: order._id, reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          setCancelOpen(false);
          notify("Order cancelled", "success");
        },
        onError: (err) => notify(getErrorMessage(err), "error"),
      },
    );
  };

  const handlePayNow = async () => {
    setPaying(true);
    try {
      const session = await paymentService.createCheckout(order._id);
      await redirectToCheckout(session);
    } catch (err) {
      notify(getErrorMessage(err), "error");
      setPaying(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Link component={RouterLink} to={PATHS.orders} underline="hover" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2 }}>
        <ArrowBackRoundedIcon fontSize="small" /> Back to orders
      </Link>

      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, gap: 1, mb: 3 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {order.orderNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Placed {new Date(order.createdAt).toLocaleString()}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <OrderStatusChip status={order.status} size="medium" />
          <PaymentStatusChip status={order.paymentStatus} size="medium" />
        </Stack>
      </Stack>

      {canPay && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handlePayNow} disabled={paying}>
              {paying ? "Redirecting…" : "Complete payment"}
            </Button>
          }
        >
          This order is awaiting payment.
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left: timeline + items */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Order status
          </Typography>
          <OrderStatusTimeline order={order} />

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Items
          </Typography>
          <OrderItems items={order.items} />
        </Grid>

        {/* Right: summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Summary
            </Typography>
            <OrderTotals order={order} />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Payment
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {order.paymentMethod === "stripe" ? "Card (Stripe)" : "Cash on Delivery"}
            </Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Shipping to
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
              <br />
              {order.shippingAddress.phone}
            </Typography>

            {canCancel && (
              <Button
                color="error"
                variant="outlined"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => setCancelOpen(true)}
              >
                Cancel order
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Cancel confirmation */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Cancel this order?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This can’t be undone. Stock will be returned. Let us know why (optional):
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)} disabled={cancelOrder.isPending}>
            Keep order
          </Button>
          <Button color="error" variant="contained" onClick={handleCancel} loading={cancelOrder.isPending}>
            Cancel order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderDetailPage;
