import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("user_token");
    return stored;
  });

  const setAuth = (newToken) => {
    localStorage.setItem("user_token", JSON.stringify(newToken));
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("user_token");
    setToken(null);
    toast.success('Successfully disconnected')
  };

  return (
    <AuthContext.Provider value={{ token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
