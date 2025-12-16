'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Search, Upload, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Toast from '@/components/admin/Toast';
import BackButton from '@/components/admin/BackButton';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SuccessStoriesManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [formData, setFormData] = useState({
    coupleName: '',
    weddingDate: '',
    story: '',
    location: '',
    image: ''
  });

  const [stories, setStories] = useState<any[]>([]);

  // Fetch stories on component mount
  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/stories`);
      if (response.ok) {
        const data = await response.json();
        setStories(data);
      } else {
        throw new Error('Failed to fetch stories');
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      setToast({
        message: 'Failed to load stories',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStories = stories.filter(story =>
    story.coupleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStory = () => {
    setFormData({ coupleName: '', weddingDate: '', story: '', location: '', image: '' });
    setShowAddModal(true);
  };

  const handleEditStory = (story: any) => {
    setSelectedStory(story);
    setFormData({
      coupleName: story.coupleName,
      weddingDate: story.weddingDate,
      story: story.story,
      location: story.location,
      image: story.image
    });
    setShowEditModal(true);
  };

  const handleDeleteStory = (story: any) => {
    setSelectedStory(story);
    setShowDeleteModal(true);
  };

  const submitAdd = async () => {
    if (!formData.coupleName.trim() || !formData.story.trim()) {
      setToast({
        message: 'Please fill in couple name and story fields',
        type: 'warning'
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          image: formData.image || '💑'
        })
      });

      if (response.ok) {
        setShowAddModal(false);
        setFormData({ coupleName: '', weddingDate: '', story: '', location: '', image: '' });
        setToast({
          message: 'Success story added successfully!',
          type: 'success'
        });
        fetchStories();
      } else {
        throw new Error('Failed to add story');
      }
    } catch (error) {
      console.error('Error adding story:', error);
      setToast({
        message: 'Failed to add story',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const submitEdit = async () => {
    if (!formData.coupleName.trim() || !formData.story.trim()) {
      setToast({
        message: 'Please fill in couple name and story fields',
        type: 'warning'
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/stories/${selectedStory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedStory(null);
        setFormData({ coupleName: '', weddingDate: '', story: '', location: '', image: '' });
        setToast({
          message: 'Success story updated successfully!',
          type: 'success'
        });
        fetchStories();
      } else {
        throw new Error('Failed to update story');
      }
    } catch (error) {
      console.error('Error updating story:', error);
      setToast({
        message: 'Failed to update story',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/stories/${selectedStory._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setSelectedStory(null);
        setToast({
          message: 'Success story deleted successfully!',
          type: 'success'
        });
        fetchStories();
      } else {
        throw new Error('Failed to delete story');
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      setToast({
        message: 'Failed to delete story',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (storyId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/stories/${storyId}/toggle-featured`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setToast({
          message: data.story.featured ? 'Added to featured stories' : 'Removed from featured stories',
          type: 'info'
        });
        fetchStories();
      } else {
        throw new Error('Failed to toggle featured status');
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
      setToast({
        message: 'Failed to update featured status',
        type: 'error'
      });
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
          <h1 className="text-3xl font-bold text-gray-800">Success Stories Management</h1>
          <p className="text-gray-600 mt-2">Manage couple success stories</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddStory}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-golden-500 to-golden-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Story</span>
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
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
          />
        </div>
      </motion.div>

      {/* Stories Table */}
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Preview</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Couple</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Wedding Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Story</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-600">Loading stories...</td>
                </tr>
              )}
              {!loading && filteredStories.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-600">No stories found. Add your first story!</td>
                </tr>
              )}
              {filteredStories.map((story, index) => (
                <motion.tr
                  key={story._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-700">{index + 1}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-golden-500 to-golden-500 rounded-lg flex items-center justify-center text-3xl">
                      {story.image}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{story.coupleName}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{story.weddingDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{story.location}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 line-clamp-2 max-w-md">{story.story}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleFeatured(story._id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        story.featured
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {story.featured ? 'Featured' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditStory(story)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteStory(story)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                  {showAddModal ? 'Add New Story' : 'Edit Story'}
                </h3>
                <button
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Couple Name</label>
                  <input
                    type="text"
                    value={formData.coupleName}
                    onChange={(e) => setFormData({ ...formData, coupleName: e.target.value })}
                    placeholder="e.g., Emma & David"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Wedding Date</label>
                    <input
                      type="date"
                      value={formData.weddingDate}
                      onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., New York, USA"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Story</label>
                  <textarea
                    value={formData.story}
                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                    placeholder="Enter their love story..."
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Image Emoji (or upload placeholder)</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="💑 (Enter emoji)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    />
                    <button className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-golden-500 transition-colors">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Upload Image</span>
                    </button>
                  </div>
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
                  {showAddModal ? 'Add Story' : 'Update Story'}
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
                <h3 className="text-2xl font-bold text-gray-800">Delete Story</h3>
                <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the story of <span className="font-semibold">{selectedStory?.coupleName}</span>?
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
    </div>
  );
}
