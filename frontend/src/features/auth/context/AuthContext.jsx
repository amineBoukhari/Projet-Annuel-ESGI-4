import { createContext, useState } from "react";
import { storage } from "../../../utils/storage";

const AuthContext = createContext(null);
 
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => storage.getToken());

  const setAuth = (newToken) => {
    storage.setToken(newToken);
    setToken(newToken);
  };

  const logout = () => {
    storage.clearToken();
    setToken(null)
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
