import axios from 'axios';

// Set the base URL correctly without the /api/v1 part
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request debugging - simplified
api.interceptors.request.use((config) => {
  try {
    console.log('Making request to:', config.url);
  } catch (e) {}
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Add response debugging - minimal approach
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Minimal error handling with no logging
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } catch (e) {}
    }
    
    return Promise.reject(error);
  }
); 