import React from 'react';
import type { ApplicantStatus, JobStatus } from '../types';

interface StatusBadgeProps {
  status: ApplicantStatus | JobStatus | string;
  type?: 'applicant' | 'job';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'applicant' }) => {
  const normalized = status.toLowerCase();

  const getLabel = (s: string) => {
    switch (s) {
      case 'full-time': return 'Full Time';
      case 'part-time': return 'Part Time';
      default: return s.charAt(0).toUpperCase() + s.slice(1);
    }
  };

  const badgeClass = type === 'job'
    ? `badge badge-${normalized}`
    : `badge badge-${normalized}`;

  return (
    <span className={badgeClass}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: 'currentColor'
      }} />
      {getLabel(normalized)}
    </span>
  );
};
