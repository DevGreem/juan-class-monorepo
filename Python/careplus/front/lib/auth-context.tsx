"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMe } from "./api";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
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

  useEffect(() => {
    const saved = localStorage.getItem("careplus_token");
    if (saved) setTokenState(saved);
    setLoaded(true);
  }, []);

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

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem("careplus_token", t);
    else localStorage.removeItem("careplus_token");
  };

  const logout = () => setToken(null);

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ token, setToken, logout, isAuthenticated: !!token, role, canManageUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
