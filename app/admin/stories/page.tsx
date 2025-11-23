'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Search, Upload, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Toast from '@/components/admin/Toast';
import BackButton from '@/components/admin/BackButton';

export default function SuccessStoriesManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [formData, setFormData] = useState({
    coupleName: '',
    weddingDate: '',
    story: '',
    location: '',
    image: ''
  });

  const [stories, setStories] = useState([
    { id: 1, coupleName: 'Emma & David', weddingDate: '2024-06-15', story: 'We met on KalyanautsavaMat and instantly connected. After 6 months of wonderful conversations, we knew we were meant for each other. Our wedding was a dream come true!', location: 'New York, USA', image: '💑', featured: true },
    { id: 2, coupleName: 'Sophia & Ryan', weddingDate: '2024-08-20', story: 'KalyanautsavaMat helped us find each other despite living in different cities. The matching algorithm was spot on! We are now happily married and planning our future together.', location: 'Los Angeles, USA', image: '💕', featured: true },
    { id: 3, coupleName: 'Michael & Priya', weddingDate: '2024-05-10', story: 'A cross-cultural love story made possible by KalyanautsavaMat. We overcame all barriers and celebrated our love with family and friends from both sides.', location: 'London, UK', image: '💖', featured: false },
    { id: 4, coupleName: 'James & Maria', weddingDate: '2024-09-03', story: 'After years of unsuccessful searching, KalyanautsavaMat brought us together. We connected on so many levels and our relationship blossomed naturally.', location: 'Chicago, USA', image: '❤️', featured: false },
    { id: 5, coupleName: 'Alex & Sarah', weddingDate: '2024-07-12', story: 'We were both skeptical about online matrimonial sites, but KalyanautsavaMat changed our perspective. Found my soulmate and best friend for life!', location: 'Toronto, Canada', image: '💗', featured: true },
  ]);

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

  const submitAdd = () => {
    if (!formData.coupleName.trim() || !formData.story.trim()) {
      setToast({
        message: 'Please fill in couple name and story fields',
        type: 'warning'
      });
      return;
    }
    const newStory = {
      id: Math.max(...stories.map(s => s.id)) + 1,
      ...formData,
      image: formData.image || '💑',
      featured: false
    };
    setStories([...stories, newStory]);
    setShowAddModal(false);
    setFormData({ coupleName: '', weddingDate: '', story: '', location: '', image: '' });
    setToast({
      message: 'Success story added successfully!',
      type: 'success'
    });
  };

  const submitEdit = () => {
    if (!formData.coupleName.trim() || !formData.story.trim()) {
      setToast({
        message: 'Please fill in couple name and story fields',
        type: 'warning'
      });
      return;
    }
    setStories(stories.map(s => s.id === selectedStory.id ? { ...s, ...formData } : s));
    setShowEditModal(false);
    setSelectedStory(null);
    setFormData({ coupleName: '', weddingDate: '', story: '', location: '', image: '' });
    setToast({
      message: 'Success story updated successfully!',
      type: 'success'
    });
  };

  const confirmDelete = () => {
    setStories(stories.filter(s => s.id !== selectedStory.id));
    setShowDeleteModal(false);
    setSelectedStory(null);
    setToast({
      message: 'Success story deleted successfully!',
      type: 'success'
    });
  };

  const toggleFeatured = (storyId: number) => {
    setStories(stories.map(s => s.id === storyId ? { ...s, featured: !s.featured } : s));
    const story = stories.find(s => s.id === storyId);
    setToast({
      message: story?.featured ? 'Removed from featured stories' : 'Added to featured stories',
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
              {filteredStories.map((story, index) => (
                <motion.tr
                  key={story.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                      onClick={() => toggleFeatured(story.id)}
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
  );
}
