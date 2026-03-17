'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaComments, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';
import { api } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { path: '/dashboard', label: 'Consultar Acuerdos', icon: FaComments },
  { path: '/create-agreement', label: 'Crear Acuerdo', icon: FaPlus },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario } = useAuth();

  async function handleLogout() {
    try {
      await api.logout();
    } catch { /* ignore */ }
    window.location.href = '/login';
  }

  function handleLinkClick() {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      onClose();
    }
  }

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
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item ${pathname === item.path ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon"><Icon /></span>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="nav-section" />
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar"><HiUserCircle /></div>
          <div className="user-info">
            <div className="user-name">{usuario ? (usuario.nombre || usuario.usuario) : 'Usuario'}</div>
            <div className="user-role">{usuario?.usuario || 'Usuario'}</div>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout} title="Cerrar sesión">
          <FaSignOutAlt />
        </button>
      </div>
    </aside>
  );
}
