import axiosClient from './axiosClient';
import type { Applicant, ApplicantStatus, PaginatedResponse } from '../types';

export interface ApplicantFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jobId?: string;
  sortBy?: string;
}

export const applicantApi = {
  getApplicants: async (params?: ApplicantFilterParams): Promise<PaginatedResponse<Applicant>> => {
    const response = await axiosClient.get('/applicants', { params });
    return response.data;
  },

  getApplicantById: async (id: string): Promise<{ success: boolean; applicant: Applicant }> => {
    const response = await axiosClient.get(`/applicants/${id}`);
    return response.data;
  },

  addApplicant: async (formData: FormData): Promise<{ success: boolean; message: string; applicant: Applicant }> => {
    const response = await axiosClient.post('/applicants', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateStatus: async (
    id: string,
    data: { status?: ApplicantStatus; notes?: string; rating?: number }
  ): Promise<{ success: boolean; message: string; applicant: Applicant }> => {
    const response = await axiosClient.put(`/applicants/${id}/status`, data);
    return response.data;
  },

  deleteApplicant: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.delete(`/applicants/${id}`);
    return response.data;
  },

  exportCSV: async (params?: { status?: string; jobId?: string; search?: string }): Promise<Blob> => {
    const response = await axiosClient.get('/applicants/export/csv', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};
