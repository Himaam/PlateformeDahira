import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  BookOpen,
  GitBranch,
  Calendar,
  MessageCircle,
  Wallet,
  Shield,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Settings,
  Home,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dahiras, getInitials, fullName } from '../data/mock';
import './Layout.css';

const navItems = [
  { to: '/app', end: true, icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/app/dahiras', icon: Building2, label: 'Dahiras' },
  { to: '/app/membres', icon: Users, label: 'Membres' },
  { to: '/app/evenements', icon: Calendar, label: 'Événements' },
  { to: '/app/savoir', icon: BookOpen, label: 'Savoir & Archives' },
  { to: '/app/silsila', icon: GitBranch, label: 'Silsila' },
  { to: '/app/reseau', icon: MessageCircle, label: 'Réseau social' },
  { to: '/app/finances', icon: Wallet, label: 'Contributions' },
  { to: '/app/localisation', icon: MapPin, label: 'Localisation' },
  { to: '/app/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/app/securite', icon: Shield, label: 'Sécurité & Admin' },
  { to: '/app/profil', icon: Settings, label: 'Mon profil' },
];

export default function Layout() {
  const { currentUser, logout, unreadCount, activeDahiraId, setActiveDahiraId, notifications, markNotificationRead, markAllNotificationsRead } =
    useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dahiraOpen, setDahiraOpen] = useState(false);
  const navigate = useNavigate();

  const myDahiras = dahiras.filter((d) => currentUser.dahiraIds.includes(d.id));
  const activeDahira = dahiras.find((d) => d.id === activeDahiraId);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">
            <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden>
              <rect width="40" height="40" rx="10" fill="#C9A227" />
              <path
                d="M20 6c-5 5-8 9-8 14a8 8 0 0016 0c0-5-3-9-8-14z"
                fill="#0B3D2E"
              />
              <circle cx="20" cy="22" r="2.5" fill="#C9A227" />
            </svg>
          </div>
          <div>
            <div className="brand-name">Dahira</div>
            <div className="brand-tag">Communauté spirituelle</div>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="dahira-switcher">
          <button
            className="dahira-switcher-btn"
            onClick={() => setDahiraOpen(!dahiraOpen)}
          >
            <Building2 size={16} />
            <span>{activeDahira?.nom ?? 'Choisir une Dahira'}</span>
            <ChevronDown size={16} />
          </button>
          {dahiraOpen && (
            <div className="dahira-switcher-menu">
              {myDahiras.map((d) => (
                <button
                  key={d.id}
                  className={d.id === activeDahiraId ? 'active' : ''}
                  onClick={() => {
                    setActiveDahiraId(d.id);
                    setDahiraOpen(false);
                  }}
                >
                  {d.nom}
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/" className="nav-item">
            <Home size={18} />
            <span>Site public</span>
          </NavLink>
          <button className="nav-item" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>

          <div className="topbar-search">
            <input
              type="search"
              className="form-input"
              placeholder="Rechercher une Dahira, un membre, un contenu…"
              aria-label="Recherche"
            />
          </div>

          <div className="topbar-actions">
            <div className="notif-wrap">
              <button
                className="icon-btn"
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="notif-panel">
                  <div className="notif-panel-header">
                    <strong>Notifications</strong>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={markAllNotificationsRead}
                    >
                      Tout marquer lu
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="empty-state" style={{ padding: '1.5rem' }}>
                      Aucune notification
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        className={`notif-item ${n.lu ? '' : 'unread'}`}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.link) navigate(n.link);
                          setNotifOpen(false);
                        }}
                      >
                        <div className="notif-title">{n.titre}</div>
                        <div className="notif-msg">{n.message}</div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              className="user-chip"
              onClick={() => navigate('/app/profil')}
            >
              <div className="avatar avatar-sm">{getInitials(currentUser)}</div>
              <span className="user-chip-name">{fullName(currentUser)}</span>
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
