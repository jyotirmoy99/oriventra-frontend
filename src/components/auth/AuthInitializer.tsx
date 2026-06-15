import { useEffect, type ReactNode } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { clearAuth, restoreSession } from "../../features/auth/authSlice";
import { setUnauthorizedHandler } from "../../utils/authEvents";

// ---------------------------------------------------------------------------
// AuthInitializer
// ---------------------------------------------------------------------------
// Runs once at app startup (mounted inside the providers, above the router):
//   1. Restores any existing session (GET /users/me, with silent token refresh).
//   2. Registers the global "unauthorized" handler so a failed refresh anywhere
//      in the app clears auth state (route guards then redirect as needed).
// Renders its children unconditionally — public pages shouldn't wait on the
// session probe; guards handle the protected ones while `isLoading` is true.
// ---------------------------------------------------------------------------

const AuthInitializer = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Kick off the boot-time session restore.
    dispatch(restoreSession());

    // When the Axios interceptor can't refresh, clear auth.
    setUnauthorizedHandler(() => dispatch(clearAuth()));
    return () => setUnauthorizedHandler(null);
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;
