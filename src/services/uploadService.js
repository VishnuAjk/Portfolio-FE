import apiClient from './apiClient.js';

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await apiClient.post('/uploads', formData);
    if (data?.url && !/^https?:\/\//i.test(data.url)) {
      const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';
      const origin = apiBase.replace(/\/api\/?$/i, '');
      return { ...data, url: `${origin}${data.url.startsWith('/') ? '' : '/'}${data.url}` };
    }
    return data;
  },
};
