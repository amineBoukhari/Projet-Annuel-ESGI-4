import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

const SUBSCRIPTION_EXEMPT_PATHS = ["/subscription", "/subscription/success"];

const ProtectedRoute = () => {
  const { user, isSubscriptionActive } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname !== "/change-password" && user.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  if (location.pathname === "/change-password" && !user.mustChangePassword) {
    return <Navigate to="/" replace />;
  }

  if (!isSubscriptionActive && !SUBSCRIPTION_EXEMPT_PATHS.includes(location.pathname)) {
    return <Navigate to="/subscription" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
