import { IA_API_URL } from '@env';
import axios from 'axios';

console.log('🤖 IA_API_URL from env:', IA_API_URL);

export const aiApiClient = axios.create({
  baseURL: IA_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
aiApiClient.interceptors.request.use(
  (config) => {
    console.log('🤖 AI API Request:', config.method?.toUpperCase(), config.url, config.data);
    console.log('🌐 AI Full URL:', `${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('🤖 AI API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
aiApiClient.interceptors.response.use(
  (response) => {
    console.log('🤖 AI API Response Success:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('🤖 AI API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.code === 'ECONNABORTED') {
      console.error('AI API Request timeout');
    } else if (error.message === 'Network Error') {
      console.error('AI API Network error - please check if IA server is running');
    } else if (error.response) {
      console.error(`AI API Error: ${error.response.status}`, error.response.data);
    } else {
      console.error('Unknown AI API error:', error);
    }
    return Promise.reject(error);
  }
);
