import axiosClient from './axiosClient';
import type { Job, PaginatedResponse } from '../types';

export interface JobFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  type?: string;
  status?: string;
  sortBy?: string;
}

export const jobApi = {
  getJobs: async (params?: JobFilterParams): Promise<PaginatedResponse<Job>> => {
    const response = await axiosClient.get('/jobs', { params });
    return response.data;
  },

  getJobById: async (id: string): Promise<{ success: boolean; job: Job; applicants: any[] }> => {
    const response = await axiosClient.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (data: Partial<Job>): Promise<{ success: boolean; message: string; job: Job }> => {
    const response = await axiosClient.post('/jobs', data);
    return response.data;
  },

  updateJob: async (id: string, data: Partial<Job>): Promise<{ success: boolean; message: string; job: Job }> => {
    const response = await axiosClient.put(`/jobs/${id}`, data);
    return response.data;
  },

  deleteJob: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.delete(`/jobs/${id}`);
    return response.data;
  }
};
