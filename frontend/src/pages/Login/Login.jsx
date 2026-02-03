import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaRobot, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaChevronRight,
  FaUniversity,
  FaGraduationCap,
  FaGlobe
} from 'react-icons/fa';
import { HiCode } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { autenticado, cargando } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (!cargando && autenticado) {
      navigate('/dashboard', { replace: true });
    }
  }, [autenticado, cargando, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // El formulario tradicional no se usa, solo Google OAuth
  };

  const handleGoogleLogin = () => {
    // Redirigir al endpoint de autenticación de Google
    // Usar variable de entorno en producción, localhost en desarrollo
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 
        (import.meta.env.PROD ? '/api' : 'http://localhost:3300/api');
    window.location.href = `${apiUrl}/auth/google`;
  };

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
              Accedee a la plataforma de EduBot para gestionar los acuerdos de reuniones, conjuntos de entrenamiento del chatbot y permisos de usuarios en tu institución.
            </p>
          </div>
        </div>

        <div className="login-right-panel">
          <div className="login-card">
            <h2 className="login-card-title">Inicio de sesión</h2>
            <p className="login-card-subtitle">
              Inicia sesión con Google para acceder a la plataforma.
            </p>

            <button 
              type="button"
              className="google-signin-button"
              onClick={handleGoogleLogin}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="google-button-text">Iniciar sesión con Google</span>
            </button>

            <p className="login-disclaimer">
              Este es un sistema empresarial restringido. Los intentos de acceso no autorizados son registrados y monitoreados.
            </p>
          </div>
        </div>
      </div>

      <footer className="login-footer">
        <div className="footer-left">
          <p>© 2026 Jose Poveda. Ies Hermanos Amoros edubot 1.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
