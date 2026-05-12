import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { decodeTokenPayload } from "../../../utils/decodeToken";

const ProtectedRoute = () => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const { mustChangePassword } = decodeTokenPayload(token);

  if (location.pathname !== "/change-password" && mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  if (location.pathname === "/change-password" && !mustChangePassword) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
