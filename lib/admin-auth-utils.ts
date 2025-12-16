/**
 * Admin Authentication Utilities
 * Separate from user auth to maintain independent sessions
 */

// Admin token key (separate from user token)
const ADMIN_TOKEN_KEY = 'adminToken';
const ADMIN_USER_KEY = 'admin';

// Get admin token from localStorage
export const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  // Validate token string
  if (token && token !== 'undefined' && token !== 'null' && token.trim() !== '') {
    return token;
  }
  
  // Clean up invalid token
  if (token) {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
  
  return null;
};

// Set admin token in localStorage
export const setAdminToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

// Remove admin token from localStorage
export const removeAdminToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

// Get admin user data from localStorage
export const getAdminUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  
  const adminStr = localStorage.getItem(ADMIN_USER_KEY);
  if (adminStr && adminStr !== 'undefined' && adminStr !== 'null') {
    try {
      return JSON.parse(adminStr);
    } catch (error) {
      console.error('Failed to parse admin user data:', error);
      localStorage.removeItem(ADMIN_USER_KEY);
      return null;
    }
  }
  
  return null;
};

// Set admin user data in localStorage
export const setAdminUser = (admin: any): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
};

// Remove admin user data from localStorage
export const removeAdminUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_USER_KEY);
};

// Check if admin is authenticated
export const isAdminAuthenticated = (): boolean => {
  const token = getAdminToken();
  const admin = getAdminUser();
  return !!(token && admin);
};

// Clear all admin auth data
export const clearAdminAuth = (): void => {
  console.log('Admin Auth Utils: Clearing admin auth data');
  removeAdminToken();
  removeAdminUser();
  
  // Dispatch event to notify components
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      console.log('Admin Auth Utils: Dispatching admin auth change event');
      window.dispatchEvent(new Event('adminAuthChange'));
      window.dispatchEvent(new Event('storage'));
    }, 50);
  }
};

// Clean up old admin session data (backward compatibility)
export const cleanupOldAdminSession = (): void => {
  if (typeof window === 'undefined') return;
  
  // Remove old boolean-based admin login
  const oldAdminLogin = localStorage.getItem('isAdminLoggedIn');
  const oldAdminEmail = localStorage.getItem('adminEmail');
  
  if (oldAdminLogin || oldAdminEmail) {
    console.log('Admin Auth Utils: Cleaning up old admin session data');
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
  }
};
