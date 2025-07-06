import { API_URL } from '@env';
import axios from 'axios';
import { getToken } from '../common/storage/tokenStorage';

export const apiClient = axios.create({
  baseURL: 'http://192.168.88.5:8080',
  headers: {
    'Content-Type': 'application/json',
  },

});

// Add request interceptor to include token on authenticated requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.message === 'Network Error') {
      console.error('Network error - please check your connection');
    } else if (error.response) {
      console.error(`API Error: ${error.response.status}`, error.response.data);
    } else {
      console.error('Unknown API error:', error);
    }
    return Promise.reject(error);
  }
);