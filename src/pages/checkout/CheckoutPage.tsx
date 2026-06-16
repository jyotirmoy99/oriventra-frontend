import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useCart } from "../../hooks/useCart";
import { useAddresses } from "../../hooks/useAddresses";
import { useCheckout } from "../../hooks/useCheckout";
import AddressStep from "../../components/checkout/AddressStep";
import PaymentStep from "../../components/checkout/PaymentStep";
import OrderSummaryCard from "../../components/checkout/OrderSummaryCard";
import EmptyCart from "../../components/cart/EmptyCart";
import { PATHS } from "../../routes/paths";
import type { PaymentMethod } from "../../types/order.types";

// ---------------------------------------------------------------------------
// CheckoutPage  (/checkout — behind PrivateRoute)
// ---------------------------------------------------------------------------
// Two steps — address → payment — alongside a live order summary. Placing the
// order is delegated to useCheckout (which redirects to Stripe for card
// payments, or to the confirmation page for COD).
// ---------------------------------------------------------------------------

const STEPS = ["Address", "Payment"];

const CheckoutPage = () => {
  const { items, subtotal, isLoading } = useCart();
  const { data: addresses } = useAddresses();
  const { submit, isSubmitting, error } = useCheckout();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("stripe");
  const [couponCode, setCouponCode] = useState("");
  const [note, setNote] = useState("");

  // Auto-select the default (or first) address once loaded — set during render
  // (converges immediately; no effect needed).
  if (addresses && addresses.length > 0 && !selectedAddressId) {
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    setSelectedAddressId(def._id);
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // Nothing to check out.
  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
        <EmptyCart />
      </Container>
    );
  }

  const handlePlaceOrder = () => {
    submit({
      shippingAddressId: selectedAddressId,
      paymentMethod: method,
      couponCode: couponCode.trim() || undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4, maxWidth: 420 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {/* Step content */}
        <Grid size={{ xs: 12, md: 8 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 ? (
            <AddressStep selectedId={selectedAddressId} onSelect={setSelectedAddressId} />
          ) : (
            <PaymentStep
              method={method}
              onMethodChange={setMethod}
              couponCode={couponCode}
              onCouponChange={setCouponCode}
              note={note}
              onNoteChange={setNote}
            />
          )}

          {/* Step navigation */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              component={RouterLink}
              to={PATHS.cart}
              disabled={isSubmitting}
              sx={{ visibility: activeStep === 0 ? "visible" : "hidden" }}
            >
              Back to cart
            </Button>

            {activeStep === 0 ? (
              <Button
                variant="contained"
                disabled={!selectedAddressId}
                onClick={() => setActiveStep(1)}
              >
                Continue to payment
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button onClick={() => setActiveStep(0)} disabled={isSubmitting}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePlaceOrder}
                  loading={isSubmitting}
                >
                  {method === "stripe" ? "Pay with card" : "Place order"}
                </Button>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <OrderSummaryCard items={items} subtotal={subtotal} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
