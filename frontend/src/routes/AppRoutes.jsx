import { createBrowserRouter } from "react-router";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Stocks from "../pages/Stocks";
import Users from "../pages/Users";
import Invoices from "../pages/Invoices";
import InvoiceForm from "../pages/InvoiceForm";
import InvoiceDetail from "../pages/InvoiceDetail";
import QuickInvoice from "../pages/QuickInvoice";
import ChangePassword from "../pages/ChangePassword";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import RoleGuard from "../features/auth/components/RoleGuard";
import Layout from "../layouts/Layout";
import Profile from "../pages/Profile";
import GlobalError from "../pages/errors/GlobalError";

export const router = createBrowserRouter([
  {
    errorElement: <GlobalError />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/change-password",
            element: <ChangePassword />,
          },

          {
            element: <Layout />,
            children: [
              {
                path: "/",
                element: <Dashboard />,
              },
              {
                path: "/stocks",
                element: <Stocks />,
              },
              {
                path: "/my-profile",
                element: <Profile />,
              },
              {
                path: "/users",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <Users />
                  </RoleGuard>
                ),
              },
              {
                path: "/invoices",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <Invoices />
                  </RoleGuard>
                ),
              },
              {
                path: "/invoices/new",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <InvoiceForm />
                  </RoleGuard>
                ),
              },
              {
                path: "/invoices/edit/:id",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <InvoiceForm />
                  </RoleGuard>
                ),
              },
              {
                path: "/invoices/:id",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <InvoiceDetail />
                  </RoleGuard>
                ),
              },
              {
                path: "/quick-invoice",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <QuickInvoice />
                  </RoleGuard>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);
