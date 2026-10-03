import axiosClient from './axiosClient';
import type { AuthResponse, User } from '../types';

export const authApi = {
  register: async (data: { name: string; email: string; password: string; company?: string }): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: { name?: string; company?: string; avatar?: string }): Promise<{ success: boolean; user: User; message: string }> => {
    const response = await axiosClient.put('/auth/profile', data);
    return response.data;
  }
};
