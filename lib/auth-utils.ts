// Auth utility functions for token and user management

/**
 * Set cookie (for middleware compatibility)
 */
const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof window === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

/**
 * Remove cookie
 */
const removeCookie = (name: string): void => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

/**
 * Get JWT token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  console.log('getToken: Raw value from localStorage:', token, 'type:', typeof token);
  
  // Check for invalid values
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
    // Clear invalid data
    if (token) {
      console.log('getToken: Removing invalid token:', token);
      localStorage.removeItem('token');
      removeCookie('token');
    }
    return null;
  }
  
  console.log('getToken: Returning valid token, length:', token.length);
  return token;
};

/**
 * Set JWT token in localStorage and cookies
 */
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  console.log('setToken: Saving token to localStorage, length:', token?.length);
  localStorage.setItem('token', token);
  setCookie('token', token, 30); // Also set in cookie for middleware
  
  // Verify it was saved
  const saved = localStorage.getItem('token');
  console.log('setToken: Verified token saved:', !!saved, 'length:', saved?.length);
};

/**
 * Remove JWT token from localStorage and cookies
 */
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  removeCookie('token'); // Also remove from cookies
};

/**
 * Get user data from localStorage
 */
export const getUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    
    // Check for invalid values
    if (!userStr || userStr === 'undefined' || userStr === 'null' || userStr.trim() === '') {
      // Clear invalid data
      localStorage.removeItem('user');
      return null;
    }
    
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem('user');
    return null;
  }
};

/**
 * Set user data in localStorage
 */
export const setUser = (user: any): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Remove user data from localStorage
 */
export const removeUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  const hasToken = !!token;
  console.log('isAuthenticated check:', { hasToken, tokenLength: token?.length });
  return hasToken;
};

/**
 * Clear all auth data (logout)
 */
export const clearAuth = (): void => {
  removeToken();
  removeUser();
  
  // Dispatch event to notify components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('storage'));
  }
};

/**
 * Decode JWT token to get user info (without verification)
 */
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
