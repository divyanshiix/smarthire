import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, Mail, Lock, Building, UserPlus } from 'lucide-react';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
  showToast: (type: 'success' | 'error', msg: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin, showToast }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(name, email, password, company);
      showToast('success', 'Recruiter account registered successfully!');
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: 460, padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: 'var(--primary-gradient)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)',
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Create Account</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Join SmartHire to streamline candidate recruitment
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                required
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Work Email *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="sarah@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company / Organization</label>
            <div style={{ position: 'relative' }}>
              <Building size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Acme Tech Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                minLength={6}
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            <UserPlus size={18} />
            <span>{isSubmitting ? 'Creating Account...' : 'Register Recruiter'}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
