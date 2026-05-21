import { AppProvider } from "./providers/AppProvider";
import { AuthProvider } from "./features/auth/providers/AuthProvider";
import { RouterProvider } from "react-router/dom";
import { router } from "./routes/AppRoutes";


function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
