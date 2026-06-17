import { createTheme, type Theme } from "@mui/material/styles";
import { tokensByMode, type ThemeMode } from "./tokens";

// ---------------------------------------------------------------------------
// MUI theme factory
// ---------------------------------------------------------------------------
// Builds a fully-configured MUI theme for a given mode from the shared design
// tokens. Memoize the result per-mode (done in ThemeModeProvider) so the theme
// object is stable across renders.
// ---------------------------------------------------------------------------

/** Create a light or dark Oriventra MUI theme. */
export function createAppTheme(mode: ThemeMode): Theme {
  const t = tokensByMode[mode];

  return createTheme({
    // Enable CSS-layer cascade so MUI styles don't fight Tailwind utilities.
    cssVariables: false,
    palette: {
      mode,
      primary: {
        main: t.primary,
        light: t.primaryLight,
        dark: t.primaryDark,
        contrastText: t.primaryContrast,
      },
      secondary: {
        main: t.secondary,
        light: t.secondaryLight,
        dark: t.secondaryDark,
        contrastText: t.secondaryContrast,
      },
      background: {
        default: t.background,
        paper: t.paper,
      },
      text: {
        primary: t.textPrimary,
        secondary: t.textSecondary,
      },
      divider: t.divider,
      success: { main: t.success },
      warning: { main: t.warning },
      error: { main: t.error },
      info: { main: t.info },
    },

    shape: {
      borderRadius: 12,
    },

    typography: {
      fontFamily:
        '"Inter", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h1: { fontWeight: 700, fontSize: "3rem", letterSpacing: "-0.02em" },
      h2: { fontWeight: 700, fontSize: "2.25rem", letterSpacing: "-0.02em" },
      h3: { fontWeight: 600, fontSize: "1.75rem", letterSpacing: "-0.01em" },
      h4: { fontWeight: 600, fontSize: "1.375rem" },
      h5: { fontWeight: 600, fontSize: "1.125rem" },
      h6: { fontWeight: 600, fontSize: "1rem" },
      button: { fontWeight: 600, textTransform: "none" }, // no SHOUTING buttons
    },

    components: {
      // Buttons: comfortable radius, no uppercase, subtle hover lift.
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 10, paddingInline: 18 },
        },
      },
      // Cards/sheets pick up the paper token and a soft border in both modes.
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 14,
          }),
        },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined", size: "small" },
      },
      // Tooltips a touch larger for readability.
      MuiTooltip: {
        styleOverrides: {
          tooltip: { fontSize: "0.75rem" },
        },
      },
    },
  });
}
