'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, AuthStatus } from '@/lib/api-client';

type AuthUser = NonNullable<AuthStatus['usuario']>;

interface AuthContextValue {
  usuario: AuthUser | null;
  autenticado: boolean;
  cargando: boolean;
  login: (usuario: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  actualizarUsuario: (u: AuthUser | null) => void;
  verificarEstadoAutenticacion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);

  async function verificarEstadoAutenticacion() {
    try {
      setCargando(true);
      const result = await api.status();
      setAutenticado(result.autenticado);
      setUsuario(result.usuario || null);
    } catch {
      setAutenticado(false);
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    verificarEstadoAutenticacion();
  }, []);

  async function login(u: string, p: string) {
    const result = await api.login(u, p);
    setAutenticado(result.autenticado);
    setUsuario(result.usuario || null);
  }

  async function cerrarSesion() {
    try { await api.logout(); } catch { /* ignore */ }
    setAutenticado(false);
    setUsuario(null);
  }

  function actualizarUsuario(u: AuthUser | null) {
    setUsuario(u);
    setAutenticado(!!u);
  }

  return (
    <AuthContext.Provider value={{ usuario, autenticado, cargando, login, cerrarSesion, actualizarUsuario, verificarEstadoAutenticacion }}>
      {children}
    </AuthContext.Provider>
  );
}
