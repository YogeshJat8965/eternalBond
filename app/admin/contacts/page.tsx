'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, Trash2, Filter } from 'lucide-react';
import { useState } from 'react';
import Toast from '@/components/admin/Toast';

export default function ContactFormManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234-567-8901', subject: 'Premium Plan Inquiry', message: 'I would like to know more about the premium plan features and pricing.', status: 'New', date: '2024-11-20 10:30 AM' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234-567-8902', subject: 'Technical Issue', message: 'I am facing issues while uploading my profile picture. Please help.', status: 'Replied', date: '2024-11-19 02:15 PM' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', phone: '+1 234-567-8903', subject: 'Account Verification', message: 'My account verification is pending for 3 days. Please expedite.', status: 'In Progress', date: '2024-11-18 09:45 AM' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '+1 234-567-8904', subject: 'Refund Request', message: 'I would like to request a refund for my premium subscription.', status: 'New', date: '2024-11-17 04:20 PM' },
    { id: 5, name: 'Michael Wilson', email: 'michael@example.com', phone: '+1 234-567-8905', subject: 'Feature Suggestion', message: 'It would be great to have video call feature for verified members.', status: 'Replied', date: '2024-11-16 11:00 AM' },
    { id: 6, name: 'Sarah Brown', email: 'sarah@example.com', phone: '+1 234-567-8906', subject: 'Privacy Concern', message: 'I want to know how my data is protected on your platform.', status: 'In Progress', date: '2024-11-15 03:30 PM' },
    { id: 7, name: 'David Miller', email: 'david@example.com', phone: '+1 234-567-8907', subject: 'Partnership Inquiry', message: 'I represent a wedding planning company and would like to discuss partnership opportunities.', status: 'New', date: '2024-11-14 01:50 PM' },
    { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', phone: '+1 234-567-8908', subject: 'Account Deletion', message: 'Please delete my account and all associated data.', status: 'Replied', date: '2024-11-13 10:10 AM' },
  ]);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contact.status.toLowerCase().replace(' ', '-') === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (contact: any) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const handleDelete = (contactId: number) => {
    if (confirm('Are you sure you want to delete this contact submission?')) {
      setContacts(contacts.filter(c => c.id !== contactId));
      setToast({
        message: 'Contact submission deleted successfully!',
        type: 'success'
      });
    }
  };

  const updateStatus = (contactId: number, newStatus: string) => {
    setContacts(contacts.map(c => c.id === contactId ? { ...c, status: newStatus } : c));
    setToast({
      message: `Status updated to ${newStatus}`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
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
          <p className="text-3xl font-bold text-gray-800">{filteredContacts.length}</p>
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
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="replied">Replied</option>
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message Preview</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((contact, index) => (
                <motion.tr
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
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
                      onChange={(e) => updateStatus(contact.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:ring-2 focus:ring-golden-500 ${
                        contact.status === 'New' ? 'bg-blue-100 text-blue-700' :
                        contact.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Replied">Replied</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{contact.date}</td>
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
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(contact.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
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
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedContact.status === 'New' ? 'bg-blue-100 text-blue-700' :
                      selectedContact.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedContact.status}
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
                    <p className="text-gray-800">{selectedContact.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Date & Time</label>
                  <p className="text-gray-800">{selectedContact.date}</p>
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
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-golden-500 to-golden-500 text-white rounded-lg font-medium hover:shadow-lg"
                >
                  Reply via Email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
