'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Toast from '@/components/admin/Toast';
import BackButton from '@/components/admin/BackButton';
import api from '@/lib/api';
import { useAdminAuth } from '@/lib/admin-auth-context';

export default function ContactFormManagement() {
  const { admin } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);

  // Check admin token on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('adminToken');
      console.log('Admin token exists:', !!adminToken);
      if (!adminToken) {
        console.error('No admin token found!');
      }
    }
  }, []);

  // Fetch contacts from backend
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 20
      };

      if (filterStatus) {
        params.status = filterStatus;
      }

      console.log('Fetching contacts with params:', params);
      const response = await api.get('/admin/contacts', { params });
      console.log('Contacts response:', response.data);
      
      if (response.data.success) {
        setContacts(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalContacts(response.data.pagination?.totalContacts || 0);
      }
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      console.error('Error response:', error.response);
      setToast({
        message: error.response?.data?.message || error.message || 'Failed to fetch contacts',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch contacts on mount and when filters change
  useEffect(() => {
    fetchContacts();
  }, [currentPage, filterStatus]);

  // Filter contacts by search term (client-side)
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleViewDetails = (contact: any) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const updateStatus = async (contactId: string, newStatus: string) => {
    try {
      const response = await api.put(`/admin/contacts/${contactId}`, {
        status: newStatus
      });

      if (response.data.success) {
        setToast({
          message: `Status updated to ${newStatus}`,
          type: 'success'
        });
        // Update local state
        setContacts(contacts.map(c => c._id === contactId ? { ...c, status: newStatus } : c));
        // Update selected contact if modal is open
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact({ ...selectedContact, status: newStatus });
        }
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      setToast({
        message: error.response?.data?.message || 'Failed to update status',
        type: 'error'
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get status display name
  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'in-progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
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
          <h1 className="text-3xl font-bold text-gray-800">Contact Form Management</h1>
          <p className="text-gray-600 mt-2">View and manage contact form submissions</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-800">{totalContacts}</p>
          <p className="text-sm text-gray-600">Total Submissions</p>
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
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Contact Submissions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message Preview</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-golden-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-600">Loading contacts...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                    No contacts found
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact, index) => (
                  <motion.tr
                    key={contact._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {(currentPage - 1) * 20 + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                        {contact.phone && <p className="text-sm text-gray-500">{contact.phone}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{contact.subject}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{contact.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={contact.status}
                        onChange={(e) => updateStatus(contact._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:ring-2 focus:ring-golden-500 cursor-pointer ${getStatusColor(contact.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(contact.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewDetails(contact)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, totalContacts)} of {totalContacts} contacts
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-golden-500 to-golden-600 text-white hover:shadow-lg'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </motion.button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                      className={`w-10 h-10 rounded-lg font-medium ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-golden-500 to-golden-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-golden-500 to-golden-600 text-white hover:shadow-lg'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Contact Details</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Name</label>
                    <p className="text-gray-800">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedContact.status)}`}>
                      {getStatusDisplayName(selectedContact.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                    <p className="text-gray-800">{selectedContact.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
                    <p className="text-gray-800">{selectedContact.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Date & Time</label>
                  <p className="text-gray-800">{formatDate(selectedContact.createdAt)}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Subject</label>
                  <p className="text-gray-800 font-medium">{selectedContact.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Message</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                {selectedContact.adminResponse && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Admin Response</label>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedContact.adminResponse}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Update Status</label>
                  <select
                    value={selectedContact.status}
                    onChange={(e) => updateStatus(selectedContact._id, e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-semibold border-0 focus:ring-2 focus:ring-golden-500 cursor-pointer ${getStatusColor(selectedContact.status)}`}
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Try Gmail web interface first (more reliable)
                    const emailBody = `Dear ${selectedContact.name},%0D%0A%0D%0AThank you for contacting us regarding "${selectedContact.subject}".%0D%0A%0D%0A[Your response here]%0D%0A%0D%0A---%0D%0AOriginal Message:%0D%0A${selectedContact.message}%0D%0A%0D%0A---%0D%0ABest regards,%0D%0AEternal Bond Team`;
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${selectedContact.email}&su=Re: ${encodeURIComponent(selectedContact.subject)}&body=${emailBody}`;
                    
                    // Open Gmail in new tab
                    window.open(gmailUrl, '_blank');
                    
                    setToast({
                      message: 'Opening Gmail compose window...',
                      type: 'success'
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-golden-500 to-golden-600 text-white rounded-lg font-medium hover:shadow-lg"
                >
                  Reply via Email
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
