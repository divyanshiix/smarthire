import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Building, Mail, Moon, Sun, Save, ShieldCheck } from 'lucide-react';

interface ProfilePageProps {
  showToast: (type: 'success' | 'error', msg: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ showToast }) => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ name, company, avatar });
      showToast('success', 'Recruiter profile updated successfully');
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: 800 }}>
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Recruiter Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.8rem',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
          }}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.name}</h1>
              <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <ShieldCheck size={12} />
                <span>{user?.role?.toUpperCase()}</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              {user?.company} • {user?.email}
            </p>
          </div>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSubmit}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Recruiter Information</h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                required
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address (Read only)</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  disabled
                  className="input-field"
                  style={{ paddingLeft: '2.5rem', opacity: 0.7, cursor: 'not-allowed' }}
                  value={user?.email || ''}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Company / Agency Name</label>
              <div style={{ position: 'relative' }}>
                <Building size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image URL</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://images.unsplash.com/photo-..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" disabled={isSaving} className="btn btn-primary">
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>

        {/* Theme Preferences */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Appearance Mode</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Toggle between light and dark theme interface.</p>
          </div>

          <button onClick={toggleTheme} className="btn btn-secondary">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
