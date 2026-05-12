import { Routes, Route } from "react-router";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Stocks from "../pages/Stocks";
import ChangePassword from "../pages/ChangePassword";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import Layout from "../layouts/Layout";
import Profile from "../Pages/Profile";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/my-profile" element={<Profile />} />
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/stocks" element={<Stocks />} />
        </Route>
      </Route>
    </Routes>
  );
};
