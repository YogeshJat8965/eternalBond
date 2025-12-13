import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    // Safely get token with validation
    let token = null;
    if (typeof window !== 'undefined') {
      const tokenStr = localStorage.getItem('token');
      // Validate token string
      if (tokenStr && tokenStr !== 'undefined' && tokenStr !== 'null' && tokenStr.trim() !== '') {
        token = tokenStr;
      } else if (tokenStr) {
        // Clean up invalid token
        localStorage.removeItem('token');
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Return error with message
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
