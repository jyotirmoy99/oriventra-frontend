import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useCart } from "../../hooks/useCart";
import { useCartDrawer } from "../../store/useCartDrawer";
import { formatCurrency } from "../../utils/formatCurrency";
import { PATHS } from "../../routes/paths";
import CartItemRow from "./CartItemRow";
import EmptyCart from "./EmptyCart";

// ---------------------------------------------------------------------------
// CartDrawer (mini-cart)
// ---------------------------------------------------------------------------
// Right-anchored slide-over opened from the Navbar cart icon. Lists items with
// live quantity controls, shows the subtotal, and links to the full cart /
// checkout. Mounted once in RootLayout.
// ---------------------------------------------------------------------------

const CartDrawer = () => {
  const open = useCartDrawer((s) => s.open);
  const closeDrawer = useCartDrawer((s) => s.closeDrawer);
  const navigate = useNavigate();
  const { items, subtotal, totalItems, isLoading, updateQuantity, removeItem } = useCart();

  const go = (path: string) => {
    closeDrawer();
    navigate(path);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={closeDrawer}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: 400 }, maxWidth: "100%" } } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Your cart {totalItems > 0 && `(${totalItems})`}
          </Typography>
          <IconButton onClick={closeDrawer} aria-label="Close cart">
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Body */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : items.length === 0 ? (
            <EmptyCart onAction={closeDrawer} />
          ) : (
            <Stack divider={<Divider />}>
              {items.map((line) => (
                <CartItemRow
                  key={line.itemId}
                  line={line}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  compact
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1.5 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography sx={{ fontWeight: 700 }}>{formatCurrency(subtotal)}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                Shipping &amp; taxes calculated at checkout.
              </Typography>
              <Stack spacing={1}>
                <Button variant="contained" size="large" onClick={() => go(PATHS.checkout)}>
                  Checkout
                </Button>
                <Button variant="outlined" onClick={() => go(PATHS.cart)}>
                  View cart
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
