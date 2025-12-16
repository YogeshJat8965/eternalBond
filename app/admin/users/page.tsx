'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, UserX, Trash2, Eye, MoreVertical, X, Loader2, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import Toast from '@/components/admin/Toast';
import BackButton from '@/components/admin/BackButton';
import api from '@/lib/api';
import { toast as sonnerToast } from 'sonner';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { useRouter } from 'next/navigation';

export default function UserManagement() {
  const { admin } = useAdminAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: usersPerPage.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') {
        params.append('isActive', filterStatus === 'active' ? 'true' : 'false');
      }

      const response = await api.get(`/admin/users?${params.toString()}`);
      
      if (response.data && response.data.success) {
        const usersData = response.data.data || [];
        setUsers(usersData);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalUsers(response.data.pagination?.totalUsers || 0);
      } else {
        setUsers([]);
        sonnerToast.error('Failed to load users');
      }
    } catch (error: any) {
      setUsers([]);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch users';
      sonnerToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      if (response.data.success) {
        const data = response.data.data;
        // Merge user data with stats
        setUserDetails({
          ...data.user,
          interestStats: {
            sent: data.stats?.sentInterests || 0,
            received: data.stats?.receivedInterests || 0,
            accepted: data.stats?.acceptedInterests || 0
          }
        });
      }
    } catch (error: any) {
      sonnerToast.error('Failed to fetch user details');
    }
  };

  const handleViewUser = async (user: any) => {
    setSelectedUser(user);
    setUserDetails(null);
    setShowViewModal(true);
    await fetchUserDetails(user._id);
  };

  const handleBlockUser = (user: any) => {
    setSelectedUser(user);
    setShowBlockModal(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmBlock = async () => {
    if (!selectedUser) return;
    
    try {
      const wasBlocked = !selectedUser.isActive;
      await api.put(`/admin/users/${selectedUser._id}`, { 
        isActive: !selectedUser.isActive 
      });
      setToast({
        message: wasBlocked ? `${selectedUser.name} has been activated successfully!` : `${selectedUser.name} has been deactivated successfully!`,
        type: 'success'
      });
      fetchUsers();
    } catch (error: any) {
      sonnerToast.error(error.response?.data?.message || 'Failed to update user status');
    }
    setShowBlockModal(false);
    setSelectedUser(null);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await api.delete(`/admin/users/${selectedUser._id}`);
      setToast({
        message: `${selectedUser.name} has been deleted successfully!`,
        type: 'success'
      });
      fetchUsers();
    } catch (error: any) {
      sonnerToast.error(error.response?.data?.message || 'Failed to delete user');
    }
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <BackButton />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all registered users and their accounts</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-golden-500" />
          </div>
        ) : !users || users.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-golden-500 to-golden-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.membershipPlan === 'premium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.membershipPlan ? user.membershipPlan.charAt(0).toUpperCase() + user.membershipPlan.slice(1) : 'Basic'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.accountStatus === 'deleted' ? 'bg-gray-100 text-gray-700' :
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.accountStatus === 'deleted' ? 'Deleted' : user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleBlockUser(user)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Block User"
                      >
                        <UserX className="w-4 h-4" />
                      </motion.button>
                      {admin?.role === 'super-admin' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-golden-500 to-golden-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
            </div>
          </>
        )}
      </motion.div>

      {/* View User Details Modal */}
      <AnimatePresence>
        {showViewModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">User Details</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      router.push(`/profile/${selectedUser._id}`);
                      setShowViewModal(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-golden-500 to-golden-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Profile
                  </button>
                  <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {!userDetails ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-golden-500" />
                </div>
              ) : (
                <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Basic Info */}
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="w-16 h-16 bg-gradient-to-r from-golden-500 to-golden-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                      {userDetails.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800">{userDetails.name}</h4>
                      <p className="text-gray-600">{userDetails.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          userDetails.accountStatus === 'deleted' ? 'bg-gray-100 text-gray-700' :
                          userDetails.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {userDetails.accountStatus === 'deleted' ? 'Deleted' : userDetails.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {userDetails.isEmailVerified && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            Email Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Phone</p>
                      <p className="text-gray-800">{userDetails.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Gender</p>
                      <p className="text-gray-800 capitalize">{userDetails.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Date of Birth</p>
                      <p className="text-gray-800">{userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Age</p>
                      <p className="text-gray-800">{userDetails.age || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Personal Information</h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Height</p>
                        <p className="text-gray-800">{userDetails.height || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Marital Status</p>
                        <p className="text-gray-800">{userDetails.maritalStatus || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Religion</p>
                        <p className="text-gray-800">{userDetails.religion || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Caste</p>
                        <p className="text-gray-800">{userDetails.caste || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Mother Tongue</p>
                        <p className="text-gray-800">{userDetails.motherTongue || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Location</h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">City</p>
                        <p className="text-gray-800">{userDetails.city || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">State</p>
                        <p className="text-gray-800">{userDetails.state || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Country</p>
                        <p className="text-gray-800">{userDetails.country || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Professional Information</h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Education</p>
                        <p className="text-gray-800">{userDetails.education || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Occupation</p>
                        <p className="text-gray-800">{userDetails.occupation || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Income</p>
                        <p className="text-gray-800">{userDetails.income || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Membership Plan</p>
                        <p className="text-gray-800 capitalize">{userDetails.membershipPlan || 'Basic'}</p>
                      </div>
                    </div>
                  </div>

                  {/* About Me */}
                  {userDetails.aboutMe && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">About</h5>
                      <p className="text-gray-700">{userDetails.aboutMe}</p>
                    </div>
                  )}

                  {/* Interest Statistics */}
                  {userDetails.interestStats && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Interest Statistics</h5>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-blue-600">{userDetails.interestStats.sent || 0}</p>
                          <p className="text-sm text-gray-600">Sent</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-purple-600">{userDetails.interestStats.received || 0}</p>
                          <p className="text-sm text-gray-600">Received</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-600">{userDetails.interestStats.accepted || 0}</p>
                          <p className="text-sm text-gray-600">Accepted</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Joined</p>
                      <p className="text-gray-800">{new Date(userDetails.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    {userDetails.lastLogin && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Last Login</p>
                        <p className="text-gray-800">{new Date(userDetails.lastLogin).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block User Modal */}
      <AnimatePresence>
        {showBlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBlockModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">{selectedUser?.isActive ? 'Deactivate' : 'Activate'} User</h3>
                <button onClick={() => setShowBlockModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                {!selectedUser?.isActive
                  ? `Are you sure you want to activate ${selectedUser?.name}? They will be able to access their account again.`
                  : `Are you sure you want to deactivate ${selectedUser?.name}? They won't be able to access their account.`
                }
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBlock}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700"
                >
                  {!selectedUser?.isActive ? 'Activate User' : 'Deactivate User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete User Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Delete User</h3>
                <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to permanently delete <span className="font-semibold">{selectedUser?.name}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                >
                  Delete User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
