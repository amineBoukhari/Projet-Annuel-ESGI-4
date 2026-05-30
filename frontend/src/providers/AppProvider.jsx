import { AuthProvider } from "../features/auth/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

export const AppProvider = ({ children }) => {
  return (
    <>
      <Toaster duration={4000} />
      <AuthProvider>{children}</AuthProvider>
    </>
  );
};
