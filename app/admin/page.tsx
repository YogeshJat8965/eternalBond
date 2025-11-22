'use client';

import { motion } from 'framer-motion';
import { Users, Heart, MessageSquare, TrendingUp, DollarSign, UserCheck, Mail, Star, Settings, HelpCircle, FileText, CreditCard, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { icon: Users, label: 'Total Users', value: '2,543', change: '+12.5%', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
    { icon: Heart, label: 'Active Matches', value: '1,234', change: '+8.2%', color: 'from-rose-500 to-pink-500', bgColor: 'bg-rose-50' },
    { icon: MessageSquare, label: 'Testimonials', value: '456', change: '+15.3%', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
    { icon: DollarSign, label: 'Revenue', value: '$45,678', change: '+22.1%', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
    { icon: UserCheck, label: 'Premium Users', value: '892', change: '+18.7%', color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50' },
    { icon: Mail, label: 'Contact Forms', value: '234', change: '+5.4%', color: 'from-indigo-500 to-purple-500', bgColor: 'bg-indigo-50' },
    { icon: Star, label: 'Success Stories', value: '89', change: '+10.2%', color: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-50' },
    { icon: TrendingUp, label: 'Engagement Rate', value: '76%', change: '+3.8%', color: 'from-teal-500 to-cyan-500', bgColor: 'bg-teal-50' },
  ];

  const recentUsers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', status: 'Active', joined: '2 hours ago', avatar: 'SJ' },
    { id: 2, name: 'Michael Chen', email: 'michael@example.com', status: 'Active', joined: '5 hours ago', avatar: 'MC' },
    { id: 3, name: 'Emma Wilson', email: 'emma@example.com', status: 'Pending', joined: '1 day ago', avatar: 'EW' },
    { id: 4, name: 'David Brown', email: 'david@example.com', status: 'Active', joined: '2 days ago', avatar: 'DB' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa@example.com', status: 'Active', joined: '3 days ago', avatar: 'LA' },
  ];

  const recentActivity = [
    { id: 1, action: 'New user registration', user: 'Sarah Johnson', time: '2 hours ago', type: 'user' },
    { id: 2, action: 'Premium subscription purchased', user: 'Michael Chen', time: '4 hours ago', type: 'payment' },
    { id: 3, action: 'New testimonial submitted', user: 'Emma Wilson', time: '6 hours ago', type: 'testimonial' },
    { id: 4, action: 'Contact form submitted', user: 'David Brown', time: '8 hours ago', type: 'contact' },
    { id: 5, action: 'Success story published', user: 'Lisa Anderson', time: '1 day ago', type: 'story' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
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
              {stat.value}
            </h3>
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
              className="group p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:border-purple-300 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
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
              className="group p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200 hover:border-rose-300 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-rose-500 group-hover:translate-x-1 transition-transform" />
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

          {/* Payment Gateway */}
          <Link href="/admin/payments">
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
          </Link>

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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dummy Chart 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">User Growth</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 45, 75, 85, 55, 90, 70, 80, 95, 60, 85, 100].map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                className="flex-1 bg-gradient-to-t from-rose-500 to-pink-500 rounded-t-lg"
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </motion.div>

        {/* Dummy Chart 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {[
                { percentage: 35, color: 'from-blue-500 to-cyan-500', label: 'Basic', delay: 0.6 },
                { percentage: 40, color: 'from-rose-500 to-pink-500', label: 'Premium', delay: 0.7 },
                { percentage: 25, color: 'from-purple-500 to-pink-500', label: 'Enterprise', delay: 0.8 },
              ].map((segment, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: segment.delay, duration: 0.5 }}
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${segment.color}`}
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((segment.percentage * 3.6 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((segment.percentage * 3.6 - 90) * Math.PI / 180)}%, 50% 50%)`,
                    transform: `rotate(${index * 120}deg)`,
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <span className="text-sm text-gray-600">Basic 35%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500"></div>
              <span className="text-sm text-gray-600">Premium 40%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <span className="text-sm text-gray-600">Enterprise 25%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Users</h3>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{user.joined}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'user' ? 'bg-blue-100' :
                  activity.type === 'payment' ? 'bg-green-100' :
                  activity.type === 'testimonial' ? 'bg-purple-100' :
                  activity.type === 'contact' ? 'bg-orange-100' : 'bg-pink-100'
                }`}>
                  {activity.type === 'user' && <Users className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'payment' && <DollarSign className="w-5 h-5 text-green-600" />}
                  {activity.type === 'testimonial' && <MessageSquare className="w-5 h-5 text-purple-600" />}
                  {activity.type === 'contact' && <Mail className="w-5 h-5 text-orange-600" />}
                  {activity.type === 'story' && <Heart className="w-5 h-5 text-pink-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
