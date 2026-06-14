// ---------------------------------------------------------------------------
// Oriventra design tokens
// ---------------------------------------------------------------------------
// Single source of truth for brand colors. These tokens feed BOTH the MUI
// theme (createAppTheme.ts) and the Tailwind/CSS-variable layer (emitted as
// CSS custom properties in ThemeModeProvider). Keeping them here means MUI's
// `sx`/`theme.palette` and Tailwind's `bg-background`/`text-primary` always
// resolve to the exact same color in either light or dark mode.
// ---------------------------------------------------------------------------

/** The two supported color schemes. */
export type ThemeMode = "light" | "dark";

/** Shape of a single color scheme's token set. */
export interface ColorTokens {
  // Brand
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Surfaces
  background: string; // app canvas
  paper: string; // cards, sheets, menus

  // Text
  textPrimary: string;
  textSecondary: string;

  // Lines & feedback
  divider: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

/**
 * Light scheme — clean white canvas with the Oriventra violet brand accent
 * and a pink secondary for highlights/badges.
 */
export const lightTokens: ColorTokens = {
  primary: "#7C3AED", // violet-600 — Oriventra brand
  primaryLight: "#9D5CF5",
  primaryDark: "#5B21B6",
  secondary: "#EC4899", // pink-500 — accent for badges/sale tags
  secondaryLight: "#F472B6",
  secondaryDark: "#BE185D",

  background: "#F7F7FB",
  paper: "#FFFFFF",

  textPrimary: "#1A1523",
  textSecondary: "#6B6375",

  divider: "#E5E4E7",
  success: "#16A34A",
  warning: "#D97706",
  error: "#DC2626",
  info: "#2563EB",
};

/**
 * Dark scheme — deep neutral canvas with a lighter violet so the brand stays
 * legible on dark surfaces.
 */
export const darkTokens: ColorTokens = {
  primary: "#A78BFA", // violet-400 — lifted for dark contrast
  primaryLight: "#C4B5FD",
  primaryDark: "#7C3AED",
  secondary: "#F472B6",
  secondaryLight: "#F9A8D4",
  secondaryDark: "#EC4899",

  background: "#0F1116",
  paper: "#16181F",

  textPrimary: "#F3F4F6",
  textSecondary: "#9CA3AF",

  divider: "#2E303A",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#F87171",
  info: "#60A5FA",
};

/** Lookup helper so callers can resolve tokens by mode. */
export const tokensByMode: Record<ThemeMode, ColorTokens> = {
  light: lightTokens,
  dark: darkTokens,
};

/**
 * Brand gradient used by hero/promo sections. Exported as a plain string so it
 * can be dropped into `sx={{ background: brandGradient }}` without theme
 * augmentation.
 */
export const brandGradient =
  "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)";

/** localStorage key for the persisted theme preference. */
export const THEME_STORAGE_KEY = "oriventra-theme-mode";
