import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectAuth } from "../features/auth/authSlice";
import FullScreenLoader from "../components/common/FullScreenLoader";
import { PATHS } from "./paths";

// ---------------------------------------------------------------------------
// AdminRoute
// ---------------------------------------------------------------------------
// Guards the admin area. Requires a signed-in user whose role is "admin".
// Non-admins who are signed in are sent home (not to login); anonymous users
// are sent to login. Mirrors PrivateRoute's boot-loading behavior.
// ---------------------------------------------------------------------------

const AdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useAppSelector(selectAuth);
  const location = useLocation();

  if (isLoading) return <FullScreenLoader label="Checking your session…" />;

  if (!isAuthenticated) {
    return <Navigate to={PATHS.login} state={{ from: location }} replace />;
  }

  // Signed in but not an admin — deny by sending home.
  if (user?.role !== "admin") {
    return <Navigate to={PATHS.home} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
