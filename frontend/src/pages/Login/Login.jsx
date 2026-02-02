import { useState } from 'react';
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
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implementar lógica de login
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-logo">
          <div className="login-logo-icon"><FaRobot /></div>
          <span className="login-logo-text">EduBot Admin</span>
        </div>
        <nav className="login-nav">
          <a href="#" className="nav-link">System Status</a>
          <a href="#" className="nav-link">Help Desk</a>
          <span className="nav-icon-code"><HiCode /></span>
        </nav>
      </header>

      <div className="login-container">
        <div className="login-left-panel">
          <div className="login-marketing">
            <div className="marketing-label">ENTERPRISE MANAGEMENT</div>
            <h1 className="marketing-title">
              Powering<br />
              Institutional<br />
              <span className="marketing-title-accent">Intelligence.</span>
            </h1>
            <p className="marketing-description">
              Access the administrative dashboard to manage meeting agreements, chatbot training sets, and user permissions across your institution.
            </p>
            <div className="trust-indicators">
              <div className="trust-icons">
                <div className="trust-icon"><FaUniversity /></div>
                <div className="trust-icon"><FaGraduationCap /></div>
                <div className="trust-icon"><FaGlobe /></div>
              </div>
              <p className="trust-text">Trusted by 50+ Global Universities</p>
            </div>
          </div>
        </div>

        <div className="login-right-panel">
          <div className="login-card">
            <h2 className="login-card-title">Sign In</h2>
            <p className="login-card-subtitle">
              Use your enterprise SSO or institutional email.
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Institutional Email
                </label>
                <div className="input-wrapper">
                  <span className="input-icon"><FaEnvelope /></span>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="admin@institute.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <a href="#" className="forgot-password">
                    Forgot password?
                  </a>
                </div>
                <div className="input-wrapper">
                  <span className="input-icon"><FaLock /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-button">
                Access Administrative Portal
                <span className="button-arrow"><FaChevronRight /></span>
              </button>
            </form>

            <p className="security-guarantee">SECURITY GUARANTEED</p>

            <button className="google-signin-button">
              <div className="google-logo">G</div>
              Sign in with Google Workspace
            </button>

            <p className="login-disclaimer">
              This is a restricted enterprise system. Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </div>
      </div>

      <footer className="login-footer">
        <div className="footer-left">
          <p>© 2024 EduBot Technologies. Institutional Admin v4.2.1</p>
        </div>
        <div className="footer-right">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Security Terms</a>
          <a href="#" className="footer-link">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
