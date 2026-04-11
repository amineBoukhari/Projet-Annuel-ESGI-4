import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Components/Layouts/Layout";
import Stocks from "./Pages/Stocks";
import Login from "./Pages/Login";
import ProtectedRoute from "./Context/ProtectedRoute";
import { AuthProvider } from "./Context/authContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/stocks" element={<Stocks />} />
            </Route>
            </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
