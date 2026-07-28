import { AppProvider } from "./providers/AppProvider";
import { RouterProvider } from "react-router/dom";
import { router } from "./routes/AppRoutes";

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
