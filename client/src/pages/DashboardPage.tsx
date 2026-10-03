import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import type { DashboardStats } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { Briefcase, CheckCircle, Users, TrendingUp, Plus, ArrowRight } from 'lucide-react';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  openCreateJobModal: () => void;
  openAddApplicantModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActiveTab,
  openCreateJobModal,
  openAddApplicantModal
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getStats();
        setStats(res.stats);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ display: 'inline-block', width: 40, height: 40, border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading recruitment analytics...</p>
      </div>
    );
  }

  const statusBreakdown = stats?.statusBreakdown || {
    applied: 0,
    screening: 0,
    interview: 0,
    offered: 0,
    hired: 0,
    rejected: 0
  };

  const total = stats?.totalApplicants || 1;

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Recruitment Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Monitor job openings, candidate pipelines, and hiring conversion analytics in real time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={openCreateJobModal} className="btn btn-primary">
            <Plus size={18} />
            <span>Create Job</span>
          </button>
          <button onClick={openAddApplicantModal} className="btn btn-secondary">
            <Plus size={18} />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid-stats">
        <StatCard
          title="Total Openings"
          value={stats?.totalJobs || 0}
          subtitle={`${stats?.activeJobs || 0} Active Listings`}
          icon={Briefcase}
          colorGradient="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
        />
        <StatCard
          title="Total Applicants"
          value={stats?.totalApplicants || 0}
          subtitle="Across all postings"
          icon={Users}
          colorGradient="linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)"
        />
        <StatCard
          title="Hired Candidates"
          value={statusBreakdown.hired || 0}
          subtitle="Successfully onboarded"
          icon={CheckCircle}
          colorGradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats?.conversionRate || 0}%`}
          subtitle="Applicant to Hired ratio"
          icon={TrendingUp}
          colorGradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
        />
      </div>

      {/* Pipeline Stage Visual Breakdown */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Candidate Hiring Pipeline</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Applied', count: statusBreakdown.applied, color: '#3b82f6' },
            { label: 'Screening', count: statusBreakdown.screening, color: '#8b5cf6' },
            { label: 'Interview', count: statusBreakdown.interview, color: '#f59e0b' },
            { label: 'Offered', count: statusBreakdown.offered, color: '#06b6d4' },
            { label: 'Hired', count: statusBreakdown.hired, color: '#10b981' },
            { label: 'Rejected', count: statusBreakdown.rejected, color: '#ef4444' }
          ].map((stage) => {
            const pct = Math.round((stage.count / total) * 100) || 0;
            return (
              <div
                key={stage.label}
                className="glass-card"
                style={{ padding: '1rem', cursor: 'pointer' }}
                onClick={() => setActiveTab('applicants')}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{stage.label}</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stage.color, margin: '0.2rem 0' }}>
                  {stage.count}
                </div>
                <div style={{ width: '100%', height: 6, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: stage.color, transition: 'width 0.5s ease' }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
                  {pct}% of applicants
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Recent Jobs & Recent Candidate Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Jobs */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Active Job Postings</h3>
            <button
              onClick={() => setActiveTab('jobs')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats?.recentJobs && stats.recentJobs.length > 0 ? (
              stats.recentJobs.map((job) => (
                <div key={job._id} className="glass-card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{job.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{job.department} • {job.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StatusBadge status={job.status} type="job" />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No jobs posted yet.</p>
            )}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Candidate Activity</h3>
            <button
              onClick={() => setActiveTab('applicants')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats?.recentApplicants && stats.recentApplicants.length > 0 ? (
              stats.recentApplicants.map((app) => {
                const title = typeof app.jobId === 'object' && app.jobId !== null ? app.jobId.title : 'Job';
                return (
                  <div key={app._id} className="glass-card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{app.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applied for {title}</span>
                    </div>
                    <StatusBadge status={app.status} type="applicant" />
                  </div>
                );
              })
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No candidate applications yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
