import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { formatCurrency } from "../../utils/formatCurrency";
import type { OrderItem } from "../../types/order.types";

// ---------------------------------------------------------------------------
// OrderItems — list of an order's line items (snapshots).
// ---------------------------------------------------------------------------

const OrderItems = ({ items }: { items: OrderItem[] }) => (
  <Stack spacing={2}>
    {items.map((item, i) => (
      <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        <Avatar
          variant="rounded"
          src={item.image}
          alt={item.name}
          sx={{ width: 56, height: 56, bgcolor: "action.hover" }}
        >
          {item.name.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {item.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.variant?.size || item.variant?.color
              ? `${[item.variant?.size, item.variant?.color].filter(Boolean).join(" / ")} · `
              : ""}
            {formatCurrency(item.unitPrice)} × {item.quantity}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
          {formatCurrency(item.lineTotal)}
        </Typography>
      </Box>
    ))}
  </Stack>
);

export default OrderItems;
