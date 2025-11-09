import apiClient from './apiClient.js';

export const authService = {
  login: async ({ email, password }) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },
  logout: () => apiClient.post('/auth/logout'),
  getProfile: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};
