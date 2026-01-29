import { Link, useLocation } from 'react-router-dom';
import { 
  FaComments, 
  FaPlus,
  FaUser, 
  FaChartBar, 
  FaFileAlt, 
  FaCog, 
  FaShieldAlt,
  FaChevronDown
} from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

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
          <div className="nav-section-title">MAIN MENU</div>
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
          <div className="user-avatar"><HiUserCircle /></div>
          <div className="user-info">
            <div className="user-name">Dr. Sarah Jenkins</div>
            <div className="user-role">Dean of Faculty</div>
          </div>
          <span className="dropdown-arrow"><FaChevronDown /></span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
