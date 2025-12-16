'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
  getAdminToken, 
  setAdminToken, 
  removeAdminToken, 
  getAdminUser, 
  setAdminUser, 
  removeAdminUser, 
  clearAdminAuth,
  cleanupOldAdminSession
} from '@/lib/admin-auth-utils';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super-admin';
  [key: string]: any;
}

interface AdminAuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdminState] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load admin from localStorage on mount
  useEffect(() => {
    // Clean up old session data first
    cleanupOldAdminSession();
    
    const token = getAdminToken();
    const savedAdmin = getAdminUser();

    if (token && savedAdmin) {
      setAdminState(savedAdmin);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/admin/login', { email, password });
      
      // Backend returns: { success, message, data: { admin: {...}, token: "..." } }
      const token = response.data.data.token;
      const adminData = response.data.data.admin;
      
      console.log('Admin Auth Context: Login successful, token:', !!token, 'admin:', !!adminData);
      
      // Save to localStorage
      setAdminToken(token);
      setAdminUser(adminData);
      
      // Update state
      setAdminState(adminData);
      
      console.log('Admin Auth Context: Token and admin saved to localStorage');
      
      // Dispatch events AFTER everything is saved
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          console.log('Admin Auth Context: Dispatching admin auth change events');
          window.dispatchEvent(new Event('adminAuthChange'));
          window.dispatchEvent(new Event('storage'));
        }, 50);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Admin Auth Context: Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    console.log('Admin Auth Context: Logging out');
    clearAdminAuth();
    setAdminState(null);
    console.log('Admin Auth Context: Logout complete, events dispatched');
    
    router.push('/admin/login');
  };

  // Refresh admin data from server
  const refreshAdmin = async () => {
    try {
      // Note: Backend doesn't have /api/admin/me endpoint yet
      // For now, we'll just keep the stored admin data
      // If needed, this can call an endpoint to refresh admin info
      console.log('Admin Auth Context: Refresh admin data (using stored data)');
      
      const storedAdmin = getAdminUser();
      if (storedAdmin) {
        setAdminState(storedAdmin);
      } else {
        // If no stored data, logout
        logout();
      }
    } catch (error) {
      console.error('Failed to refresh admin:', error);
      logout();
    }
  };

  const value: AdminAuthContextType = {
    admin,
    loading,
    login,
    logout,
    refreshAdmin,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

// Custom hook to use admin auth context
export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
