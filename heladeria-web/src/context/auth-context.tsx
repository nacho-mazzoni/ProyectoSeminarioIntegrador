"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { UsuarioResponse } from "@/lib/types";
import { api } from "@/services/api";

interface AuthContextValue {
  user: UsuarioResponse | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<UsuarioResponse>;
  register: (email: string, password: string, telefono?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "token";
const USER_KEY = "usuario";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioResponse | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
      }
      api.auth.me()
        .then((u) => {
          setUser(u);
          localStorage.setItem(USER_KEY, JSON.stringify(u));
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setUser(null);
        })
        .finally(() => setIsReady(true));
    } else {
      setIsReady(true);
    }
  }, []);

  const persist = (token: string | null, usuario: UsuarioResponse | null) => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
      if (usuario) localStorage.setItem(USER_KEY, JSON.stringify(usuario));
      else localStorage.removeItem(USER_KEY);
    } catch { /* ignore */ }
    setUser(usuario);
  };

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    persist(res.token, res.usuario);
    return res.usuario;
  };

  const register = async (email: string, password: string, telefono?: string) => {
    const res = await api.auth.register({ email, password, telefono });
    persist(res.token, res.usuario);
  };

  const logout = () => persist(null, null);

  const refreshUser = async () => {
    try {
      const u = await api.auth.me();
      persist(localStorage.getItem(TOKEN_KEY), u);
    } catch {
      logout();
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, isReady, login, register, logout, refreshUser }),
    [user, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
