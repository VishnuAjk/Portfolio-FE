import apiClient from './apiClient.js';

export const portfolioService = {
  fetchPortfolio: async () => {
    const { data } = await apiClient.get('/portfolio');
    return data;
  },
  updateSection: async (sectionKey, payload) => {
    const { data } = await apiClient.put(`/portfolio/${sectionKey}`, payload);
    return data;
  },
  createItem: async (sectionKey, payload) => {
    const { data } = await apiClient.post(`/portfolio/${sectionKey}`, payload);
    return data;
  },
  deleteItem: async (sectionKey, itemId) => {
    await apiClient.delete(`/portfolio/${sectionKey}/${itemId}`);
  },
};
