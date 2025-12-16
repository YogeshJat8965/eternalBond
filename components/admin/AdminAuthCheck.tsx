'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth-context';

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { admin, loading: authLoading } = useAdminAuth();

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsLoading(false);
      setIsAuthenticated(true);
      return;
    }

    // Wait for auth context to load
    if (authLoading) {
      return;
    }

    // Check if admin is authenticated via JWT token
    if (admin) {
      console.log('AdminAuthCheck: Admin authenticated:', admin.email);
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      console.log('AdminAuthCheck: No admin token found, redirecting to login');
      // Redirect to admin login
      router.push('/admin/login');
    }
  }, [pathname, router, admin, authLoading]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full mb-4"
          />
          <p className="text-gray-600 font-medium">Verifying admin access...</p>
        </motion.div>
      </div>
    );
  }

  // Not authenticated - show access denied
  if (!isAuthenticated && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need admin credentials to access this area.
          </p>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Go to Admin Login
          </button>
        </motion.div>
      </div>
    );
  }

  // Authenticated - show content
  return <>{children}</>;
}
