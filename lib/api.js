import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds (increased for email operations)
});

// Request interceptor - attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    // Determine if this is an admin or user request based on URL
    const isAdminRequest = config.url?.startsWith('/admin');
    
    // Safely get token with validation
    let token = null;
    if (typeof window !== 'undefined') {
      // Use admin token for admin routes, user token for others
      const tokenKey = isAdminRequest ? 'adminToken' : 'token';
      const tokenStr = localStorage.getItem(tokenKey);
      
      // Validate token string
      if (tokenStr && tokenStr !== 'undefined' && tokenStr !== 'null' && tokenStr.trim() !== '') {
        token = tokenStr;
      } else if (tokenStr) {
        // Clean up invalid token
        localStorage.removeItem(tokenKey);
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
    const isAdminPath = typeof window !== 'undefined' && window.location.pathname.includes('/admin');
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      if (isAdminPath) {
        // Clear admin auth
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        
        // Redirect to admin login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      } else {
        // Clear user auth
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to user login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    // Handle 403 Forbidden - user blocked or deleted by admin
    if (error.response?.status === 403 && !isAdminPath) {
      const errorMessage = error.response?.data?.message || '';
      
      // Check if it's an account deactivation/deletion message
      if (errorMessage.includes('deactivated') || errorMessage.includes('deleted') || errorMessage.includes('logged out')) {
        // Clear user auth
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Show alert with the error message
        if (typeof window !== 'undefined') {
          // Create a custom styled alert div
          const alertDiv = document.createElement('div');
          alertDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px 40px;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            text-align: center;
            font-family: system-ui, -apple-system, sans-serif;
          `;
          alertDiv.innerHTML = `
            <div style="color: #dc2626; font-size: 48px; margin-bottom: 15px;">⚠️</div>
            <h3 style="color: #1f2937; font-size: 20px; font-weight: 600; margin-bottom: 10px;">Account Blocked</h3>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">${errorMessage}</p>
            <button id="blockAlertBtn" style="
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
              color: white;
              border: none;
              padding: 10px 24px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: opacity 0.2s;
            " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
              OK
            </button>
          `;
          
          // Add backdrop
          const backdrop = document.createElement('div');
          backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
          `;
          
          document.body.appendChild(backdrop);
          document.body.appendChild(alertDiv);
          
          // Handle OK button click
          document.getElementById('blockAlertBtn').addEventListener('click', () => {
            document.body.removeChild(alertDiv);
            document.body.removeChild(backdrop);
            window.location.href = '/login';
          });
        }
      }
    }

    // Preserve the original error structure for better debugging
    return Promise.reject(error);
  }
);

export default api;
