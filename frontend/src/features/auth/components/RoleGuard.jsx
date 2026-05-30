import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const RoleGuard = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.name;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;
