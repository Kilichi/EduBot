import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaComments, 
  FaPlus,
  FaUser, 
  FaChartBar, 
  FaFileAlt, 
  FaCog, 
  FaShieldAlt,
  FaChevronDown,
  FaSignOutAlt
} from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const menuItems = [
    { path: '/dashboard', label: 'Consultar Acuerdos', icon: FaComments },
    { path: '/create-agreement', label: 'Crear Acuerdo', icon: FaPlus },
    // { path: '/user-management', label: 'User Management', icon: FaUser },
    // { path: '/analytics', label: 'Analytics', icon: FaChartBar },
    // { path: '/documents', label: 'Document Repository', icon: FaFileAlt },
  ];

  const configItems = [
    //   { path:   '/settings', label: 'Settings', icon: FaCog },
    // { path: '/security', label: 'Security Compliance', icon: FaShieldAlt },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">EDU</div>
          <span className="logo-text">BOT</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">MENÚ PRINCIPAL</div>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon"><IconComponent /></span>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="nav-section">

        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          {usuario?.foto ? (
            <img 
              src={usuario.foto} 
              alt={usuario.nombre} 
              className="user-avatar-img"
            />
          ) : (
            <div className="user-avatar"><HiUserCircle /></div>
          )}
          <div className="user-info">
            <div className="user-name">
              {usuario ? `${usuario.nombre} ${usuario.apellido || ''}`.trim() : 'Usuario'}
            </div>
            <div className="user-role">{usuario?.email || 'Sin email'}</div>
          </div>
        </div>
        <button 
          className="logout-button"
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
