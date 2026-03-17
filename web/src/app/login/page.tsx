'use client';

import Link from 'next/link';
import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaRobot, FaUser, FaLock, FaEye, FaEyeSlash, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { autenticado, cargando, login } = useAuth();

  useEffect(() => {
    if (!cargando && autenticado) {
      router.replace('/dashboard');
    }
  }, [autenticado, cargando, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!usuario.trim() || !password) {
      setError('Introduce usuario y contraseña');
      return;
    }
    setEnviando(true);
    try {
      await login(usuario.trim(), password);
      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Usuario o contraseña incorrectos');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-logo">
          <div className="login-logo-icon"><FaRobot /></div>
          <span className="login-logo-text">EduBot</span>
        </div>
      </header>

      <div className="login-container">
        <div className="login-left-panel">
          <div className="login-marketing">
            <h1 className="marketing-title">
              <span className="marketing-title-accent">Edu</span>Bot<br />
            </h1>
            <p className="marketing-description">
              Accede a la plataforma de EduBot para gestionar los acuerdos de reuniones, conjuntos de entrenamiento del chatbot y permisos de usuarios en tu institución.
            </p>
          </div>
        </div>

        <div className="login-right-panel">
          <div className="login-card">
            <h2 className="login-card-title">Inicio de sesión</h2>
            <p className="login-card-subtitle">
              Introduce tu usuario y contraseña para acceder a la plataforma.
            </p>

            <form className="login-form" onSubmit={handleSubmit} suppressHydrationWarning>
              {error && <p className="login-error">{error}</p>}
              <div className="form-group">
                <label className="form-label" htmlFor="usuario">Usuario</label>
                <div className="input-wrapper">
                  <span className="input-icon"><FaUser /></span>
                  <input id="usuario" type="text" className="form-input" placeholder="Tu usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" disabled={enviando} suppressHydrationWarning />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <div className="input-wrapper">
                  <span className="input-icon"><FaLock /></span>
                  <input id="password" type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" disabled={enviando} suppressHydrationWarning />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="login-button" disabled={enviando} suppressHydrationWarning>
                {enviando ? 'Entrando...' : 'Iniciar sesión'}
                <span className="button-arrow"><FaChevronRight /></span>
              </button>
            </form>

            <p className="auth-switch">
              ¿No tienes cuenta? <Link href="/registro" className="auth-switch-link">Regístrate</Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="login-footer">
        <div className="footer-left">
          <p>© 2026 Jose Poveda. IES Hermanos Amorós edubot 1.0</p>
        </div>
      </footer>
    </div>
  );
}
