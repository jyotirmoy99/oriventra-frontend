import { Component, type ErrorInfo, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// ---------------------------------------------------------------------------
// ErrorBoundary
// ---------------------------------------------------------------------------
// Class component (React requires a class for error boundaries) that catches
// render-time errors in its subtree and shows a recoverable fallback instead of
// a blank white screen. Wraps major route sections (rule (n)). React Router's
// own data-loading errors are handled separately by RouteError.
// ---------------------------------------------------------------------------

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback; falls back to the default UI below. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Flip to the fallback UI on the next render.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Hook point for an error-reporting service (Sentry, etc.) later.
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 2,
          px: 3,
        }}
      >
        <Typography variant="h4">Something went wrong</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480 }}>
          {this.state.error?.message ??
            "An unexpected error occurred while rendering this section."}
        </Typography>
        <Button variant="contained" onClick={this.handleReset}>
          Try again
        </Button>
      </Box>
    );
  }
}

export default ErrorBoundary;
