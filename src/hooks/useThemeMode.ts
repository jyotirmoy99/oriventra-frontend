import { useContext } from "react";
import {
  ThemeModeContext,
  type ThemeModeContextValue,
} from "../theme/ThemeModeContext";

// ---------------------------------------------------------------------------
// useThemeMode
// ---------------------------------------------------------------------------
// Typed accessor for the color-mode context. Throws if used outside the
// <ThemeModeProvider> so misuse fails loudly during development.
// ---------------------------------------------------------------------------

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return ctx;
}
