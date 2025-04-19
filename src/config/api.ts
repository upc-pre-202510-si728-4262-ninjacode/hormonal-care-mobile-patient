import { API_URL } from '@env';
import axios from 'axios';
import { getToken } from '../common/storage/tokenStorage';

export const apiClient = axios.create({
  baseURL: API_URL,
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
    // Handle 401 errors globally
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (could redirect to login)
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);