import axios from 'axios';

// In production, use relative '/api' or VITE_API_URL environment variable; fallback to localhost in development
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('carewave_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking /api/auth/me during initial boot
      const isAuthMe = error.config.url && error.config.url.includes('/auth/me');
      if (!isAuthMe) {
        localStorage.removeItem('carewave_token');
        localStorage.removeItem('carewave_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/login?expired=1';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
