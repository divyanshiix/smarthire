import React from 'react';
import type { Job } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, DollarSign, Users, Calendar, Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface JobCardProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (id: string) => void;
  onViewApplicants?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete, onViewApplicants }) => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {job.department}
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.1rem' }}>{job.title}</h3>
          </div>
          <StatusBadge status={job.status} type="job" />
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}>
          {job.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={14} />
            <span>{job.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <DollarSign size={14} />
            <span>{job.salaryRange}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={14} />
            <span>{formatDate(job.createdAt)}</span>
          </div>
        </div>
      </div>

      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => onViewApplicants?.(job._id)}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Users size={15} />
          <span>{job.applicantsCount ?? 0} Applicants</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {onEdit && (
            <button
              onClick={() => onEdit(job)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.4rem', border: '1px solid var(--border-color)' }}
              title="Edit Job Posting"
            >
              <Edit3 size={15} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(job._id)}
              className="btn btn-danger btn-sm"
              style={{ padding: '0.4rem' }}
              title="Delete Job Posting"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
