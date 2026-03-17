'use client';

import Link from 'next/link';
import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaRobot, FaUser, FaLock, FaUserTag, FaEye, FaEyeSlash, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';

export default function RegistroPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { autenticado, cargando } = useAuth();

  useEffect(() => {
    if (!cargando && autenticado) {
      router.replace('/dashboard');
    }
  }, [autenticado, cargando, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!usuario.trim()) { setError('El usuario es obligatorio'); return; }
    if (!password) { setError('La contraseña es obligatoria'); return; }
    if (password.length < 4) { setError('La contraseña debe tener al menos 4 caracteres'); return; }
    if (!nombre.trim()) { setError('El nombre es obligatorio'); return; }
    setEnviando(true);
    try {
      await api.register(usuario, password, nombre);
      router.replace('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
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
              Crea tu cuenta para acceder a la plataforma de gestión de acuerdos, consultas con IA y permisos de tu institución.
            </p>
          </div>
        </div>

        <div className="login-right-panel">
          <div className="login-card">
            <h2 className="login-card-title">Crear cuenta</h2>
            <p className="login-card-subtitle">Rellena los datos para registrarte en la plataforma.</p>

            <form className="login-form" onSubmit={handleSubmit} suppressHydrationWarning>
              {error && <p className="login-error">{error}</p>}
              <div className="form-group">
                <label className="form-label" htmlFor="usuario">Usuario</label>
                <div className="input-wrapper">
                  <span className="input-icon"><FaUser /></span>
                  <input id="usuario" type="text" className="form-input" placeholder="Nombre de usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" disabled={enviando} suppressHydrationWarning />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="nombre">Nombre</label>
                <div className="input-wrapper">
                  <span className="input-icon"><FaUserTag /></span>
                  <input id="nombre" type="text" className="form-input" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" disabled={enviando} suppressHydrationWarning />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <div className="input-wrapper">
                  <span className="input-icon"><FaLock /></span>
                  <input id="password" type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Mínimo 4 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" disabled={enviando} suppressHydrationWarning />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="login-button" disabled={enviando} suppressHydrationWarning>
                {enviando ? 'Registrando...' : 'Registrarse'}
                <span className="button-arrow"><FaChevronRight /></span>
              </button>
            </form>

            <p className="auth-switch">
              ¿Ya tienes cuenta? <Link href="/login" className="auth-switch-link">Iniciar sesión</Link>
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
