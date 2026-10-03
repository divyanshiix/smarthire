import React, { useEffect, useState } from 'react';
import { jobApi } from '../api/jobApi';
import type { JobFilterParams } from '../api/jobApi';
import type { Job, JobType, JobStatus } from '../types';
import { JobCard } from '../components/JobCard';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { useDebounce } from '../hooks/useDebounce';
import { Search, Plus, Briefcase } from 'lucide-react';

interface JobsPageProps {
  onViewApplicants: (jobId: string) => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  showToast: (type: 'success' | 'error', msg: string) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({
  onViewApplicants,
  showCreateModal,
  setShowCreateModal,
  showToast
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [department, setDepartment] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [type, setType] = useState<string>('all');

  // Edit State
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: '',
    type: 'full-time' as JobType,
    status: 'active' as JobStatus,
    description: '',
    requirements: '',
    salaryRange: '$100,000 - $130,000'
  });

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params: JobFilterParams = {
        page: currentPage,
        limit: 6,
        search: debouncedSearch,
        department: department !== 'all' ? department : undefined,
        status: status !== 'all' ? status : undefined,
        type: type !== 'all' ? type : undefined
      };
      const res = await jobApi.getJobs(params);
      setJobs(res.jobs || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, debouncedSearch, department, status, type]);

  const handleOpenCreate = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: 'Engineering',
      location: 'San Francisco, CA (Hybrid)',
      type: 'full-time',
      status: 'active',
      description: '',
      requirements: 'Node.js, React, TypeScript',
      salaryRange: '$120,000 - $150,000'
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : '',
      salaryRange: job.salaryRange
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reqArray = formData.requirements
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        requirements: reqArray
      };

      if (editingJob) {
        await jobApi.updateJob(editingJob._id, payload);
        showToast('success', 'Job posting updated successfully!');
      } else {
        await jobApi.createJob(payload);
        showToast('success', 'New job posting created successfully!');
      }
      setShowCreateModal(false);
      fetchJobs();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to save job');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting and all its candidates?')) return;
    try {
      await jobApi.deleteJob(id);
      showToast('success', 'Job deleted successfully');
      fetchJobs();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Job Postings ({total})</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Create and manage open positions across departments.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search job title, department, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Department Filter */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="input-field"
            style={{ width: 'auto' }}
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Human Resources">Human Resources</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field"
            style={{ width: 'auto' }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>

          {/* Type Filter */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-field"
            style={{ width: 'auto' }}
          >
            <option value="all">All Types</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ display: 'inline-block', width: 36, height: 36, border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid-cards">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onViewApplicants={onViewApplicants}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Briefcase size={48} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
          <h3>No Job Postings Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Try adjusting your search criteria or create a new position.
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Create / Edit Job Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={editingJob ? 'Edit Job Posting' : 'Post New Opening'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Senior MERN Developer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Engineering"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. San Francisco, CA / Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select
                className="input-field"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as JobType })}
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="input-field"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Salary Range</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. $120,000 - $150,000"
              value={formData.salaryRange}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <textarea
              required
              rows={3}
              className="input-field"
              placeholder="Describe role responsibilities, team impact, and objectives..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements (comma separated)</label>
            <input
              type="text"
              className="input-field"
              placeholder="Node.js, React, MongoDB, TypeScript"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingJob ? 'Update Job' : 'Publish Job'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
