import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 10000,
});

let tokenRef = null;

apiClient.interceptors.request.use((config) => {
  if (tokenRef) {
    config.headers.Authorization = `Bearer ${tokenRef}`;
  }
  return config;
});

export const setAuthToken = (token) => {
  tokenRef = token;
};

export default apiClient;
