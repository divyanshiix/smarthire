import React from 'react';
import type { Applicant, ApplicantStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { Mail, Phone, FileText, Star, Trash2 } from 'lucide-react';

interface ApplicantCardProps {
  applicant: Applicant;
  onStatusChange: (id: string, newStatus: ApplicantStatus) => void;
  onRatingChange: (id: string, newRating: number) => void;
  onDelete: (id: string) => void;
}

const STAGES: ApplicantStatus[] = ['applied', 'screening', 'interview', 'offered', 'hired', 'rejected'];

export const ApplicantCard: React.FC<ApplicantCardProps> = ({
  applicant,
  onStatusChange,
  onRatingChange,
  onDelete
}) => {
  const jobTitle = typeof applicant.jobId === 'object' && applicant.jobId !== null
    ? applicant.jobId.title
    : 'Job Application';

  const jobDept = typeof applicant.jobId === 'object' && applicant.jobId !== null
    ? applicant.jobId.department
    : '';

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5001';
  const resumeFullUrl = applicant.resumeUrl
    ? (applicant.resumeUrl.startsWith('http') ? applicant.resumeUrl : `${serverUrl}${applicant.resumeUrl}`)
    : null;

  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{applicant.name}</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
            {jobTitle} {jobDept ? `• ${jobDept}` : ''}
          </span>
        </div>
        <StatusBadge status={applicant.status} type="applicant" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Mail size={14} color="var(--text-muted)" />
          <a href={`mailto:${applicant.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{applicant.email}</a>
        </div>
        {applicant.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Phone size={14} color="var(--text-muted)" />
            <span>{applicant.phone}</span>
          </div>
        )}
      </div>

      {/* Candidate Star Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            style={{ cursor: 'pointer' }}
            fill={star <= (applicant.rating || 0) ? '#f59e0b' : 'transparent'}
            color={star <= (applicant.rating || 0) ? '#f59e0b' : 'var(--text-muted)'}
            onClick={() => onRatingChange(applicant._id, star)}
          />
        ))}
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
          ({applicant.rating || 0}/5)
        </span>
      </div>

      {applicant.notes && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'var(--bg-surface-solid)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
          "{applicant.notes}"
        </p>
      )}

      {/* Footer Controls */}
      <div style={{ paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        {/* Stage Dropdown */}
        <select
          value={applicant.status}
          onChange={(e) => onStatusChange(applicant._id, e.target.value as ApplicantStatus)}
          className="input-field"
          style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', width: 'auto' }}
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>
              Stage: {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {resumeFullUrl ? (
            <a
              href={resumeFullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}
              title="View PDF Resume"
            >
              <FileText size={14} color="#ef4444" />
              <span>Resume PDF</span>
            </a>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No Resume</span>
          )}

          <button
            onClick={() => onDelete(applicant._id)}
            className="btn btn-danger btn-sm"
            style={{ padding: '0.35rem' }}
            title="Delete Candidate Application"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
