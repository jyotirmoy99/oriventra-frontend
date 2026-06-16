import { useContext } from "react";
import {
  SnackbarContext,
  type SnackbarContextValue,
} from "../components/common/SnackbarContext";

// ---------------------------------------------------------------------------
// useSnackbar — typed access to the global toast API.
// ---------------------------------------------------------------------------

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return ctx;
}
