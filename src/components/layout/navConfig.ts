import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// Primary navigation config
// ---------------------------------------------------------------------------
// Shared by the desktop Navbar links and the mobile Drawer so both stay in
// sync. Category-driven links arrive with the Product feature.
// ---------------------------------------------------------------------------

export interface NavItem {
  label: string;
  to: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", to: PATHS.home },
  { label: "Shop", to: PATHS.products },
];
