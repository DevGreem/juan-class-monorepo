"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { getMe } from "./api";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null, refreshToken?: string | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  role: string | null;
  canManageUsers: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  logout: () => {},
  isAuthenticated: false,
  role: null,
  canManageUsers: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const logout = useCallback(() => {
    setTokenState(null);
    setRole(null);
    setCanManageUsers(false);
    localStorage.removeItem("careplus_token");
    localStorage.removeItem("careplus_refresh_token");
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("careplus_token");
    if (saved) setTokenState(saved);
    setLoaded(true);
  }, []);

  // Listen for token-refreshed events from fetchAPI
  useEffect(() => {
    function handleTokenRefreshed(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.token) {
        setTokenState(detail.token);
      }
    }

    function handleSessionExpired() {
      logout();
    }

    window.addEventListener("careplus_token_refreshed", handleTokenRefreshed);
    window.addEventListener("careplus_session_expired", handleSessionExpired);

    return () => {
      window.removeEventListener("careplus_token_refreshed", handleTokenRefreshed);
      window.removeEventListener("careplus_session_expired", handleSessionExpired);
    };
  }, [logout]);

  useEffect(() => {
    if (token) {
      getMe(token)
        .then((me) => {
          setRole(me.role_name);
          setCanManageUsers(me.can_manage_users);
        })
        .catch(() => {
          setRole(null);
          setCanManageUsers(false);
        });
    } else {
      setRole(null);
      setCanManageUsers(false);
    }
  }, [token]);

  const setToken = (t: string | null, refreshToken?: string | null) => {
    setTokenState(t);
    if (t) {
      localStorage.setItem("careplus_token", t);
    } else {
      localStorage.removeItem("careplus_token");
    }
    if (refreshToken) {
      localStorage.setItem("careplus_refresh_token", refreshToken);
    } else if (t === null) {
      localStorage.removeItem("careplus_refresh_token");
    }
  };

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ token, setToken, logout, isAuthenticated: !!token, role, canManageUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
