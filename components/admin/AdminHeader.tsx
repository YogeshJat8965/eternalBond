'use client';

import { motion } from 'framer-motion';
import { ExternalLink, User, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function AdminHeader() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section - Logo & Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs text-gray-600">KalyanautsavaMat</p>
            </div>
          </Link>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center space-x-3 ml-auto">
          {/* View Website Button */}
          <Link href="/" target="_blank">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm font-medium">View Website</span>
            </motion.button>
          </Link>

          {/* View Website Icon (Mobile) */}
          <Link href="/" target="_blank" className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <ExternalLink className="w-5 h-5" />
            </motion.button>
          </Link>

          {/* Admin Profile */}
          <div className="relative" ref={profileMenuRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">Admin</span>
              <ChevronDown className="hidden md:block w-4 h-4 text-gray-600" />
            </motion.button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Administrator</p>
                      <p className="text-xs text-gray-600">admin@kalyan.com</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Link href="/">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
