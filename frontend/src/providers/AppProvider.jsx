import { AuthProvider } from "../features/auth/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const AppProvider = ({ children }) => {
    return (
      <>
        <Toaster duration={4000} />
        <AuthProvider>{children}</AuthProvider>
      </>
    );
};
