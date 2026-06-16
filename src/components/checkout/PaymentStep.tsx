import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import type { PaymentMethod } from "../../types/order.types";

// ---------------------------------------------------------------------------
// PaymentStep
// ---------------------------------------------------------------------------
// Choose a payment method (Stripe card or Cash on Delivery) and optionally add a
// coupon code / order note. Fully controlled by the parent.
// ---------------------------------------------------------------------------

interface PaymentStepProps {
  method: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  couponCode: string;
  onCouponChange: (code: string) => void;
  note: string;
  onNoteChange: (note: string) => void;
}

const MethodCard = ({
  icon: Icon,
  title,
  subtitle,
  selected,
  onSelect,
}: {
  icon: SvgIconComponent;
  title: string;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
}) => (
  <Paper
    variant="outlined"
    onClick={onSelect}
    sx={{
      p: 2,
      borderRadius: 2,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      borderColor: selected ? "primary.main" : "divider",
      borderWidth: selected ? 2 : 1,
    }}
  >
    <Radio checked={selected} size="small" sx={{ p: 0 }} />
    <Icon color={selected ? "primary" : "action"} />
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  </Paper>
);

const PaymentStep = ({
  method,
  onMethodChange,
  couponCode,
  onCouponChange,
  note,
  onNoteChange,
}: PaymentStepProps) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Payment method
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
        <MethodCard
          icon={CreditCardRoundedIcon}
          title="Card (Stripe)"
          subtitle="Pay securely with a card via Stripe Checkout"
          selected={method === "stripe"}
          onSelect={() => onMethodChange("stripe")}
        />
        <MethodCard
          icon={LocalShippingRoundedIcon}
          title="Cash on Delivery"
          subtitle="Pay in cash when your order arrives"
          selected={method === "cod"}
          onSelect={() => onMethodChange("cod")}
        />
      </Box>

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Coupon code (optional)
      </Typography>
      <TextField
        size="small"
        placeholder="Enter code"
        value={couponCode}
        onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
        sx={{ mb: 3, maxWidth: 280 }}
      />

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Order note (optional)
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={2}
        placeholder="Delivery instructions, etc."
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        slotProps={{ htmlInput: { maxLength: 500 } }}
      />
    </Box>
  );
};

export default PaymentStep;
