'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getToken, setToken, removeToken, getUser, setUser, removeUser, clearAuth } from '@/lib/auth-utils';

interface User {
  _id: string;
  name: string;
  email: string;
  gender: string;
  phone: string;
  city?: string;
  state?: string;
  country?: string;
  isEmailVerified: boolean;
  profilePicture?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();

    if (token && savedUser) {
      setUserState(savedUser);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Backend returns: { success, message, token, data: { id, name, email, profilePicture } }
      const token = response.data.token;
      const userData = response.data.data;
      
      console.log('Auth Context: Login successful, token:', !!token, 'user:', !!userData);
      
      // Save to localStorage
      setToken(token);
      setUser(userData);
      
      // Update state
      setUserState(userData);
      
      console.log('Auth Context: Token and user saved to localStorage');
      
      // Dispatch events AFTER everything is saved, with slight delay to ensure localStorage writes complete
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          console.log('Auth Context: Dispatching auth change events');
          window.dispatchEvent(new Event('authChange'));
          window.dispatchEvent(new Event('storage'));
        }, 50);
      }
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  // Register function
  const register = async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Note: User needs to verify email before login
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    console.log('Auth Context: Logging out');
    clearAuth(); // This now dispatches events automatically
    setUserState(null);
    console.log('Auth Context: Logout complete, events dispatched');
    
    router.push('/login');
  };

  // Update user state
  const updateUser = (userData: Partial<User>) => {
    const updatedUser = { ...user, ...userData } as User;
    setUserState(updatedUser);
    setUser(updatedUser);
  };

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.data;
      
      setUserState(userData);
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refresh fails, might be token issue - logout
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
