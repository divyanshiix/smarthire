import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, LogIn } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  showToast: (type: 'success' | 'error', msg: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister, showToast }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      showToast('success', 'Logged in successfully!');
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('recruiter@smarthire.com');
    setPassword('password123');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: 440, padding: '2.5rem 2rem' }}>
        {/* Header Branding */}
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
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Sign in to access SmartHire recruitment platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="recruiter@smarthire.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
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
            <LogIn size={18} />
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', marginBottom: '1rem', background: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)' }}
          >
            <span>Fill Demo Credentials (recruiter@smarthire.com)</span>
          </button>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Don't have a recruiter account?{' '}
            <button
              onClick={onSwitchToRegister}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
