import { Link as RouterLink } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { OrderStatusChip, PaymentStatusChip } from "./OrderStatusChip";
import { formatCurrency } from "../../utils/formatCurrency";
import { PATHS } from "../../routes/paths";
import type { Order } from "../../types/order.types";

// ---------------------------------------------------------------------------
// OrderCard — one row in the order history list.
// ---------------------------------------------------------------------------

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const OrderCard = ({ order }: { order: Order }) => {
  const totalItems = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{ justifyContent: "space-between", gap: 1, mb: 1.5 }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {order.orderNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Placed {fmtDate(order.createdAt)}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start", flexWrap: "wrap" }}>
          <OrderStatusChip status={order.status} />
          <PaymentStatusChip status={order.paymentStatus} />
        </Stack>
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      {/* Body: item thumbnails + total */}
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
          <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 44, height: 44 } }}>
            {order.items.map((item, i) => (
              <Avatar key={i} variant="rounded" src={item.image} alt={item.name} sx={{ bgcolor: "action.hover" }}>
                {item.name.charAt(0)}
              </Avatar>
            ))}
          </AvatarGroup>
          <Typography variant="body2" color="text.secondary" noWrap>
            {totalItems} item{totalItems === 1 ? "" : "s"}
          </Typography>
        </Stack>

        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {formatCurrency(order.totalAmount)}
          </Typography>
          <Button component={RouterLink} to={PATHS.orderDetail(order._id)} size="small">
            View details
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default OrderCard;
