import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "./createAppTheme";
import { ThemeModeContext } from "./ThemeModeContext";
import {
  THEME_STORAGE_KEY,
  tokensByMode,
  type ColorTokens,
  type ThemeMode,
} from "./tokens";

// ---------------------------------------------------------------------------
// ThemeModeProvider
// ---------------------------------------------------------------------------
// Owns the color-mode state and wires it into three places at once:
//   1. MUI  — via <MuiThemeProvider> + <CssBaseline>
//   2. Tailwind/CSS — by writing each token as a CSS variable on <html> and
//      setting `data-theme` + the `dark` class (Tailwind `darkMode: "class"`)
//   3. localStorage — so the choice survives reloads
// ---------------------------------------------------------------------------

/** Read the initial mode: saved preference first, then OS preference. */
function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "light";

  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  return prefersDark ? "dark" : "light";
}

/** Map our token names to CSS custom properties consumed by Tailwind. */
function applyCssVariables(mode: ThemeMode, tokens: ColorTokens): void {
  const root = document.documentElement;

  // Expose every token as `--color-*` for the Tailwind config to reference.
  const entries: Record<string, string> = {
    "--color-primary": tokens.primary,
    "--color-primary-light": tokens.primaryLight,
    "--color-primary-dark": tokens.primaryDark,
    "--color-secondary": tokens.secondary,
    "--color-background": tokens.background,
    "--color-paper": tokens.paper,
    "--color-foreground": tokens.textPrimary,
    "--color-muted": tokens.textSecondary,
    "--color-border": tokens.divider,
  };
  for (const [key, value] of Object.entries(entries)) {
    root.style.setProperty(key, value);
  }

  // `data-theme` for CSS selectors; `dark` class for Tailwind class strategy.
  root.setAttribute("data-theme", mode);
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
}

const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);

  // Build (and cache) the MUI theme for the active mode.
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  // Persist + push CSS variables whenever the mode changes.
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    applyCssVariables(mode, tokensByMode[mode]);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => setModeState(next), []);
  const toggleMode = useCallback(
    () => setModeState((prev) => (prev === "light" ? "dark" : "light")),
    [],
  );

  // Stable context value — only changes when the mode actually changes.
  const value = useMemo(
    () => ({ mode, toggleMode, setMode }),
    [mode, toggleMode, setMode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline applies MUI's reset + background/text colors from theme */}
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeProvider;
