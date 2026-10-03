import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  const isSuccess = type === 'success';

  return (
    <div
      className="glass-panel animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderRadius: 'var(--radius-md)',
        background: isSuccess ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
        color: '#ffffff',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: '0.2rem',
          marginLeft: '0.5rem',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
