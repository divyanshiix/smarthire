import React, { useEffect, useState } from 'react';
import { applicantApi } from '../api/applicantApi';
import type { ApplicantFilterParams } from '../api/applicantApi';
import { jobApi } from '../api/jobApi';
import type { Applicant, ApplicantStatus, Job } from '../types';
import { ApplicantCard } from '../components/ApplicantCard';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { useDebounce } from '../hooks/useDebounce';
import { Search, Download, UserPlus, FileUp, Users } from 'lucide-react';

interface ApplicantsPageProps {
  selectedJobIdFilter?: string;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  showToast: (type: 'success' | 'error', msg: string) => void;
}

const STAGES = ['all', 'applied', 'screening', 'interview', 'offered', 'hired', 'rejected'];

export const ApplicantsPage: React.FC<ApplicantsPageProps> = ({
  selectedJobIdFilter = 'all',
  showAddModal,
  setShowAddModal,
  showToast
}) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [activeStage, setActiveStage] = useState<string>('all');
  const [jobId, setJobId] = useState<string>(selectedJobIdFilter);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearch = useDebounce(searchTerm, 350);

  // Add Candidate Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobId: '',
    notes: '',
    rating: 3
  });
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);

  // Load available jobs for select dropdowns
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await jobApi.getJobs({ limit: 100 });
        setAvailableJobs(res.jobs || []);
        if (res.jobs && res.jobs.length > 0 && !formData.jobId) {
          setFormData((prev) => ({ ...prev, jobId: res.jobs![0]._id }));
        }
      } catch (err) {
        console.error('Failed to load jobs list:', err);
      }
    };

    loadJobs();
  }, []);

  const fetchApplicants = async () => {
    setIsLoading(true);
    try {
      const params: ApplicantFilterParams = {
        page: currentPage,
        limit: 8,
        search: debouncedSearch,
        status: activeStage !== 'all' ? activeStage : undefined,
        jobId: jobId !== 'all' ? jobId : undefined
      };
      const res = await applicantApi.getApplicants(params);
      setApplicants(res.applicants || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to fetch applicants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [currentPage, debouncedSearch, activeStage, jobId]);

  const handleStatusChange = async (id: string, newStatus: ApplicantStatus) => {
    try {
      await applicantApi.updateStatus(id, { status: newStatus });
      showToast('success', `Candidate stage updated to ${newStatus.toUpperCase()}`);
      fetchApplicants();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleRatingChange = async (id: string, newRating: number) => {
    try {
      await applicantApi.updateStatus(id, { rating: newRating });
      showToast('success', `Candidate rating updated to ${newRating} stars`);
      fetchApplicants();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to update rating');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this applicant profile?')) return;
    try {
      await applicantApi.deleteApplicant(id);
      showToast('success', 'Applicant removed');
      fetchApplicants();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to delete applicant');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        showToast('error', 'Only PDF files are accepted for resumes!');
        e.target.value = '';
        return;
      }
      setSelectedResumeFile(file);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobId) {
      showToast('error', 'Please select a job opening for this candidate');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('jobId', formData.jobId);
      data.append('notes', formData.notes);
      data.append('rating', formData.rating.toString());
      if (selectedResumeFile) {
        data.append('resume', selectedResumeFile);
      }

      await applicantApi.addApplicant(data);
      showToast('success', 'Candidate application added successfully!');
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', jobId: availableJobs[0]?._id || '', notes: '', rating: 3 });
      setSelectedResumeFile(null);
      fetchApplicants();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to add applicant');
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await applicantApi.exportCSV({
        status: activeStage !== 'all' ? activeStage : undefined,
        jobId: jobId !== 'all' ? jobId : undefined,
        search: debouncedSearch
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `smarthire_candidates_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('success', 'Candidate CSV export downloaded!');
    } catch (err) {
      showToast('error', 'Failed to export candidate CSV');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Candidate Applicants ({total})</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Track candidates through recruitment stages and inspect PDF resumes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <UserPlus size={18} />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Stage Tab Filters */}
      <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
        {STAGES.map((stg) => {
          const isActive = activeStage === stg;
          return (
            <button
              key={stg}
              onClick={() => {
                setActiveStage(stg);
                setCurrentPage(1);
              }}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                border: 'none',
                background: isActive ? 'var(--primary-gradient)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                textTransform: 'capitalize'
              }}
            >
              {stg}
            </button>
          );
        })}
      </div>

      {/* Search Bar & Job Select Filter */}
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search candidate name, email, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          value={jobId}
          onChange={(e) => {
            setJobId(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field"
          style={{ width: 'auto', minWidth: 200 }}
        >
          <option value="all">All Job Openings</option>
          {availableJobs.map((j) => (
            <option key={j._id} value={j._id}>
              {j.title} ({j.department})
            </option>
          ))}
        </select>
      </div>

      {/* Candidate Cards Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ display: 'inline-block', width: 36, height: 36, border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : applicants.length > 0 ? (
        <div className="grid-cards">
          {applicants.map((app) => (
            <ApplicantCard
              key={app._id}
              applicant={app}
              onStatusChange={handleStatusChange}
              onRatingChange={handleRatingChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Users size={48} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
          <h3>No Candidate Applications Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Try selecting a different stage filter or submit a candidate application.
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Add Candidate Application Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Submit Candidate Application"
      >
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Jordan Lee"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="jordan.lee@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="input-field"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Job Posting *</label>
            <select
              required
              className="input-field"
              value={formData.jobId}
              onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
            >
              {availableJobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title} - {j.department} ({j.location})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Resume (PDF Only, Max 5MB)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                <FileUp size={16} />
                <span>Choose PDF File</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              <span style={{ fontSize: '0.8rem', color: selectedResumeFile ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                {selectedResumeFile ? selectedResumeFile.name : 'No file chosen'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Interviewer Notes & Evaluation</label>
            <textarea
              rows={2}
              className="input-field"
              placeholder="Candidate background notes, key strengths, experience..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Candidate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
