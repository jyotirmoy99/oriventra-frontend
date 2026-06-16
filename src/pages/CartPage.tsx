import { Link as RouterLink, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";
import { PATHS } from "../routes/paths";
import CartItemRow from "../components/cart/CartItemRow";
import EmptyCart from "../components/cart/EmptyCart";

// ---------------------------------------------------------------------------
// CartPage  (/cart)
// ---------------------------------------------------------------------------
// Full cart: editable line list + an order summary with the checkout CTA.
// Works for guests and signed-in users (useCart abstracts the source).
// ---------------------------------------------------------------------------

const CartPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, totalItems, isLoading, updateQuantity, removeItem, clear } = useCart();

  const hasUnavailable = items.some((l) => !l.available);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
        <EmptyCart />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
        Your cart
      </Typography>

      <Grid container spacing={4}>
        {/* Items */}
        <Grid size={{ xs: 12, md: 8 }}>
          {hasUnavailable && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Some items are unavailable or exceed stock. Update or remove them to
              continue.
            </Alert>
          )}

          <Paper variant="outlined" sx={{ px: { xs: 2, md: 3 }, borderRadius: 3 }}>
            <Stack divider={<Divider />}>
              {items.map((line) => (
                <CartItemRow
                  key={line.itemId}
                  line={line}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </Stack>
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button component={RouterLink} to={PATHS.products}>
              Continue shopping
            </Button>
            <Button color="error" onClick={clear}>
              Clear cart
            </Button>
          </Box>
        </Grid>

        {/* Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{ p: 3, borderRadius: 3, position: "sticky", top: 88 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Order summary
            </Typography>

            <Stack spacing={1.5}>
              <Row label={`Subtotal (${totalItems} item${totalItems === 1 ? "" : "s"})`} value={formatCurrency(subtotal)} />
              <Row label="Shipping" value="Calculated at checkout" muted />
              <Divider />
              <Row label="Total" value={formatCurrency(subtotal)} bold />
            </Stack>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<LockRoundedIcon />}
              disabled={hasUnavailable}
              onClick={() => navigate(PATHS.checkout)}
              sx={{ mt: 3 }}
            >
              Proceed to checkout
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", textAlign: "center", mt: 1 }}
            >
              Secure checkout
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

// Small summary line.
const Row = ({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
}) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
    <Typography variant={bold ? "subtitle1" : "body2"} color={muted ? "text.secondary" : "text.primary"} sx={{ fontWeight: bold ? 700 : 400 }}>
      {label}
    </Typography>
    <Typography variant={bold ? "h6" : "body2"} sx={{ fontWeight: bold ? 800 : 600 }} color={muted ? "text.secondary" : "text.primary"}>
      {value}
    </Typography>
  </Box>
);

export default CartPage;
