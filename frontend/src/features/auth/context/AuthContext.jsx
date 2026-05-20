import { createContext, useEffect, useState } from "react";
import { authService } from "../../../services/authService";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const userData = await authService.fetchUser();
        setUser(userData);
      } catch (error) {
        console.error("Session expirée ou non connecté", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginSuccess = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Chargement de l'application...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loginSuccess, logout, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
