import { Link as RouterLink, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// OrderCancelPage  (/order/cancel?orderId=…)
// ---------------------------------------------------------------------------
// Stripe cancel_url landing. The order exists (unpaid); the user can retry
// payment from their orders, or head back to the cart.
// ---------------------------------------------------------------------------

const OrderCancelPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}>
      <HighlightOffRoundedIcon sx={{ fontSize: 64, color: "text.disabled", mb: 1 }} />
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Payment cancelled
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Your payment wasn’t completed and you haven’t been charged. Your order is
        saved as unpaid — you can complete payment from your orders.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "center" }}>
        {orderId && (
          <Button component={RouterLink} to={PATHS.orderDetail(orderId)} variant="contained">
            View order
          </Button>
        )}
        <Button component={RouterLink} to={PATHS.cart} variant="outlined">
          Back to cart
        </Button>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <Button component={RouterLink} to={PATHS.products}>
          Continue shopping
        </Button>
      </Box>
    </Container>
  );
};

export default OrderCancelPage;
