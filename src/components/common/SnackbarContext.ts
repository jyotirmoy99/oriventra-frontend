import { createContext } from "react";
import type { AlertColor } from "@mui/material/Alert";

// ---------------------------------------------------------------------------
// SnackbarContext
// ---------------------------------------------------------------------------
// Tiny global toast API. `notify(message, severity?)` shows a transient alert.
// Context lives in its own module so the hook and provider can share it without
// tripping the react-refresh rule.
// ---------------------------------------------------------------------------

export interface SnackbarContextValue {
  notify: (message: string, severity?: AlertColor) => void;
}

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);
