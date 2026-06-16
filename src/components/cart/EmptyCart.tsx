import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// EmptyCart — shared empty state for the drawer and the cart page.
// ---------------------------------------------------------------------------

const EmptyCart = ({ onAction }: { onAction?: () => void }) => (
  <Box sx={{ textAlign: "center", py: 6, px: 2 }}>
    <ShoppingBagRoundedIcon sx={{ fontSize: 56, color: "text.disabled", mb: 1 }} />
    <Typography variant="h6" sx={{ fontWeight: 700 }}>
      Your cart is empty
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>
      Looks like you haven’t added anything yet.
    </Typography>
    <Button component={RouterLink} to={PATHS.products} variant="contained" onClick={onAction}>
      Start shopping
    </Button>
  </Box>
);

export default EmptyCart;
