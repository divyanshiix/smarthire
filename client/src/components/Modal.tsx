import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Light-dismiss click outside content fallback
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (e.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      const isInside = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInside) {
        onClose();
      }
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog glass-panel animate-fade-in"
      onClick={handleDialogClick}
      onCancel={onClose}
    >
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{title}</h3>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.3rem', borderRadius: '50%', border: 'none' }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </dialog>
  );
};
