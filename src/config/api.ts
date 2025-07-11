import { API_URL } from '@env';
import axios from 'axios';
import { getToken } from '../common/storage/tokenStorage';

console.log('🌐 API_URL from env:', API_URL);

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// List of endpoints that don't require authentication
const publicEndpoints = [
  '/api/v1/authentication/sign-in',
  '/api/v1/authentication/sign-up'
];

// Add request interceptor to include token on authenticated requests
apiClient.interceptors.request.use(
  async (config) => {
    console.log('🔍 Request to:', config.url);
    console.log('🌐 Full URL:', `${config.baseURL}${config.url}`);
    
    // Check if the current request is to a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    console.log('🔐 Is public endpoint:', isPublicEndpoint);
    
    // Only add token if it's not a public endpoint
    if (!isPublicEndpoint) {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🎫 Token added to request');
      } else {
        console.log('❌ No token found for authenticated request');
      }
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