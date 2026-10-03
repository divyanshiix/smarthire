import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="btn btn-secondary btn-sm"
        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
      >
        <ChevronLeft size={16} />
        <span>Prev</span>
      </button>

      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '0 0.5rem' }}>
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="btn btn-secondary btn-sm"
        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
