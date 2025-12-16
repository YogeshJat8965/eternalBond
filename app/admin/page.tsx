'use client';

import { motion } from 'framer-motion';
import { Users, Heart, MessageSquare, TrendingUp, DollarSign, UserCheck, Mail, Star, Settings, HelpCircle, FileText, CreditCard, Database, ArrowRight, CheckCircle, XCircle, Clock, Image, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

// Animated Counter Component with Intersection Observer
function AnimatedCounter({ value, duration = 2000, inView }: { value: number; duration?: number; inView: boolean }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Always animate if we have a value, don't wait for inView
    if (!value || value === 0) {
      setCount(0);
      return;
    }
    
    let start = 0;
    const increment = value / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{Math.floor(count)}</span>;
}

interface DashboardStats {
  users: {
    total: number;
    active: number;
    verified: number;
    male: number;
    female: number;
    premium: number;
  };
  interests: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
  contacts: {
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
  };
  photos: {
    usersWithPhotos: number;
  };
  testimonials: {
    total: number;
    active: number;
  };
  stories: {
    total: number;
    featured: number;
    active: number;
  };
}

export default function AdminDashboard() {
  const [isStatsInView, setIsStatsInView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Fetch dashboard stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/stats');
        
        if (response.data.success) {
          const statsData = response.data.data;
          console.log('Dashboard stats loaded:', statsData);
          console.log('Total users value:', statsData.users.total, 'Type:', typeof statsData.users.total);
          console.log('Total interests value:', statsData.interests.total, 'Type:', typeof statsData.interests.total);
          setStats(statsData);
        } else {
          toast.error('Failed to load dashboard statistics');
        }
      } catch (error: any) {
        console.error('Failed to fetch dashboard stats:', error);
        toast.error(error.response?.data?.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Intersection Observer to detect when stats section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsStatsInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
      }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full"
            />
            <p className="text-gray-600 mt-4">Loading dashboard statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Failed to load dashboard statistics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </motion.div>

      {/* Quick Actions Section - MOVED TO TOP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <p className="text-gray-600 mb-6">Manage your website content and settings</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* User Management */}
          <Link href="/admin/users">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:border-blue-300 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">User Management</h4>
              <p className="text-sm text-gray-600">View, block & delete users</p>
            </motion.div>
          </Link>

          {/* FAQ Management */}
          <Link href="/admin/faqs">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group p-4 bg-gradient-to-br from-purple-50 to-golden-50 rounded-xl border border-purple-200 hover:border-purple-300 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-golden-500 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">FAQ Management</h4>
              <p className="text-sm text-gray-600">Add, edit & delete FAQs</p>
            </motion.div>
          </Link>

          {/* Testimonials */}
          <Link href="/admin/testimonials">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group p-4 bg-gradient-to-br from-golden-50 to-golden-50 rounded-xl border border-rose-200 hover:border-rose-300 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-golden-500 to-golden-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-golden-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Testimonials</h4>
              <p className="text-sm text-gray-600">Manage customer reviews</p>
            </motion.div>
          </Link>

          {/* Success Stories */}
          <Link href="/admin/stories">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:border-amber-300 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Success Stories</h4>
              <p className="text-sm text-gray-600">Feature couple stories</p>
            </motion.div>
          </Link>

          {/* Contact Forms */}
          <Link href="/admin/contacts">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 hover:border-indigo-300 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Contact Forms</h4>
              <p className="text-sm text-gray-600">View customer inquiries</p>
            </motion.div>
          </Link>

          {/* Payment Gateway - Commented for future use */}
          {/* <Link href="/admin/payments">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-300 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Payment Gateway</h4>
              <p className="text-sm text-gray-600">Configure payment methods</p>
            </motion.div>
          </Link> */}

          {/* Firebase Settings */}
          {/* <Link href="/admin/firebase">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 hover:border-yellow-300 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-yellow-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Firebase Settings</h4>
              <p className="text-sm text-gray-600">Configure integrations</p>
            </motion.div>
          </Link> */}

          {/* View Website */}
          <Link href="/" target="_blank">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 hover:border-teal-300 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-teal-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">View Website</h4>
              <p className="text-sm text-gray-600">Open main website</p>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid - Dashboard Overview */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
        {/* Total Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
          className="bg-blue-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {stats.users.total}
          </h3>
          <p className="text-gray-600 text-sm font-medium mb-2">Total Users</p>
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>Active:</span>
              <span className="font-semibold">{stats.users.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Verified:</span>
              <span className="font-semibold">{stats.users.verified}</span>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ y: -5 }}
          className="bg-purple-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-golden-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {stats.testimonials.total}
          </h3>
          <p className="text-gray-600 text-sm font-medium mb-2">Testimonials</p>
          <div className="text-xs text-gray-500">
            <p>Manage customer reviews</p>
          </div>
        </motion.div>

        {/* Premium Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5 }}
          className="bg-amber-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {stats.users.premium}
          </h3>
          <p className="text-gray-600 text-sm font-medium mb-2">Premium Users</p>
          <div className="text-xs text-gray-500">
            <p>Subscribed members</p>
          </div>
        </motion.div>

        {/* Contact Forms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ y: -5 }}
          className="bg-indigo-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {stats.contacts.total}
          </h3>
          <p className="text-gray-600 text-sm font-medium mb-2">Contact Forms</p>
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>New:</span>
              <span className="font-semibold">{stats.contacts.new}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>In Progress:</span>
              <span className="font-semibold">{stats.contacts.inProgress}</span>
            </div>
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5 }}
          className="bg-yellow-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {stats.stories.total}
          </h3>
          <p className="text-gray-600 text-sm font-medium mb-2">Success Stories</p>
          <div className="text-xs text-gray-500">
            <p>Featured couple stories</p>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
