import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectAuth } from "../features/auth/authSlice";
import FullScreenLoader from "../components/common/FullScreenLoader";
import { PATHS } from "./paths";

// ---------------------------------------------------------------------------
// PrivateRoute
// ---------------------------------------------------------------------------
// Guards routes that require any signed-in user. While the session is still
// being verified on boot (Feature 3), shows a loader rather than bouncing the
// user to /login prematurely. On failure, redirects to /login and remembers
// where they were headed (`state.from`) so login can send them back.
// ---------------------------------------------------------------------------

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAppSelector(selectAuth);
  const location = useLocation();

  if (isLoading) return <FullScreenLoader label="Checking your session…" />;

  if (!isAuthenticated) {
    return (
      <Navigate to={PATHS.login} state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
