import { createBrowserRouter } from "react-router";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Stocks from "../pages/Stocks";
import Ingredients from "../pages/Ingredients";
import IngredientForm from "../pages/IngredientForm";
import IngredientDetail from "../pages/IngredientDetail";
import IngredientMovements from "../pages/IngredientMovements";
import LowStockIngredients from "../pages/LowStockIngredients";
import Recipes from "../pages/Recipes";
import RecipeForm from "../pages/RecipeForm";
import RecipeDetail from "../pages/RecipeDetail";
import RecipeCook from "../pages/RecipeCook";
import Users from "../pages/Users";
import Invoices from "../pages/Invoices";
import InvoiceForm from "../pages/InvoiceForm";
import InvoiceDetail from "../pages/InvoiceDetail";
import QuickInvoice from "../pages/QuickInvoice";
import Expenses from "../pages/Expenses";
import ChangePassword from "../pages/ChangePassword";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import RoleGuard from "../features/auth/components/RoleGuard";
import Layout from "../layouts/Layout";
import Restaurants from "../pages/Restaurants";
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
                path: "/restaurants",
                element: (
                  <RoleGuard allowedRoles={["Admin"]}>
                    <Restaurants />
                  </RoleGuard>
                ),
              },
              {
                path: "/stocks",
                element: <Stocks />,
              },
              {
                path: "/stocks/ingredients",
                element: <Ingredients />,
              },
              {
                path: "/stocks/ingredients/new",
                element: <IngredientForm />,
              },
              {
                path: "/stocks/ingredients/:id",
                element: <IngredientDetail />,
              },
              {
                path: "/stocks/ingredients/:id/edit",
                element: <IngredientForm />,
              },
              {
                path: "/stocks/ingredients/:id/movements",
                element: <IngredientMovements />,
              },
              {
                path: "/stocks/low-stock",
                element: <LowStockIngredients />,
              },
              {
                path: "/recipes",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <Recipes />
                  </RoleGuard>
                ),
              },
              {
                path: "/recipes/new",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <RecipeForm />
                  </RoleGuard>
                ),
              },
              {
                path: "/recipes/:id",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <RecipeDetail />
                  </RoleGuard>
                ),
              },
              {
                path: "/recipes/:id/edit",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager"]}>
                    <RecipeForm />
                  </RoleGuard>
                ),
              },
              {
                path: "/recipes/:id/cook",
                element: (
                  <RoleGuard allowedRoles={["Admin", "Owner", "Manager", "Employee"]}>
                    <RecipeCook />
                  </RoleGuard>
                ),
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
            ],
          },
        ],
      },
    ],
  },
]);
