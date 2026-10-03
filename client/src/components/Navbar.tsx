import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Briefcase, Users, User, Sun, Moon, LogOut, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applicants', label: 'Applicants', icon: Users },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SmartHire
            </h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ATS Platform
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  border: isActive ? 'none' : '1px solid transparent',
                  background: isActive ? 'var(--primary-gradient)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', padding: '0.5rem', border: '1px solid var(--border-color)' }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* Recruiter Avatar Badge */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.85rem' }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                overflow: 'hidden'
              }}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.company}</span>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            className="btn btn-danger btn-sm"
            title="Sign out of SmartHire"
          >
            <LogOut size={16} />
            <span style={{ display: 'none' }}>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
