import { createBrowserRouter } from "react-router";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Stocks from "../pages/Stocks";
import ChangePassword from "../pages/ChangePassword";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import Layout from "../layouts/Layout";
import Profile from "../Pages/Profile";
import User from "../Pages/User";
import UserDetails from "../Pages/UserDetails";
import CreateUser from "../Pages/CreateUser";
import EditUser from "../Pages/EditUser";
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
                element: <User />,
              },
              {
                path: "/users/create",
                element: <CreateUser />,
              },
              {
                path: "/users/:id",
                element: <UserDetails />,
              },
              {
                path: "/users/:id/edit",
                element: <EditUser />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
