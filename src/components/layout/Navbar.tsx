import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { useCartCount } from "../../hooks/useCart";
import { useCartDrawer } from "../../store/useCartDrawer";
import { useWishlistCount } from "../../hooks/useWishlist";
import { brandGradient } from "../../theme/tokens";
import { PATHS } from "../../routes/paths";
import { PRIMARY_NAV } from "./navConfig";
import ThemeToggleButton from "../common/ThemeToggleButton";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import MobileDrawer from "./MobileDrawer";

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
// Sticky, translucent (blurred) app bar. Layout adapts at the `md` breakpoint:
//   • md+  : logo · nav links · search · wishlist · cart · theme · account
//   • < md : hamburger (opens drawer) · logo · cart · theme · account
// Badges read counts from the cart/wishlist slices.
// ---------------------------------------------------------------------------

const Navbar = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();
  const openCartDrawer = useCartDrawer((s) => s.openDrawer);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          // Frosted-glass header that works in both themes.
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          color: "text.primary",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Toolbar sx={{ gap: { xs: 1, md: 2 }, px: { xs: 2, md: 3 } }}>
            {/* Mobile: hamburger */}
            {!isDesktop && (
              <IconButton
                edge="start"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open navigation menu"
                color="inherit"
              >
                <MenuRoundedIcon />
              </IconButton>
            )}

            {/* Brand wordmark */}
            <Typography
              variant="h5"
              component={RouterLink}
              to={PATHS.home}
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.02em",
                textDecoration: "none",
                background: brandGradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mr: { md: 1 },
                flexShrink: 0,
              }}
            >
              Oriventra
            </Typography>

            {/* Desktop: primary nav links */}
            {isDesktop && (
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {PRIMARY_NAV.map((item) => (
                  <Button
                    key={item.to}
                    component={RouterLink}
                    to={item.to}
                    color="inherit"
                    sx={{
                      fontWeight: pathname === item.to ? 700 : 500,
                      color:
                        pathname === item.to ? "primary.main" : "text.primary",
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Desktop: search grows to fill the middle */}
            {isDesktop && (
              <Box sx={{ flex: 1, maxWidth: 440, mx: "auto" }}>
                <SearchBar />
              </Box>
            )}

            {/* Push the action cluster to the right on mobile */}
            {!isDesktop && <Box sx={{ flex: 1 }} />}

            {/* Action cluster */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, md: 1 } }}>
              {isDesktop && (
                <Tooltip title="Wishlist">
                  <IconButton
                    component={RouterLink}
                    to={PATHS.wishlist}
                    color="inherit"
                    aria-label={`Wishlist, ${wishlistCount} items`}
                  >
                    <Badge badgeContent={wishlistCount} color="secondary">
                      <FavoriteBorderRoundedIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Cart">
                <IconButton
                  onClick={openCartDrawer}
                  color="inherit"
                  aria-label={`Cart, ${cartCount} items`}
                >
                  <Badge badgeContent={cartCount} color="primary">
                    <ShoppingCartRoundedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <ThemeToggleButton />
              <UserMenu />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile navigation drawer (rendered once; toggled by the hamburger) */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
