import { useCallback } from "react";
import { useState } from "react";
import { authService } from "../../../services/authService";
import subscriptionService from "../../../services/subscriptionService";
import { useEffect } from "react";
import { useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false);

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

  const fetchSubscription = useCallback(async () => {
    setIsSubscriptionLoading(true);
    try {
      const data = await subscriptionService.fetchSubscriptionStatus();
      setSubscription(data);
    } catch {
      setSubscription(null);
    } finally {
      setIsSubscriptionLoading(false);
      setHasCheckedSubscription(true);
    }
  }, []);

  useEffect(() => {
    fetchAndSetUser()
      .then((userData) => (userData ? fetchSubscription() : setIsSubscriptionLoading(false)))
      .finally(() => setIsLoading(false));
  }, [fetchAndSetUser, fetchSubscription]);

  const login = useCallback(
    async (userData) => {
      setUser(userData);
      setError(null);
      await fetchSubscription();
    },
    [fetchSubscription],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    } finally {
      setUser(null);
      setSubscription(null);
    }
  }, []);

  const refreshUser = useCallback(() => fetchAndSetUser(), [fetchAndSetUser]);
  const refreshSubscription = useCallback(() => fetchSubscription(), [fetchSubscription]);

  const isSubscriptionActive =
    subscription?.subscriptionStatus === "active" || subscription?.subscriptionStatus === "trialing";

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      logout,
      refreshUser,
      subscription,
      isSubscriptionActive,
      refreshSubscription,
    }),
    [user, isLoading, error, login, logout, refreshUser, subscription, isSubscriptionActive, refreshSubscription],
  );

  if (isLoading || (user && !hasCheckedSubscription)) {
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
