'use client';

import Link from 'next/link';
import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaRobot, FaUser, FaLock, FaUserTag, FaEye, FaEyeSlash, FaChevronRight, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { validateUsuario, validatePassword, validateNombre, validateRegisterForm } from '@/lib/validation';

export default function RegistroPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { autenticado, cargando } = useAuth();

  const [touched, setTouched] = useState({ usuario: false, nombre: false, password: false });

  const usuarioVal = touched.usuario ? validateUsuario(usuario) : null;
  const nombreVal = touched.nombre ? validateNombre(nombre) : null;
  const passwordVal = touched.password ? validatePassword(password) : null;

  useEffect(() => {
    if (!cargando && autenticado) {
      router.replace('/dashboard');
    }
  }, [autenticado, cargando, router]);

  function handleBlur(field: 'usuario' | 'nombre' | 'password') {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setTouched({ usuario: true, nombre: true, password: true });

    const result = validateRegisterForm(usuario, password, nombre);
    if (!result.valid) {
      const first = [...result.usuario, ...result.nombre, ...result.password][0];
      setError(first || 'Revisa los campos del formulario');
      return;
    }

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
                <div className={`input-wrapper ${usuarioVal ? (usuarioVal.valid ? 'input-valid' : 'input-invalid') : ''}`}>
                  <span className="input-icon"><FaUser /></span>
                  <input id="usuario" type="text" className="form-input" placeholder="Ej: juan.perez" value={usuario} onChange={(e) => setUsuario(e.target.value)} onBlur={() => handleBlur('usuario')} autoComplete="username" disabled={enviando} maxLength={30} suppressHydrationWarning />
                  {usuarioVal && (
                    <span className={`input-status-icon ${usuarioVal.valid ? 'status-ok' : 'status-err'}`}>
                      {usuarioVal.valid ? <FaCheck /> : <FaTimes />}
                    </span>
                  )}
                </div>
                {usuarioVal && !usuarioVal.valid && (
                  <ul className="field-errors">{usuarioVal.errors.map((e) => <li key={e}>{e}</li>)}</ul>
                )}
                <span className="form-hint">3-30 caracteres. Letras, números, puntos, guiones.</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="nombre">Nombre</label>
                <div className={`input-wrapper ${nombreVal ? (nombreVal.valid ? 'input-valid' : 'input-invalid') : ''}`}>
                  <span className="input-icon"><FaUserTag /></span>
                  <input id="nombre" type="text" className="form-input" placeholder="Tu nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} onBlur={() => handleBlur('nombre')} autoComplete="name" disabled={enviando} maxLength={60} suppressHydrationWarning />
                  {nombreVal && (
                    <span className={`input-status-icon ${nombreVal.valid ? 'status-ok' : 'status-err'}`}>
                      {nombreVal.valid ? <FaCheck /> : <FaTimes />}
                    </span>
                  )}
                </div>
                {nombreVal && !nombreVal.valid && (
                  <ul className="field-errors">{nombreVal.errors.map((e) => <li key={e}>{e}</li>)}</ul>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <div className={`input-wrapper ${passwordVal ? (passwordVal.valid ? 'input-valid' : 'input-invalid') : ''}`}>
                  <span className="input-icon"><FaLock /></span>
                  <input id="password" type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => handleBlur('password')} autoComplete="new-password" disabled={enviando} maxLength={128} suppressHydrationWarning />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {passwordVal && (
                    <span className={`input-status-icon ${passwordVal.valid ? 'status-ok' : 'status-err'}`}>
                      {passwordVal.valid ? <FaCheck /> : <FaTimes />}
                    </span>
                  )}
                </div>
                {passwordVal && !passwordVal.valid && (
                  <ul className="field-errors">{passwordVal.errors.map((e) => <li key={e}>{e}</li>)}</ul>
                )}
                {touched.password && password.length > 0 && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div className={`strength-fill strength-${getStrength(password)}`} />
                    </div>
                    <span className={`strength-label strength-text-${getStrength(password)}`}>{getStrengthLabel(getStrength(password))}</span>
                  </div>
                )}
                <span className="form-hint">Mín. 8 caracteres con mayúscula, minúscula y número.</span>
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

function getStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

function getStrengthLabel(s: number): string {
  return ['Muy débil', 'Débil', 'Aceptable', 'Fuerte', 'Muy fuerte'][s];
}
