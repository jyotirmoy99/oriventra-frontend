import { Link as RouterLink, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { PRIMARY_NAV } from "./navConfig";
import { PATHS } from "../../routes/paths";
import { brandGradient } from "../../theme/tokens";
import SearchBar from "./SearchBar";

// ---------------------------------------------------------------------------
// MobileDrawer
// ---------------------------------------------------------------------------
// Right-anchored navigation drawer for small screens. Holds the brand, search,
// primary links, and quick links to wishlist/cart. Closes on any navigation.
// ---------------------------------------------------------------------------

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ open, onClose }: MobileDrawerProps) => {
  const { pathname } = useLocation();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 290, maxWidth: "85vw" } } }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header: brand + close */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            component={RouterLink}
            to={PATHS.home}
            onClick={onClose}
            sx={{
              fontWeight: 800,
              textDecoration: "none",
              background: brandGradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Oriventra
          </Typography>
          <IconButton onClick={onClose} aria-label="Close menu">
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {/* Search closes the drawer once it navigates */}
        <SearchBar onSubmitted={onClose} />
      </Box>

      <Divider />

      <List>
        {PRIMARY_NAV.map((item) => (
          <ListItemButton
            key={item.to}
            component={RouterLink}
            to={item.to}
            onClick={onClose}
            selected={pathname === item.to}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <List>
        <ListItemButton
          component={RouterLink}
          to={PATHS.wishlist}
          onClick={onClose}
        >
          <ListItemIcon>
            <FavoriteBorderRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Wishlist" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to={PATHS.cart} onClick={onClose}>
          <ListItemIcon>
            <ShoppingCartRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cart" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default MobileDrawer;
