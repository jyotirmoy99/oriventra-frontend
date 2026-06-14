import { createContext } from "react";
import type { ThemeMode } from "./tokens";

// ---------------------------------------------------------------------------
// ThemeModeContext
// ---------------------------------------------------------------------------
// Exposes the current color mode and the controls to change it. Kept in its own
// module (separate from the provider component) so consuming the context never
// drags the provider into a component file — this keeps React Fast Refresh and
// the react-refresh ESLint rule happy.
// ---------------------------------------------------------------------------

export interface ThemeModeContextValue {
  /** Active color mode. */
  mode: ThemeMode;
  /** Flip between light and dark. */
  toggleMode: () => void;
  /** Set an explicit mode. */
  setMode: (mode: ThemeMode) => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(
  null,
);
