import { useCallback } from "react";
import { useState } from "react";
import { authService } from "../../../services/authService";
import { useEffect } from "react";
import { useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAndSetUser = useCallback(async () => {
    try {
      setError(null);
      const userData = await authService.fetchUser();
      setUser(userData);
      return userData;
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        setUser(null);
      }
      setError(err);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchAndSetUser().finally(() => setIsLoading(false));
  }, [fetchAndSetUser]);

  const login = useCallback((userData) => {
    setUser(userData);
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    } finally {
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(() => fetchAndSetUser(), [fetchAndSetUser]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, error, login, logout, refreshUser],
  );

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <span className="animate-pulse text-muted-foreground">
          Chargement...
        </span>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
