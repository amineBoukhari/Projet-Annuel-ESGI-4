import { Navigate, Outlet } from "react-router";
import { useAuth } from "./authContext";

const ProtectedRoute = () => {
    const { user } = useAuth();

    if (!user) {
      return <Navigate to="/login" replace />;
    }

  return <Outlet />;
};

export default ProtectedRoute;
