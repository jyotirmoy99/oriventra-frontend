import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import ErrorBoundary from "../common/ErrorBoundary";
import AnimatedOutlet from "../common/AnimatedOutlet";
import ThemeToggleButton from "../common/ThemeToggleButton";
import UserMenu from "./UserMenu";
import { brandGradient } from "../../theme/tokens";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// AdminLayout
// ---------------------------------------------------------------------------
// Dashboard shell for the admin area: fixed side navigation + top bar. The
// drawer is permanent on md+ and a temporary overlay on mobile (toggled by the
// top-bar hamburger). Admin pages (Feature 11) render through the outlet.
// ---------------------------------------------------------------------------

const DRAWER_WIDTH = 248;

interface AdminNavItem {
  label: string;
  to: string;
  icon: SvgIconComponent;
  /** Exact-match for the index route so it isn't always "active". */
  end?: boolean;
}

const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", to: PATHS.admin, icon: DashboardRoundedIcon, end: true },
  { label: "Products", to: PATHS.adminProducts, icon: Inventory2RoundedIcon },
  { label: "Orders", to: PATHS.adminOrders, icon: ReceiptLongRoundedIcon },
  { label: "Users", to: PATHS.adminUsers, icon: GroupRoundedIcon },
];

const AdminLayout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: AdminNavItem) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to);

  // Sidebar content shared by the permanent and temporary drawers.
  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar sx={{ px: 3 }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to={PATHS.admin}
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
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          Admin
        </Typography>
      </Toolbar>

      <List sx={{ px: 1.5, flex: 1 }}>
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <ListItemButton
              key={item.to}
              component={RouterLink}
              to={item.to}
              selected={isActive(item)}
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      {/* Quick exit back to the public storefront */}
      <List sx={{ px: 1.5, pb: 2 }}>
        <ListItemButton
          component={RouterLink}
          to={PATHS.home}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <StorefrontRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Back to store" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100svh", bgcolor: "background.default" }}>
      {/* Top bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {!isDesktop && (
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin menu"
              color="inherit"
            >
              <MenuRoundedIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
            Dashboard
          </Typography>
          <Tooltip title="View store">
            <IconButton component={RouterLink} to={PATHS.home} color="inherit">
              <StorefrontRoundedIcon />
            </IconButton>
          </Tooltip>
          <ThemeToggleButton />
          <UserMenu />
        </Toolbar>
      </AppBar>

      {/* Navigation: permanent on desktop, temporary overlay on mobile */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {isDesktop ? (
          <Drawer
            variant="permanent"
            open
            slotProps={{
              paper: {
                sx: {
                  width: DRAWER_WIDTH,
                  borderRight: `1px solid ${theme.palette.divider}`,
                  bgcolor: "background.paper",
                },
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            slotProps={{ paper: { sx: { width: DRAWER_WIDTH } } }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar /> {/* spacer for the fixed AppBar */}
        <Box sx={{ p: { xs: 2, md: 3 }, flex: 1 }}>
          <ErrorBoundary>
            <AnimatedOutlet />
          </ErrorBoundary>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
