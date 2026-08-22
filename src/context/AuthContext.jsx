import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";
import { applyUITheme } from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());

  useEffect(() => {
    const color = user?.companion?.color || "lavender";
    applyUITheme(color);
  }, [user?.companion?.color]);

  const value = useMemo(() => ({
    user,
    refresh() {
      setUser(authService.getCurrentUser());
    },
    signup(payload) {
      const next = authService.signup(payload);
      setUser(next);
      return next;
    },
    login(payload) {
      const next = authService.login(payload);
      setUser(next);
      return next;
    },
    logout() {
      authService.logout();
      setUser(null);
    },
    setUser,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
