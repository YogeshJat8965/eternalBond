'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, Image, Eye, List, MessageCircle, Ban, Settings, Key, LogOut, Camera, LayoutDashboard, ShoppingCart, ImageIcon, ArrowLeft, ArrowRight, Clock, UserX, CheckCircle, XCircle, Send, Smile, Paperclip, Phone, Video, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageProvider';

/**
 * Dashboard Page Component
 * 
 * BACKEND INTEGRATION GUIDE:
 * 
 * 1. USER DATA:
 *    - Replace localStorage with API calls to fetch user data
 *    - API endpoint: GET /api/user/profile
 *    - Response should include: userName, userId, email, phone, etc.
 * 
 * 2. MY INTERESTS (Line ~728):
 *    - API endpoint: GET /api/interests/sent
 *    - Response format: Array of { id, userId, name, age, profession, location, status, photo }
 *    - userId is used for profile routing: /profile/{userId}
 *    - Status values: 'Pending', 'Accepted', 'Declined'
 * 
 * 3. INTEREST REQUESTS (Line ~801):
 *    - API endpoint: GET /api/interests/received
 *    - Response format: Array of { id, userId, name, age, profession, location, time, photo }
 *    - Accept/Decline actions should call: POST /api/interests/{id}/respond
 *    - Body: { action: 'accept' | 'decline' }
 * 
 * 4. IGNORED LISTS (Line ~864):
 *    - API endpoint: GET /api/users/ignored
 *    - Unignore action: DELETE /api/users/ignored/{userId}
 * 
 * 5. MESSAGES (Line ~915):
 *    - API endpoint: GET /api/messages/conversations
 *    - Response should include: id, userId, name, lastMessage, time, unread, online
 * 
 * 6. PURCHASE HISTORY (Line ~510):
 *    - API endpoint: GET /api/purchases/history
 *    - Response format: Array of purchase objects with transactionId, planName, etc.
 * 
 * 7. GALLERY (Line ~620):
 *    - Upload API: POST /api/gallery/upload (FormData with images)
 *    - Fetch images: GET /api/gallery/images
 *    - Delete image: DELETE /api/gallery/images/{imageId}
 * 
 * 8. PROFILE SETTINGS (Line ~995):
 *    - Fetch: GET /api/user/profile
 *    - Update: PUT /api/user/profile
 *    - Privacy settings: PATCH /api/user/privacy-settings
 */

export default function DashboardPage() {
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [activeMenu, setActiveMenu] = useState('MENU_DASHBOARD');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    '/app/images/hand1.jpeg',
    '/app/images/hand2.jpeg',
    '/app/images/hand3.jpeg',
  ]);
  const [interestRequests, setInterestRequests] = useState([
    { id: 1, userId: 'user_101', name: t('NAME_RAHUL_VERMA'), age: 28, profession: t('BUSINESS_ANALYST'), location: t('LOCATION_PUNE'), time: t('HOURS_AGO').replace('{hours}', '2'), photo: '/app/images/hand1.jpeg' },
    { id: 2, userId: 'user_102', name: t('NAME_AMIT_SINGH'), age: 29, profession: t('CIVIL_ENGINEER'), location: t('LOCATION_JAIPUR'), time: t('DAYS_AGO').replace('{days}', '1'), photo: '/app/images/hand2.jpeg' },
    { id: 3, userId: 'user_103', name: t('NAME_VIKRAM_JOSHI'), age: 30, profession: t('ARCHITECT'), location: t('LOCATION_CHENNAI'), time: t('DAYS_AGO').replace('{days}', '3'), photo: '/app/images/hand3.jpeg' },
  ]);
  const [ignoredMembers, setIgnoredMembers] = useState([
    { id: 1, userId: 'user_201', name: t('NAME_KARAN_MEHTA'), age: 31, profession: t('MANAGER'), location: t('LOCATION_HYDERABAD'), ignoredDate: '10 Nov, 2024' },
    { id: 2, userId: 'user_202', name: t('NAME_ROHAN_GUPTA'), age: 28, profession: t('CONSULTANT'), location: t('LOCATION_KOLKATA'), ignoredDate: '05 Nov, 2024' },
  ]);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversations, setConversations] = useState([
    { 
      id: 1, 
      userId: 'user_301',
      name: t('NAME_PRIYA_SHARMA'), 
      lastMessage: 'Thank you for accepting my interest!', 
      time: '10 mins ago', 
      unread: 2, 
      online: true,
      messages: [
        { id: 1, text: 'Hi! I saw your profile and I am interested', sender: 'them', time: '2:30 PM' },
        { id: 2, text: 'Hello! Thank you for your interest', sender: 'me', time: '2:35 PM' },
        { id: 3, text: 'Thank you for accepting my interest!', sender: 'them', time: '2:40 PM' },
      ]
    },
    { 
      id: 2, 
      userId: 'user_302',
      name: t('NAME_ANJALI_PATEL'), 
      lastMessage: 'Would love to know more about you', 
      time: '1 hour ago', 
      unread: 0, 
      online: false,
      messages: [
        { id: 1, text: 'Hi there!', sender: 'them', time: '1:00 PM' },
        { id: 2, text: 'Would love to know more about you', sender: 'them', time: '1:05 PM' },
      ]
    },
    { 
      id: 3, 
      userId: 'user_303',
      name: t('NAME_NEHA_REDDY'), 
      lastMessage: 'Looking forward to connecting', 
      time: '2 hours ago', 
      unread: 5, 
      online: true,
      messages: [
        { id: 1, text: 'Hello!', sender: 'them', time: '12:00 PM' },
        { id: 2, text: 'Looking forward to connecting', sender: 'them', time: '12:30 PM' },
      ]
    },
  ]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    education: '',
    partnerExpectation: ''
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user is registered
    const isRegistered = localStorage.getItem('isRegistered') === 'true';
    if (!isRegistered) {
      router.push('/login');
      return;
    }
    
    const name = localStorage.getItem('userName') || 'User';
    const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    const savedProfilePhoto = localStorage.getItem('profilePhoto');
    const savedGallery = localStorage.getItem('galleryImages');
    
    setUserName(name);
    setFormData(prev => ({ ...prev, name }));
    if (savedProfilePhoto) {
      setProfilePhoto(savedProfilePhoto);
    }
    
    // Load gallery images from localStorage
    if (savedGallery) {
      try {
        const galleryImages = JSON.parse(savedGallery);
        setUploadedImages(galleryImages);
      } catch (e) {
        console.error('Error loading gallery images:', e);
      }
    }
    
    // Show onboarding if not completed
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
  }, [router]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const handleLogout = () => {
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('userName');
    window.dispatchEvent(new Event('registrationComplete'));
    router.push('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const handleSkip = () => {
    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    // Save form data to localStorage
    if (formData.name) {
      localStorage.setItem('userName', formData.name);
      setUserName(formData.name);
    }
    localStorage.setItem('userPhone', formData.phone);
    localStorage.setItem('userEducation', formData.education);
    localStorage.setItem('userPartnerExpectation', formData.partnerExpectation);
    localStorage.setItem('onboardingComplete', 'true');
    setShowOnboarding(false);
  };

  // Toast notification handler
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Handle Accept Interest Request
  const handleAcceptInterest = (requestId: number, userName: string) => {
    // TODO: When backend is ready, call API: POST /api/interests/${requestId}/respond with { action: 'accept' }
    setInterestRequests(prev => prev.filter(req => req.id !== requestId));
    showToast(`You accepted ${userName}'s interest! 💕`, 'success');
  };

  // Handle Decline Interest Request
  const handleDeclineInterest = (requestId: number, userName: string) => {
    // TODO: When backend is ready, call API: POST /api/interests/${requestId}/respond with { action: 'decline' }
    setInterestRequests(prev => prev.filter(req => req.id !== requestId));
    showToast(`You declined ${userName}'s interest request`, 'info');
  };

  // Handle Unignore Member
  const handleUnignoreMember = (userId: string, userName: string) => {
    // TODO: When backend is ready, call API: DELETE /api/users/ignored/${userId}
    setIgnoredMembers(prev => prev.filter(member => member.userId !== userId));
    showToast(`${userName} has been unignored and can now contact you! ✨`, 'success');
  };

  // Handle Send Message
  const handleSendMessage = () => {
    if (!messageText.trim() || selectedChat === null) return;

    const currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedChat) {
        return {
          ...conv,
          messages: [...conv.messages, {
            id: conv.messages.length + 1,
            text: messageText,
            sender: 'me',
            time: currentTime
          }],
          lastMessage: messageText,
          time: 'Just now'
        };
      }
      return conv;
    }));

    setMessageText('');
    // TODO: When backend is ready, call API: POST /api/messages with { userId, message }
  };

  // Handle Select Chat
  const handleSelectChat = (chatId: number) => {
    setSelectedChat(chatId);
    // Mark messages as read
    setConversations(prev => prev.map(conv => 
      conv.id === chatId ? { ...conv, unread: 0 } : conv
    ));
  };

  // Handle Profile Photo Upload
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfilePhoto(imageData);
        localStorage.setItem('profilePhoto', imageData);
        showToast('Profile photo updated successfully! 📸', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Emoji Selection
  const handleEmojiSelect = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Common emojis for quick access
  const emojis = [
    '😊', '😂', '❤️', '😍', '👍', '🙏', '😘', '💕', 
    '😢', '😭', '😅', '🤗', '😇', '🥰', '💖', '✨',
    '🌹', '💐', '🎉', '🎊', '🙌', '👏', '💯', '🔥'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            const updatedImages = [...uploadedImages, ...newImages];
            setUploadedImages(updatedImages);
            // Save to localStorage
            localStorage.setItem('galleryImages', JSON.stringify(updatedImages));
            showToast(`${newImages.length} image(s) uploaded successfully! 📸`, 'success');
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    // Save to localStorage
    localStorage.setItem('galleryImages', JSON.stringify(updatedImages));
    showToast('Image deleted successfully! 🗑️', 'success');
  };

  const stats = [
    { icon: List, label: t('STATS_TOTAL_SHORTLISTED'), value: '0', color: 'from-purple-400 to-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { icon: Heart, label: t('STATS_INTEREST_SENT'), value: '0', color: 'from-golden-400 to-rose-500', bgColor: 'bg-golden-50', textColor: 'text-golden-600' },
    { icon: Heart, label: t('STATS_INTEREST_REQUESTS'), value: '0', color: 'from-amber-400 to-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-600' },
  ];

  const menuItems = [
    { icon: LayoutDashboard, key: 'MENU_DASHBOARD', label: t('MENU_DASHBOARD'), active: true },
    { icon: ShoppingCart, key: 'MENU_PURCHASE_HISTORY', label: t('MENU_PURCHASE_HISTORY') },
    { icon: ImageIcon, key: 'MENU_GALLERY', label: t('MENU_GALLERY') },
    { icon: List, key: 'MENU_SHORTLIST', label: t('MENU_SHORTLIST') },
    { icon: Heart, key: 'MENU_MY_INTEREST', label: t('MENU_MY_INTEREST') },
    { icon: Heart, key: 'MENU_INTEREST_REQUEST', label: t('MENU_INTEREST_REQUEST') },
    { icon: Ban, key: 'MENU_IGNORED_LISTS', label: t('MENU_IGNORED_LISTS') },
    { icon: MessageCircle, key: 'MENU_MESSAGE', label: t('MENU_MESSAGE') },
    { icon: Settings, key: 'MENU_PROFILE_SETTING', label: t('MENU_PROFILE_SETTING') },
    { icon: LogOut, key: 'MENU_SIGN_OUT', label: t('MENU_SIGN_OUT') },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-pink-50 to-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50"
          >
            <div className={`px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] ${
              toast.type === 'success' ? 'bg-green-500' :
              toast.type === 'error' ? 'bg-red-500' :
              'bg-blue-500'
            }`}>
              {toast.type === 'success' && (
                <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
              )}
              {toast.type === 'error' && (
                <XCircle className="w-6 h-6 text-white flex-shrink-0" />
              )}
              {toast.type === 'info' && (
                <svg className="w-6 h-6 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
              <p className="text-white font-semibold">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Progress Bar */}
              <div className="p-8 pb-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('COMPLETE_YOUR_PROFILE')}</h2>
                <p className="text-gray-600 mb-6">{t('STEP_OF').replace('{step}', onboardingStep.toString()).replace('{total}', '3')}</p>
                
                <div className="flex gap-2 mb-8">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        step <= onboardingStep
                          ? 'bg-gradient-to-r from-golden-500 to-golden-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Step 1: Basic Details */}
                {onboardingStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('BASIC_DETAILS')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          {t('FULL_NAME')} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={t('ENTER_YOUR_FULL_NAME')}
                          className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          {t('PHONE_NUMBER')} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={t('ENTER_YOUR_PHONE_NUMBER')}
                          className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Education */}
                {onboardingStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Education</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Educational Qualification
                        </label>
                        <input
                          type="text"
                          name="education"
                          value={formData.education}
                          onChange={handleInputChange}
                          placeholder="E.g., Bachelor's in Computer Science"
                          className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Partner Expectation */}
                {onboardingStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Partner Expectation</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          What are you looking for in a partner?
                        </label>
                        <textarea
                          name="partnerExpectation"
                          value={formData.partnerExpectation}
                          onChange={handleInputChange}
                          placeholder="Describe your ideal partner..."
                          rows={5}
                          className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBack}
                    disabled={onboardingStep === 1}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                      onboardingStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSkip}
                    className="flex-1 py-3 rounded-lg font-semibold bg-golden-100 text-golden-600 hover:bg-golden-200 transition-all"
                  >
                    Skip
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold bg-gradient-to-r from-golden-500 to-golden-500 text-white hover:shadow-lg transition-all"
                  >
                    {onboardingStep === 3 ? 'Complete' : 'Next'}
                    {onboardingStep < 3 && <ArrowRight className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:justify-center">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-80 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
              {/* Profile Section */}
              <div className="text-center mb-6 pb-6 border-b border-pink-100">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-golden-400 to-golden-500 rounded-full flex items-center justify-center overflow-hidden">
                    {profilePhoto ? (
                      <img 
                        src={profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <label 
                    htmlFor="profile-photo-upload"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-golden-500 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-600 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </label>
                  <input
                    id="profile-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    className="hidden"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{userName}</h3>
                <p className="text-sm text-gray-600 mb-3">ID : 43723062</p>
                <Link href="/profile">
                  <button className="w-full bg-golden-50 text-rose-500 py-2 rounded-lg font-medium hover:bg-golden-100 transition-colors">
                    Public Profile
                  </button>
                </Link>
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.key}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      setActiveMenu(item.key);
                      if (item.key === 'MENU_SIGN_OUT') {
                        handleLogout();
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeMenu === item.key
                        ? 'bg-golden-50 text-rose-500'
                        : 'text-gray-600 hover:bg-golden-50 hover:text-rose-500'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 lg:max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {t(activeMenu)}
              </h1>
            </motion.div>

            {/* Dashboard Content */}
            {activeMenu === 'MENU_DASHBOARD' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className={`text-4xl font-bold ${stat.textColor} mb-2`}>
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Current Package Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('CURRENT_PACKAGE')}</h2>
              
              <div className="mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-golden-500 to-golden-500 bg-clip-text text-transparent mb-4">
                  {t('PLAN_FREE_NAME')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">{t('EXPRESS_INTERESTS').replace('{count}', '50')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">{t('CONTACT_VIEW').replace('{count}', '20')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">{t('IMAGE_UPLOAD').replace('{count}', '20')}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 mb-6">{t('PACKAGE_EXPIRY_DATE').replace('{date}', '21 Dec, 2025')}</p>

              <Link href="/plans">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-golden-500 to-golden-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  {t('UPGRADE_PACKAGE')}
                </motion.button>
              </Link>
            </motion.div>

            {/* Latest Interests Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('LATEST_INTERESTS')}</h2>
              
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-golden-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-12 h-12 text-golden-300" />
                  </div>
                  <p className="text-gray-500 font-medium">{t('NO_INTERESTS_YET')}</p>
                  <p className="text-gray-400 text-sm mt-2">{t('START_BROWSING_MEMBERS')}</p>
                </div>
              </div>
            </motion.div>
              </>
            )}

            {/* Purchase History Section */}
            {activeMenu === 'MENU_PURCHASE_HISTORY' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('MENU_PURCHASE_HISTORY')}</h2>
                
                {/* Purchase Records */}
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      planName: t('GOLD_PLAN'),
                      amount: '₹4,999',
                      purchaseDate: '15 Dec, 2024',
                      purchaseTime: '10:30 AM',
                      transactionId: 'TXN1234567890',
                      status: 'Active',
                      duration: '3 Months',
                      features: [t('FEATURE_EXPRESS_INTERESTS_100'), t('FEATURE_CONTACT_VIEWS_50'), t('FEATURE_UNLIMITED_IMAGE_UPLOAD')]
                    },
                    {
                      id: 2,
                      planName: t('SILVER_PLAN'),
                      amount: '₹2,999',
                      purchaseDate: '10 Sep, 2024',
                      purchaseTime: '02:15 PM',
                      transactionId: 'TXN0987654321',
                      status: 'Expired',
                      duration: '1 Month',
                      features: [t('FEATURE_EXPRESS_INTERESTS_50'), t('FEATURE_CONTACT_VIEWS_25'), t('FEATURE_IMAGE_UPLOAD_50')]
                    }
                  ].map((purchase) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: purchase.id * 0.1 }}
                      className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {purchase.planName}
                          </h3>
                          <p className="text-gray-600 text-sm">{t('DURATION')}: {purchase.duration}</p>
                        </div>
                        <div className="mt-3 lg:mt-0">
                          <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                            purchase.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {purchase.status === 'Active' ? t('ACTIVE') : t('EXPIRED')}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">{t('PURCHASE_DATE')}</p>
                          <p className="text-gray-800 font-semibold">{purchase.purchaseDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('PURCHASE_TIME')}</p>
                          <p className="text-gray-800 font-semibold">{purchase.purchaseTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('TRANSACTION_ID')}</p>
                          <p className="text-gray-800 font-semibold">{purchase.transactionId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('AMOUNT_PAID')}</p>
                          <p className="text-gray-800 font-semibold text-lg">{purchase.amount}</p>
                        </div>
                      </div>

                      <div className="border-t border-pink-100 pt-4">
                        <p className="text-sm text-gray-500 mb-2">{t('FEATURES_INCLUDED')}</p>
                        <div className="space-y-2">
                          {purchase.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-gray-600 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Upgrade Plan Button */}
                <div className="mt-8 text-center">
                  <Link href="/plans">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-golden-500 to-golden-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {t('UPGRADE_PACKAGE')}
                    </motion.button>
                  </Link>
                </div>

                {/* Empty State - if no purchases */}
                {/* Uncomment this if you want to show empty state when there are no purchases
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-golden-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-12 h-12 text-golden-300" />
                    </div>
                    <p className="text-gray-500 font-medium">{t('NO_PURCHASE_HISTORY')}</p>
                    <p className="text-gray-400 text-sm mt-2">{t('NO_PURCHASES_YET')}</p>
                  </div>
                </div>
                */}
              </motion.div>
            )}

            {/* Gallery Section */}
            {activeMenu === 'MENU_GALLERY' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{t('MY_GALLERY')}</h2>
                  <label htmlFor="image-upload">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-golden-500 to-golden-500 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      {t('UPLOAD_IMAGES')}
                    </motion.div>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <p className="text-gray-600 mb-6">
                  {t('YOU_HAVE_UPLOADED')} <span className="font-bold text-golden-600">{uploadedImages.length}</span> {t('IMAGES')}. 
                  {t('REMAINING_UPLOADS')}: <span className="font-bold text-green-600">20</span>
                </p>

                {/* Image Grid */}
                {uploadedImages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {uploadedImages.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative group rounded-xl overflow-hidden shadow-lg border border-pink-100 bg-gradient-to-br from-pink-50 to-white"
                      >
                        <div className="aspect-square relative">
                          <img
                            src={image}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => window.open(image, '_blank')}
                              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-golden-50 transition-colors"
                            >
                              <Eye className="w-5 h-5 text-gray-800" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteImage(index)}
                              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                            >
                              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                        
                        {/* Image number badge */}
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-xs font-semibold text-gray-800">#{index + 1}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-golden-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-12 h-12 text-golden-300" />
                      </div>
                      <p className="text-gray-500 font-medium">{t('NO_IMAGES_UPLOADED')}</p>
                      <p className="text-gray-400 text-sm mt-2">{t('CLICK_UPLOAD_IMAGES')}</p>
                    </div>
                  </div>
                )}

                {/* Upload Guidelines */}
                <div className="mt-8 bg-gradient-to-r from-golden-50 to-pink-50 rounded-xl p-6 border border-golden-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-golden-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {t('UPLOAD_GUIDELINES')}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-golden-600 font-bold">•</span>
                      <span>{t('GUIDELINE_CLEAR_PHOTOS')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-golden-600 font-bold">•</span>
                      <span>{t('GUIDELINE_FORMATS')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-golden-600 font-bold">•</span>
                      <span>{t('GUIDELINE_AVOID')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-golden-600 font-bold">•</span>
                      <span>{t('GUIDELINE_VISIBILITY')}</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* My Interest Section */}
            {activeMenu === 'MENU_MY_INTEREST' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-pink-100"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-6">{t('MY_INTERESTS')}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  {t('INTERESTS_SENT_DESC')}
                </p>

                {/* Interest List */}
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { id: 1, userId: 'user_001', name: t('NAME_PRIYA_SHARMA'), age: 26, profession: t('SOFTWARE_ENGINEER'), location: t('LOCATION_MUMBAI'), status: 'Pending', photo: '/app/images/hand1.jpeg' },
                    { id: 2, userId: 'user_002', name: t('NAME_ANJALI_PATEL'), age: 25, profession: t('DOCTOR'), location: t('LOCATION_DELHI'), status: 'Accepted', photo: '/app/images/hand2.jpeg' },
                    { id: 3, userId: 'user_003', name: t('NAME_SNEHA_KUMAR'), age: 27, profession: t('TEACHER'), location: t('LOCATION_BANGALORE'), status: 'Declined', photo: '/app/images/hand3.jpeg' },
                  ].map((interest, index) => (
                    <motion.div
                      key={interest.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-pink-50 to-white border border-pink-100 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-golden-400 to-golden-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">{interest.name}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm truncate">{t('AGE_YEARS').replace('{age}', String(interest.age))} • {interest.profession}</p>
                            <p className="text-gray-500 text-xs sm:text-sm truncate">{interest.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                          <span className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${
                            interest.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                            interest.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {interest.status === 'Accepted' ? t('STATUS_ACCEPTED') :
                            interest.status === 'Pending' ? t('STATUS_PENDING') :
                            t('STATUS_DECLINED')}
                          </span>
                          <Link href={`/profile/${interest.userId}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-golden-600 hover:text-golden-700 text-xs sm:text-sm font-medium underline whitespace-nowrap"
                            >
                              {t('VIEW_PROFILE')}
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Empty State */}
                {/* Uncomment if no interests sent
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-golden-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-12 h-12 text-golden-300" />
                    </div>
                    <p className="text-gray-500 font-medium">{t('NO_INTERESTS_SENT')}</p>
                    <p className="text-gray-400 text-sm mt-2">{t('START_BROWSING_MEMBERS')}</p>
                  </div>
                </div>
                */}
              </motion.div>
            )}

            {/* Interest Request Section */}
            {activeMenu === 'MENU_INTEREST_REQUEST' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-pink-100"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-6">{t('INTEREST_REQUESTS')}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  {t('INTEREST_REQUESTS_DESC')}
                </p>

                {/* Request List */}
                {interestRequests.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {interestRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-golden-50 to-white border border-golden-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-golden-400 to-golden-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">{request.name}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm truncate">{t('AGE_YEARS').replace('{age}', String(request.age))} • {request.profession}</p>
                          <p className="text-gray-500 text-xs sm:text-sm truncate">{request.location}</p>
                          <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {request.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAcceptInterest(request.id, request.name)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {t('ACCEPT')}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDeclineInterest(request.id, request.name)}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <XCircle className="w-4 h-4" />
                          {t('DECLINE')}
                        </motion.button>
                        <Link href={`/profile/${request.userId}`} className="flex-1 sm:flex-none">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-4 sm:px-6 bg-golden-100 text-golden-700 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-golden-200 transition-all text-sm sm:text-base"
                          >
                            {t('VIEW_PROFILE')}
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
                ) : (
                  <div className="flex items-center justify-center py-8 sm:py-12">
                    <div className="text-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-golden-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-golden-300" />
                      </div>
                      <p className="text-gray-500 font-medium text-sm sm:text-base">{t('NO_INTEREST_REQUESTS')}</p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-2">{t('NO_INTEREST_REQUESTS_DESC')}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Ignored Lists Section */}
            {activeMenu === 'MENU_IGNORED_LISTS' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-pink-100"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-6">{t('IGNORED_MEMBERS')}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  {t('IGNORED_MEMBERS_DESC')}
                </p>

                {/* Ignored List */}
                {ignoredMembers.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {ignoredMembers.map((ignored, index) => (
                      <motion.div
                        key={ignored.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <UserX className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">{ignored.name}</h3>
                              <p className="text-gray-600 text-xs sm:text-sm truncate">{t('AGE_YEARS').replace('{age}', String(ignored.age))} • {ignored.profession}</p>
                              <p className="text-gray-500 text-xs sm:text-sm truncate">{ignored.location}</p>
                              <p className="text-gray-400 text-xs mt-1">{t('IGNORED_ON').replace('{date}', ignored.ignoredDate)}</p>
                            </div>
                          </div>
                          <div className="w-full sm:w-auto">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleUnignoreMember(ignored.userId, ignored.name)}
                              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-golden-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
                            >
                              {t('UNIGNORE')}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 sm:py-12">
                    <div className="text-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ban className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium text-sm sm:text-base">{t('NO_IGNORED_MEMBERS')}</p>
                      <p className="text-gray-400 text-sm mt-2">{t('NO_IGNORED_DESC')}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Message Section - WhatsApp-like Interface */}
            {activeMenu === 'MENU_MESSAGE' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden"
                style={{ height: '600px' }}
              >
                <div className="flex h-full">
                  {/* Left Sidebar - Chat List */}
                  <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 border-r border-pink-100`}>
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-golden-500 to-golden-600 text-white">
                      <h2 className="text-xl font-bold">{t('MESSAGES')}</h2>
                      <p className="text-sm text-golden-100">{t('YOUR_CONVERSATIONS')}</p>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto">
                      {conversations.map((conversation) => (
                        <motion.div
                          key={conversation.id}
                          whileHover={{ backgroundColor: '#FFF9E7' }}
                          onClick={() => handleSelectChat(conversation.id)}
                          className={`p-4 border-b border-pink-100 cursor-pointer transition-all ${
                            selectedChat === conversation.id ? 'bg-golden-50' : 'bg-white hover:bg-golden-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-golden-400 to-golden-500 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              {conversation.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-gray-800 truncate">{conversation.name}</h3>
                                <span className="text-xs text-gray-500">{conversation.time}</span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                            </div>
                            {conversation.unread > 0 && (
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">{conversation.unread}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Chat Window */}
                  <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
                    {selectedChat ? (
                      <>
                        {/* Chat Header */}
                        <div className="p-4 bg-gradient-to-r from-golden-500 to-golden-600 text-white flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedChat(null)}
                              className="md:hidden mr-2"
                            >
                              <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="relative">
                              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              {conversations.find(c => c.id === selectedChat)?.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-golden-600 rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold">{conversations.find(c => c.id === selectedChat)?.name}</h3>
                              <p className="text-xs text-golden-100">
                                {conversations.find(c => c.id === selectedChat)?.online ? t('ONLINE') : t('OFFLINE')}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-pink-50/30 to-white space-y-4">
                          {conversations.find(c => c.id === selectedChat)?.messages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                                <div
                                  className={`rounded-2xl px-4 py-2 ${
                                    msg.sender === 'me'
                                      ? 'bg-golden-500 text-white rounded-br-none'
                                      : 'bg-white border border-pink-100 text-gray-800 rounded-bl-none'
                                  }`}
                                >
                                  <p className="text-sm">{msg.text}</p>
                                  <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-golden-100' : 'text-gray-400'}`}>
                                    {msg.time}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-white border-t border-pink-100">
                          <div className="flex items-center gap-2 relative">
                            <div className="relative emoji-picker-container">
                              <button 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="p-2 hover:bg-golden-50 rounded-full transition-colors"
                              >
                                <Smile className="w-5 h-5 text-gray-500" />
                              </button>
                              
                              {/* Emoji Picker */}
                              {showEmojiPicker && (
                                <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-pink-200 p-3 z-50">
                                  <div className="grid grid-cols-8 gap-2 w-64">
                                    {emojis.map((emoji, index) => (
                                      <button
                                        key={index}
                                        onClick={() => handleEmojiSelect(emoji)}
                                        className="text-2xl hover:bg-golden-50 rounded p-1 transition-colors"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <input
                              type="text"
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              placeholder={t('TYPE_MESSAGE')}
                              className="flex-1 px-4 py-3 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleSendMessage}
                              className="p-3 bg-gradient-to-r from-golden-500 to-golden-600 text-white rounded-full hover:shadow-lg transition-all"
                            >
                              <Send className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-pink-50/30 to-white">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-golden-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-12 h-12 text-golden-400" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{t('SELECT_CONVERSATION')}</h3>
                          <p className="text-gray-500">{t('CHOOSE_CHAT')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Profile Setting Section */}
            {activeMenu === 'MENU_PROFILE_SETTING' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('PROFILE_SETTINGS')}</h2>
                <p className="text-gray-600 mb-6">
                  {t('MANAGE_PROFILE_DESC')}
                </p>

                {/* Settings Form */}
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gradient-to-r from-pink-50 to-white border border-pink-100 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-golden-600" />
                      {t('PERSONAL_INFORMATION')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">{t('FULL_NAME')}</label>
                        <input
                          type="text"
                          defaultValue={userName}
                          className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">{t('EMAIL')}</label>
                        <input
                          type="email"
                          placeholder={t('PLACEHOLDER_EMAIL')}
                          className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">{t('PHONE_NUMBER')}</label>
                        <input
                          type="tel"
                          placeholder={t('PLACEHOLDER_PHONE')}
                          className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">{t('DATE_OF_BIRTH')}</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="bg-gradient-to-r from-golden-50 to-white border border-golden-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-golden-600" />
                      {t('PROFESSIONAL_DETAILS')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">{t('OCCUPATION')}</label>
                        <input
                          type="text"
                          placeholder={t('PLACEHOLDER_OCCUPATION')}
                          className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">{t('ANNUAL_INCOME')}</label>
                        <input
                          type="text"
                          placeholder={t('PLACEHOLDER_INCOME')}
                          className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">{t('EDUCATION')}</label>
                        <input
                          type="text"
                          placeholder={t('PLACEHOLDER_EDUCATION')}
                          className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">{t('COMPANY')}</label>
                        <input
                          type="text"
                          placeholder={t('PLACEHOLDER_COMPANY')}
                          className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Personal & Physical Details */}
                  <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      Personal & Physical Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">Caste</label>
                        <input
                          type="text"
                          placeholder="Enter Caste"
                          className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">Sub Caste</label>
                        <input
                          type="text"
                          placeholder="Enter Sub Caste"
                          className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">Annual Income (₹)</label>
                        <input
                          type="text"
                          placeholder="e.g., 5,00,000"
                          className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">Height</label>
                        <select className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent">
                          <option value="">Select Height</option>
                          <option value="4.5">4'5" (135 cm)</option>
                          <option value="4.6">4'6" (137 cm)</option>
                          <option value="4.7">4'7" (140 cm)</option>
                          <option value="4.8">4'8" (142 cm)</option>
                          <option value="4.9">4'9" (145 cm)</option>
                          <option value="4.10">4'10" (147 cm)</option>
                          <option value="4.11">4'11" (150 cm)</option>
                          <option value="5.0">5'0" (152 cm)</option>
                          <option value="5.1">5'1" (155 cm)</option>
                          <option value="5.2">5'2" (157 cm)</option>
                          <option value="5.3">5'3" (160 cm)</option>
                          <option value="5.4">5'4" (163 cm)</option>
                          <option value="5.5">5'5" (165 cm)</option>
                          <option value="5.6">5'6" (168 cm)</option>
                          <option value="5.7">5'7" (170 cm)</option>
                          <option value="5.8">5'8" (173 cm)</option>
                          <option value="5.9">5'9" (175 cm)</option>
                          <option value="5.10">5'10" (178 cm)</option>
                          <option value="5.11">5'11" (180 cm)</option>
                          <option value="6.0">6'0" (183 cm)</option>
                          <option value="6.1">6'1" (185 cm)</option>
                          <option value="6.2">6'2" (188 cm)</option>
                          <option value="6.3">6'3" (191 cm)</option>
                          <option value="6.4">6'4" (193 cm)</option>
                          <option value="6.5">6'5" (196 cm)</option>
                          <option value="6.6">6'6" (198 cm)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">Complexion</label>
                        <select className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent">
                          <option value="">Select Complexion</option>
                          <option value="fair">Fair</option>
                          <option value="wheatish">Wheatish</option>
                          <option value="medium">Medium</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">Food Habits</label>
                        <select className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent">
                          <option value="">Select Food Habit</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="non-vegetarian">Non-Vegetarian</option>
                          <option value="eggetarian">Eggetarian</option>
                          <option value="vegan">Vegan</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* About Me */}
                  <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t('ABOUT_ME')}</h3>
                    <textarea
                      rows={5}
                      placeholder={t('TELL_ABOUT_YOURSELF')}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t('PRIVACY_SETTINGS')}</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-700">{t('SHOW_PROFILE_ALL')}</span>
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-golden-600 rounded focus:ring-golden-500" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-700">{t('ALLOW_CONTACT')}</span>
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-golden-600 rounded focus:ring-golden-500" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-700">{t('SHOW_ONLINE')}</span>
                        <input type="checkbox" className="w-5 h-5 text-golden-600 rounded focus:ring-golden-500" />
                      </label>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="bg-gradient-to-r from-red-50 to-white border border-red-100 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Key className="w-5 h-5 text-red-600" />
                      {t('CHANGE_PASSWORD')}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">{t('CURRENT_PASSWORD')}</label>
                        <input
                          type="password"
                          placeholder={t('ENTER_CURRENT_PASSWORD')}
                          className="w-full px-4 py-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">{t('NEW_PASSWORD')}</label>
                        <input
                          type="password"
                          placeholder={t('ENTER_NEW_PASSWORD')}
                          className="w-full px-4 py-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">{t('CONFIRM_NEW_PASSWORD')}</label>
                        <input
                          type="password"
                          placeholder={t('REENTER_NEW_PASSWORD')}
                          className="w-full px-4 py-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        {t('UPDATE_PASSWORD')}
                      </motion.button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-golden-500 to-golden-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      {t('SAVE_CHANGES')}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                    >
                      {t('CANCEL')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
