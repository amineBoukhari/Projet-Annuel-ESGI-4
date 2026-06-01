import { createBrowserRouter } from "react-router";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Stocks from "../pages/Stocks";
import Users from "../pages/Users";
import Invoices from "../pages/Invoices";
import InvoiceForm from "../pages/InvoiceForm";
import InvoiceDetail from "../pages/InvoiceDetail";
import QuickInvoice from "../pages/QuickInvoice";
import Expenses from "../pages/Expenses";
import PurchaseOrders from "../pages/PurchaseOrders";
import PurchaseOrderForm from "../pages/PurchaseOrderForm";
import GoodsReceipt from "../pages/GoodsReceipt";
import GoodsReceipts from "../pages/GoodsReceipts";
import SupplierInvoices from "../pages/SupplierInvoices";
import SupplierInvoiceForm from "../pages/SupplierInvoiceForm";
import ChangePassword from "../pages/ChangePassword";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import RoleGuard from "../features/auth/components/RoleGuard";
import Permissions from "../pages/Permissions";
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
                path: "/permissions",
                element: (
                  <RoleGuard allowedRoles={["Admin"]}>
                    <Permissions />
                  </RoleGuard>
                ),
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
              {
                path: "/expenses",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <Expenses />
                  </RoleGuard>
                ),
              },
              {
                path: "/purchase-orders",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <PurchaseOrders />
                  </RoleGuard>
                ),
              },
              {
                path: "/purchase-orders/new",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <PurchaseOrderForm />
                  </RoleGuard>
                ),
              },
              {
                path: "/purchase-orders/:id",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <div>Detail PO (à venir)</div>
                  </RoleGuard>
                ),
              },
              {
                path: "/goods-receipts",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <GoodsReceipts />
                  </RoleGuard>
                ),
              },
              {
                path: "/goods-receipts/:id",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <div>Detail Receipt (à venir)</div>
                  </RoleGuard>
                ),
              },
              {
                path: "/goods-receipt/new",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <GoodsReceipt />
                  </RoleGuard>
                ),
              },
              {
                path: "/supplier-invoices",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <SupplierInvoices />
                  </RoleGuard>
                ),
              },
              {
                path: "/supplier-invoices/new",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <SupplierInvoiceForm />
                  </RoleGuard>
                ),
              },
              {
                path: "/supplier-invoices/:id",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <div>Detail Supplier Invoice (à venir)</div>
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
