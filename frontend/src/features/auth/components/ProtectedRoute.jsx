import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";;

const ProtectedRoute = () => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname !== "/change-password" && user.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  if (location.pathname === "/change-password" && !user.mustChangePassword) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
