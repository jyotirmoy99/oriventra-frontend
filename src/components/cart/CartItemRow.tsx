import { useOptimistic, useTransition } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ImageNotSupportedRoundedIcon from "@mui/icons-material/ImageNotSupportedRounded";
import QuantityPicker from "../product/QuantityPicker";
import { formatCurrency } from "../../utils/formatCurrency";
import { PATHS } from "../../routes/paths";
import type { CartLine } from "../../types/cart.types";

// ---------------------------------------------------------------------------
// CartItemRow  (shared by the drawer and the cart page)
// ---------------------------------------------------------------------------
// Image, name/variant, unit price, quantity stepper, line total, remove. The
// quantity uses React 19 useOptimistic (rule (i)) so +/- feels instant while
// the underlying server/guest update commits; the base value reconciles it.
// ---------------------------------------------------------------------------

interface CartItemRowProps {
  line: CartLine;
  onUpdateQuantity: (line: CartLine, quantity: number) => void | Promise<void>;
  onRemove: (line: CartLine) => void;
  compact?: boolean; // tighter layout for the drawer
}

const CartItemRow = ({ line, onUpdateQuantity, onRemove, compact }: CartItemRowProps) => {
  const [optimisticQty, setOptimisticQty] = useOptimistic(line.quantity);
  const [, startTransition] = useTransition();

  // Await the update inside the transition so the optimistic quantity stays
  // pinned until the (server) cart actually reflects it. Without the await the
  // transition ends immediately and the value snaps back to the stale
  // line.quantity before the server responds — the visible flicker.
  const changeQty = (quantity: number) => {
    startTransition(async () => {
      setOptimisticQty(quantity);
      await onUpdateQuantity(line, quantity);
    });
  };

  const size = compact ? 56 : 84;
  const detailTo = line.product ? PATHS.productDetail(line.product.slug) : PATHS.products;

  return (
    <Stack direction="row" spacing={2} sx={{ py: 2, alignItems: "flex-start" }}>
      {/* Thumbnail */}
      <Box
        component={RouterLink}
        to={detailTo}
        sx={{
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {line.product?.image ? (
          <Box
            component="img"
            src={line.product.image}
            alt={line.product.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ImageNotSupportedRoundedIcon sx={{ color: "text.disabled" }} />
        )}
      </Box>

      {/* Details */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component={RouterLink}
              to={detailTo}
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                textDecoration: "none",
                display: "block",
                "&:hover": { color: "primary.main" },
              }}
              noWrap
            >
              {line.product?.name ?? "Unavailable product"}
            </Typography>
            {(line.variant?.size || line.variant?.color) && (
              <Typography variant="caption" color="text.secondary">
                {[line.variant?.size, line.variant?.color].filter(Boolean).join(" · ")}
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            aria-label="Remove item"
            onClick={() => onRemove(line)}
            sx={{ alignSelf: "flex-start" }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Unavailability hint */}
        {!line.available && (
          <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
            {line.product
              ? line.availableStock === 0
                ? "Out of stock"
                : `Only ${line.availableStock} left — reduce quantity`
              : "No longer available"}
          </Typography>
        )}

        {/* Quantity + line total */}
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", mt: 1 }}
        >
          <QuantityPicker
            value={Math.min(optimisticQty, Math.max(line.availableStock, 1))}
            max={Math.max(line.availableStock, 1)}
            onChange={changeQty}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {formatCurrency(line.unitPrice * optimisticQty)}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

export default CartItemRow;
