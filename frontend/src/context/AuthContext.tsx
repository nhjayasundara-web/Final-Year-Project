import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import type { Role, User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role: Role }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('hope_token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const saveSession = (nextToken: string, nextUser: User) => {
    localStorage.setItem('hope_token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (email: string, password: string) => {
    const result = await api<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    saveSession(result.token, result.user);
  };

  const register = async (payload: { name: string; email: string; password: string; role: Role }) => {
    const result = await api<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    saveSession(result.token, result.user);
  };

  const logout = () => {
    localStorage.removeItem('hope_token');
    setToken(null);
    setUser(null);
  };

  const refresh = async () => {
    if (!localStorage.getItem('hope_token')) {
      setLoading(false);
      return;
    }
    try {
      const result = await api<{ user: User }>('/auth/me');
      setUser(result.user);
      setToken(localStorage.getItem('hope_token'));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(() => ({ user, token, loading, login, register, logout, refresh }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
