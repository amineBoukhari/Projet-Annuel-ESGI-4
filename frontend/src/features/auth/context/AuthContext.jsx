import { createContext, useEffect, useState } from "react";
import { storage } from "../../../utils/storage";
import { auth } from "../../../utils/auth";

const AuthContext = createContext(null);
 
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => storage.getToken());
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // On attend (await) la résolution de la promesse ici !
        const userData = await auth.fetchUser(token);
        setUser(userData);
      } catch (error) {
        console.error("Erreur de récupération utilisateur", error);
        storage.clearToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const setAuth = (newToken) => {
    storage.setToken(newToken);
    setToken(newToken);
  };

  const logout = () => {
    storage.clearToken();
    setToken(null)
  };

  const isAuthenticated = !!token;

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Chargement de l'application...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, setAuth, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
