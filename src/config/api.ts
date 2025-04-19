import axios from 'axios';
import { API_URL } from '@env';
import storageService from '../common/services/storageService';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir token JWT en solicitudes
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storageService.getToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;