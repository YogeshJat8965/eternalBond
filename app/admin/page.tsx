'use client';

import { motion } from 'framer-motion';
import { Users, Heart, MessageSquare, TrendingUp, DollarSign, UserCheck, Mail, Star, Settings, HelpCircle, FileText, CreditCard, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// Animated Counter Component with Intersection Observer
function AnimatedCounter({ value, duration = 2000, inView }: { value: string; duration?: number; inView: boolean }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }

    // Parse the numeric value from the string
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    
    let start = 0;
    const increment = numericValue / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration, inView]);
  
  // Determine format from original value
  const displayValue = () => {
    const numValue = Math.floor(count);
    if (value.includes('%')) {
      return `${numValue}%`;
    } else if (value.includes('$')) {
      return `$${numValue.toLocaleString()}`;
    } else if (value.includes(',')) {
      return numValue.toLocaleString();
    }
    return numValue.toString();
  };
  
  return <span>{displayValue()}</span>;
}

export default function AdminDashboard() {
  const [isStatsInView, setIsStatsInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

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

  const stats = [
    { icon: Users, label: 'Total Users', value: '2543', change: '+12.5%', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
    { icon: MessageSquare, label: 'Testimonials', value: '456', change: '+15.3%', color: 'from-purple-500 to-golden-500', bgColor: 'bg-purple-50' },
    { icon: UserCheck, label: 'Premium Users', value: '892', change: '+18.7%', color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50' },
    { icon: Mail, label: 'Contact Forms', value: '234', change: '+5.4%', color: 'from-indigo-500 to-purple-500', bgColor: 'bg-indigo-50' },
    { icon: Star, label: 'Success Stories', value: '89', change: '+10.2%', color: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-50' },
  ];

  return (
    <div className="w-full flex justify-center items-start">
      <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6" style={{ marginLeft: '5%' }}>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
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
          <Link href="/admin/firebase">
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
          </Link>

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

      {/* Stats Grid with Animated Numbers - MOVED AFTER QUICK ACTIONS */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            whileHover={{ y: -5 }}
            className={`${stat.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              <AnimatedCounter value={stat.value} inView={isStatsInView} />
            </h3>
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
}
