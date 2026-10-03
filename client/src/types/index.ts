export type UserRole = 'recruiter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
  avatar?: string;
  createdAt?: string;
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'remote';
export type JobStatus = 'active' | 'closed' | 'draft';

export interface Job {
  _id: string;
  id?: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string[];
  salaryRange: string;
  recruiterId?: {
    _id: string;
    name: string;
    email: string;
    company?: string;
    avatar?: string;
  };
  applicantsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export type ApplicantStatus = 'applied' | 'screening' | 'interview' | 'offered' | 'hired' | 'rejected';

export interface Applicant {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  jobId: Job | string;
  status: ApplicantStatus;
  resumeUrl?: string;
  notes?: string;
  rating: number;
  createdAt: string;
  updatedAt?: string;
}

export interface StatusBreakdown {
  applied: number;
  screening: number;
  interview: number;
  offered: number;
  hired: number;
  rejected: number;
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  draftJobs: number;
  totalApplicants: number;
  statusBreakdown: StatusBreakdown;
  conversionRate: number | string;
  recentApplicants: Applicant[];
  recentJobs: Job[];
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user: User;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  jobs?: T[];
  applicants?: T[];
}
