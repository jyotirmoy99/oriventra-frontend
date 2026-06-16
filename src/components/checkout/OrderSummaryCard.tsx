import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { formatCurrency } from "../../utils/formatCurrency";
import type { CartLine } from "../../types/cart.types";

// ---------------------------------------------------------------------------
// OrderSummaryCard
// ---------------------------------------------------------------------------
// Cart lines + an ESTIMATED total for the checkout sidebar. Shipping mirrors the
// backend rule (free ≥ $100, else $10). Taxes/discounts are applied server-side
// at order time, so they're noted rather than computed here.
// ---------------------------------------------------------------------------

const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_SHIPPING_FEE = 10;

interface OrderSummaryCardProps {
  items: CartLine[];
  subtotal: number;
}

const Row = ({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
    <Typography variant={bold ? "subtitle1" : "body2"} sx={{ fontWeight: bold ? 700 : 400 }} color={muted ? "text.secondary" : "text.primary"}>
      {label}
    </Typography>
    <Typography variant={bold ? "h6" : "body2"} sx={{ fontWeight: bold ? 800 : 600 }} color={muted ? "text.secondary" : "text.primary"}>
      {value}
    </Typography>
  </Box>
);

const OrderSummaryCard = ({ items, subtotal }: OrderSummaryCardProps) => {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_FEE;
  const estTotal = subtotal + shipping;

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, position: "sticky", top: 88 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Order summary
      </Typography>

      {/* Items */}
      <Stack spacing={1.5} sx={{ mb: 2, maxHeight: 280, overflowY: "auto" }}>
        {items.map((line) => (
          <Box key={line.itemId} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Avatar
              variant="rounded"
              src={line.product?.image}
              alt={line.product?.name}
              sx={{ width: 44, height: 44, bgcolor: "action.hover" }}
            >
              {line.product?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                {line.product?.name ?? "Unavailable"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Qty {line.quantity}
                {line.variant?.size || line.variant?.color
                  ? ` · ${[line.variant?.size, line.variant?.color].filter(Boolean).join(" / ")}`
                  : ""}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatCurrency(line.lineTotal)}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={1.25}>
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        <Row label="Shipping" value={shipping === 0 ? "Free" : formatCurrency(shipping)} />
        <Row label="Taxes & discounts" value="At checkout" muted />
        <Divider />
        <Row label="Estimated total" value={formatCurrency(estTotal)} bold />
      </Stack>
    </Paper>
  );
};

export default OrderSummaryCard;
