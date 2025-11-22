'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Search, Star } from 'lucide-react';
import { useState } from 'react';
import Toast from '@/components/admin/Toast';

export default function TestimonialManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    rating: 5,
    message: '',
    image: ''
  });

  const [testimonials, setTestimonials] = useState([
    { id: 1, name: 'Sarah Johnson', position: 'Marketing Manager', company: 'Tech Corp', rating: 5, message: 'KalyanautsavaMat helped me find my perfect match! The platform is incredibly easy to use and the matches are very accurate.', image: 'SJ', date: '2024-10-15' },
    { id: 2, name: 'Michael Chen', position: 'Software Engineer', company: 'StartupXYZ', rating: 5, message: 'I was skeptical at first, but KalyanautsavaMat exceeded all my expectations. Met my soulmate within 3 months!', image: 'MC', date: '2024-09-22' },
    { id: 3, name: 'Emma Wilson', position: 'Designer', company: 'Creative Studio', rating: 4, message: 'Great platform with genuine profiles. The customer service is outstanding and very helpful.', image: 'EW', date: '2024-11-01' },
    { id: 4, name: 'David Brown', position: 'Business Owner', company: 'Brown Enterprises', rating: 5, message: 'The best matrimonial site I have used. Found my life partner here. Highly recommended!', image: 'DB', date: '2024-08-10' },
    { id: 5, name: 'Lisa Anderson', position: 'Doctor', company: 'City Hospital', rating: 5, message: 'Professional, secure, and effective. KalyanautsavaMat made my search for a life partner so much easier.', image: 'LA', date: '2024-10-28' },
    { id: 6, name: 'James Taylor', position: 'Teacher', company: 'Central School', rating: 4, message: 'Good experience overall. The matching algorithm is smart and the interface is user-friendly.', image: 'JT', date: '2024-09-05' },
  ]);

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTestimonial = () => {
    setFormData({ name: '', position: '', company: '', rating: 5, message: '', image: '' });
    setShowAddModal(true);
  };

  const handleEditTestimonial = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company,
      rating: testimonial.rating,
      message: testimonial.message,
      image: testimonial.image
    });
    setShowEditModal(true);
  };

  const handleDeleteTestimonial = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setShowDeleteModal(true);
  };

  const submitAdd = () => {
    if (!formData.name.trim() || !formData.message.trim()) {
      setToast({
        message: 'Please fill in name and message fields',
        type: 'warning'
      });
      return;
    }
    const newTestimonial = {
      id: Math.max(...testimonials.map(t => t.id)) + 1,
      ...formData,
      image: formData.name.split(' ').map(n => n[0]).join(''),
      date: new Date().toISOString().split('T')[0]
    };
    setTestimonials([...testimonials, newTestimonial]);
    setShowAddModal(false);
    setFormData({ name: '', position: '', company: '', rating: 5, message: '', image: '' });
    setToast({
      message: 'Testimonial added successfully!',
      type: 'success'
    });
  };

  const submitEdit = () => {
    if (!formData.name.trim() || !formData.message.trim()) {
      setToast({
        message: 'Please fill in name and message fields',
        type: 'warning'
      });
      return;
    }
    setTestimonials(testimonials.map(t => t.id === selectedTestimonial.id ? { ...t, ...formData } : t));
    setShowEditModal(false);
    setSelectedTestimonial(null);
    setFormData({ name: '', position: '', company: '', rating: 5, message: '', image: '' });
    setToast({
      message: 'Testimonial updated successfully!',
      type: 'success'
    });
  };

  const confirmDelete = () => {
    setTestimonials(testimonials.filter(t => t.id !== selectedTestimonial.id));
    setShowDeleteModal(false);
    setSelectedTestimonial(null);
    setToast({
      message: 'Testimonial deleted successfully!',
      type: 'success'
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
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
          <h1 className="text-3xl font-bold text-gray-800">Testimonial Management</h1>
          <p className="text-gray-600 mt-2">Manage user testimonials and reviews</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddTestimonial}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-golden-500 to-golden-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Testimonial</span>
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
          />
        </div>
      </motion.div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-golden-500 to-golden-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {testimonial.image}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.position}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEditTestimonial(testimonial)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteTestimonial(testimonial)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="flex items-center space-x-1 mb-3">
              {renderStars(testimonial.rating)}
            </div>

            <p className="text-gray-700 mb-4">{testimonial.message}</p>

            <p className="text-xs text-gray-500">{testimonial.date}</p>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {showAddModal ? 'Add New Testimonial' : 'Edit Testimonial'}
                </h3>
                <button
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Position</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Enter position"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Enter company"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter testimonial message"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={showAddModal ? submitAdd : submitEdit}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-golden-500 to-golden-500 text-white rounded-lg font-medium hover:shadow-lg"
                >
                  {showAddModal ? 'Add Testimonial' : 'Update Testimonial'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
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
                <h3 className="text-2xl font-bold text-gray-800">Delete Testimonial</h3>
                <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this testimonial from <span className="font-semibold">{selectedTestimonial?.name}</span>?
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
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
