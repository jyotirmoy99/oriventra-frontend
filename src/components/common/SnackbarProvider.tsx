import { useCallback, useMemo, useState, type ReactNode } from "react";
import Alert, { type AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { SnackbarContext } from "./SnackbarContext";

// ---------------------------------------------------------------------------
// SnackbarProvider
// ---------------------------------------------------------------------------
// Renders a single app-wide MUI Snackbar and exposes `notify()` via context.
// Kept deliberately simple: the latest message wins (auto-hides after 3s). If
// richer queuing is needed later, swap the internals — the `notify` API stays.
// ---------------------------------------------------------------------------

interface SnackState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snack, setSnack] = useState<SnackState>({
    open: false,
    message: "",
    severity: "success",
  });

  const notify = useCallback(
    (message: string, severity: AlertColor = "success") => {
      setSnack({ open: true, message, severity });
    },
    [],
  );

  const handleClose = useCallback(
    (_e?: unknown, reason?: string) => {
      // Don't dismiss on click-away — let it time out so toasts aren't missed.
      if (reason === "clickaway") return;
      setSnack((prev) => ({ ...prev, open: false }));
    },
    [],
  );

  // Stable context value — `notify` never changes identity.
  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
