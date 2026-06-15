import { useState, type MouseEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectAuth } from "../../features/auth/authSlice";
import { useLogout } from "../../hooks/useAuthActions";
import { isAdminRole } from "../../types";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// UserMenu
// ---------------------------------------------------------------------------
// Right-hand account control. Signed out → Login / Register buttons. Signed in
// → avatar that opens a dropdown (Profile, Orders, admin Dashboard if admin,
// Logout). Logout clears the auth slice + token and returns home.
// ---------------------------------------------------------------------------

const UserMenu = () => {
  const { isAuthenticated, user } = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const logout = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    // Clears the server cookies; the hook clears local auth state + query cache.
    logout.mutate(undefined, { onSuccess: () => navigate(PATHS.home) });
  };

  // --- Signed out: show auth actions ---------------------------------------
  if (!isAuthenticated) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          component={RouterLink}
          to={PATHS.login}
          color="inherit"
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
        >
          Login
        </Button>
        <Button component={RouterLink} to={PATHS.register} variant="contained">
          Sign up
        </Button>
      </Box>
    );
  }

  // --- Signed in: avatar + dropdown ----------------------------------------
  return (
    <>
      <Tooltip title="Account">
        <IconButton onClick={handleOpen} size="small" aria-label="Open account menu">
          <Avatar
            src={user?.avatar?.url}
            alt={user?.name}
            sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: 15 }}
          >
            {/* Initial fallback when there's no avatar image */}
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 220 } } }}
      >
        {/* Identity header */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user?.email}
          </Typography>
        </Box>
        <Divider />

        <MenuItem component={RouterLink} to={PATHS.profile}>
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem component={RouterLink} to={PATHS.orders}>
          <ListItemIcon>
            <ReceiptLongRoundedIcon fontSize="small" />
          </ListItemIcon>
          My Orders
        </MenuItem>

        {isAdminRole(user?.role) && (
          <MenuItem component={RouterLink} to={PATHS.admin}>
            <ListItemIcon>
              <DashboardRoundedIcon fontSize="small" />
            </ListItemIcon>
            Admin Dashboard
          </MenuItem>
        )}

        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
