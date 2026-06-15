import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

// ---------------------------------------------------------------------------
// QuantityPicker
// ---------------------------------------------------------------------------
// Compact stepper bounded by [1, max]. Controlled by the parent.
// ---------------------------------------------------------------------------

interface QuantityPickerProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

const QuantityPicker = ({ value, max, onChange }: QuantityPickerProps) => {
  const clamp = (n: number) => Math.max(1, Math.min(max, n));

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        border: (t) => `1px solid ${t.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <IconButton
        size="small"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <RemoveRoundedIcon fontSize="small" />
      </IconButton>
      <Typography sx={{ minWidth: 36, textAlign: "center", fontWeight: 600 }}>
        {value}
      </Typography>
      <IconButton
        size="small"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <AddRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default QuantityPicker;
