import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./authContext";

const ProtectedRoute = () => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const { mustChangePassword } = JSON.parse(atob(token.split(".")[1]));

  if (location.pathname !== "/change-password" && mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  if (location.pathname === "/change-password" && !mustChangePassword) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
