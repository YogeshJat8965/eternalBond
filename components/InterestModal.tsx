'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Heart } from 'lucide-react';

interface InterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => Promise<void>;
  receiverName: string;
  loading?: boolean;
}

export default function InterestModal({ 
  isOpen, 
  onClose, 
  onSend, 
  receiverName,
  loading = false 
}: InterestModalProps) {
  const [message, setMessage] = useState('');
  const maxLength = 500;

  const handleSend = async () => {
    if (message.trim()) {
      await onSend(message.trim());
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMessage('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-golden-500 via-golden-600 to-amber-600 p-6 relative">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Send Interest</h2>
                    <p className="text-white/90 text-sm">to {receiverName}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Add a personal message (optional)
                </label>
                
                <textarea
                  value={message}
                  onChange={(e) => {
                    if (e.target.value.length <= maxLength) {
                      setMessage(e.target.value);
                    }
                  }}
                  placeholder="Introduce yourself and express why you're interested..."
                  disabled={loading}
                  className="w-full h-40 p-4 border-2 border-gray-200 rounded-2xl focus:border-golden-400 focus:ring-4 focus:ring-golden-100 transition-all resize-none text-gray-700 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-gray-500">
                    {message.length}/{maxLength} characters
                  </p>
                  {message.length >= maxLength && (
                    <p className="text-sm text-amber-600 font-medium">Maximum length reached</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    onClick={handleSend}
                    disabled={loading}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-golden-500 via-golden-600 to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Interest
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
