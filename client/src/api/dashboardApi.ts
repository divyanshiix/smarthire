import axiosClient from './axiosClient';
import type { DashboardStats } from '../types';

export const dashboardApi = {
  getStats: async (): Promise<{ success: boolean; stats: DashboardStats }> => {
    const response = await axiosClient.get('/dashboard/stats');
    return response.data;
  }
};
