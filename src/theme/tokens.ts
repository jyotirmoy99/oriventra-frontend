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
  primaryContrast: string; // text/icon color on a primary-filled surface
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  secondaryContrast: string; // text/icon color on a secondary-filled surface

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
 * Light scheme — "Ink + Indigo": a clean off-white canvas, a cool indigo brand
 * accent for CTAs/links, and a near-black "ink" secondary for premium,
 * minimalist tags/badges. Cool, restrained, modern-DTC.
 */
export const lightTokens: ColorTokens = {
  primary: "#4F46E5", // indigo-600 — cool brand accent
  primaryLight: "#6366F1",
  primaryDark: "#4338CA",
  primaryContrast: "#FFFFFF",
  secondary: "#0F172A", // slate-900 ink — minimalist black tags/badges
  secondaryLight: "#1E293B",
  secondaryDark: "#020617",
  secondaryContrast: "#FFFFFF",

  background: "#FAFAFB",
  paper: "#FFFFFF",

  textPrimary: "#0F172A", // slate-900
  textSecondary: "#64748B", // slate-500

  divider: "#E9EAEE",
  success: "#16A34A",
  warning: "#D97706",
  error: "#DC2626",
  info: "#0EA5E9", // sky — cool secondary accent
};

/**
 * Dark scheme — deep cool-neutral canvas. Indigo stays the accent (lifted for
 * contrast); the "ink" secondary inverts to a light slate so tags read on dark.
 */
export const darkTokens: ColorTokens = {
  primary: "#6366F1", // indigo-500 — legible on dark
  primaryLight: "#818CF8",
  primaryDark: "#4F46E5",
  primaryContrast: "#FFFFFF",
  secondary: "#E2E8F0", // slate-200 — light "ink" for dark surfaces
  secondaryLight: "#F1F5F9",
  secondaryDark: "#CBD5E1",
  secondaryContrast: "#0F172A", // dark text on the light secondary

  background: "#0B0D12",
  paper: "#14171F",

  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",

  divider: "#232732",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#F87171",
  info: "#38BDF8",
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
  "linear-gradient(135deg, #4F46E5 0%, #6366F1 45%, #0EA5E9 100%)";

/** localStorage key for the persisted theme preference. */
export const THEME_STORAGE_KEY = "oriventra-theme-mode";
