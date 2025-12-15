'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, Image, Eye, List, MessageCircle, Ban, Settings, Key, LogOut, Camera, LayoutDashboard, ShoppingCart, ImageIcon, ArrowLeft, ArrowRight, Clock, UserX, CheckCircle, XCircle, Send, Smile, Paperclip, Phone, Video, MoreVertical, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageProvider';
import { isAuthenticated } from '@/lib/auth-utils';
import api from '@/lib/api';
import { toast } from 'sonner';

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
  const [interestRequests, setInterestRequests] = useState<any[]>([]);
  const [myInterests, setMyInterests] = useState<any[]>([]);
  const [loadingInterests, setLoadingInterests] = useState(false);
  const [showInterestConfirmModal, setShowInterestConfirmModal] = useState(false);
  const [interestActionType, setInterestActionType] = useState<'accept' | 'decline'>('accept');
  const [selectedInterest, setSelectedInterest] = useState<{id: string; name: string} | null>(null);
  const [shortlist, setShortlist] = useState<any[]>([]);
  const [loadingShortlist, setLoadingShortlist] = useState(false);
  const [ignoredMembers, setIgnoredMembers] = useState([
    { id: 1, userId: 'user_201', name: t('NAME_KARAN_MEHTA'), age: 31, profession: t('MANAGER'), location: t('LOCATION_HYDERABAD'), ignoredDate: '10 Nov, 2024' },
    { id: 2, userId: 'user_202', name: t('NAME_ROHAN_GUPTA'), age: 28, profession: t('CONSULTANT'), location: t('LOCATION_KOLKATA'), ignoredDate: '05 Nov, 2024' },
  ]);
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
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    visibility: 'public',
    showProfileToAll: true,
    allowContact: true,
    showOnline: false
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingChange, setPendingChange] = useState<{
    setting: string;
    value: any;
    label: string;
  } | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    // Fetch real user profile data from API
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/profile/me');
        console.log('Dashboard Profile Response:', response.data);
        
        const data = response.data.data || response.data;
        console.log('Profile Data:', data);
        
        if (data) {
          // Extract first name from full name
          const firstName = data.name?.split(' ')[0] || data.name || 'User';
          console.log('Setting username to:', firstName);
          setUserName(firstName);
          setFormData(prev => ({ ...prev, name: data.name || '' }));
          
          // Set profile photo from uploaded images (first photo)
          if (data.profilePicture) {
            const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
            const photoUrl = data.profilePicture.startsWith('/') 
              ? `${API_URL}${data.profilePicture}` 
              : `${API_URL}/uploads/${data.profilePicture}`;
            console.log('Setting profile photo URL:', photoUrl);
            setProfilePhoto(photoUrl);
          } else {
            console.log('No profile picture in data');
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
        // Fallback to localStorage
        const name = localStorage.getItem('userName') || 'User';
        setUserName(name);
        setFormData(prev => ({ ...prev, name }));
      }
    };
    
    fetchUserProfile();
    
    const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    const savedGallery = localStorage.getItem('galleryImages');
    
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

  // Fetch sent interests (My Interests)
  useEffect(() => {
    if (activeMenu === 'MENU_MY_INTEREST') {
      const fetchSentInterests = async () => {
        setLoadingInterests(true);
        try {
          const response = await api.get('/interests/sent');
          if (response.data.success) {
            const interests = response.data.data || [];
            setMyInterests(interests);
          }
        } catch (error: any) {
          console.error('Error fetching sent interests:', error);
          toast.error('Failed to load sent interests');
        } finally {
          setLoadingInterests(false);
        }
      };
      fetchSentInterests();
    }
  }, [activeMenu]);

  // Fetch received interests function (reusable)
  const fetchReceivedInterests = async () => {
    setLoadingInterests(true);
    try {
      const response = await api.get('/interests/received');
      if (response.data.success) {
        const interests = response.data.data || [];
        // Filter to only show pending interests on frontend as well
        const pendingInterests = interests.filter((int: any) => int.status === 'pending');
        setInterestRequests(pendingInterests);
      }
    } catch (error: any) {
      console.error('Error fetching received interests:', error);
      toast.error('Failed to load interest requests');
    } finally {
      setLoadingInterests(false);
    }
  };

  // Fetch received interests (Interest Requests)
  useEffect(() => {
    if (activeMenu === 'MENU_INTEREST_REQUEST') {
      fetchReceivedInterests();
    }
  }, [activeMenu]);

  // Fetch shortlist
  useEffect(() => {
    if (activeMenu === 'MENU_SHORTLIST') {
      const fetchShortlist = async () => {
        setLoadingShortlist(true);
        try {
          const response = await api.get('/shortlist');
          if (response.data.success) {
            const shortlistData = response.data.data || [];
            setShortlist(shortlistData);
          }
        } catch (error: any) {
          console.error('Error fetching shortlist:', error);
          toast.error('Failed to load shortlist');
        } finally {
          setLoadingShortlist(false);
        }
      };
      fetchShortlist();
    }
  }, [activeMenu]);

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



  // Show confirmation modal before accept/decline
  const showInterestConfirmation = (interestId: string, userName: string, action: 'accept' | 'decline') => {
    setSelectedInterest({ id: interestId, name: userName });
    setInterestActionType(action);
    setShowInterestConfirmModal(true);
  };

  // Handle Accept Interest Request
  const handleAcceptInterest = async () => {
    if (!selectedInterest) return;
    
    try {
      const response = await api.put(`/interests/${selectedInterest.id}/accept`);
      if (response.data.success) {
        setShowInterestConfirmModal(false);
        toast.success(`You accepted ${selectedInterest.name}'s interest! 💕`);
        setSelectedInterest(null);
        // Refetch the list to ensure we only show pending interests
        await fetchReceivedInterests();
      }
    } catch (error: any) {
      console.error('Error accepting interest:', error);
      const errorMessage = error.response?.data?.message || 'Failed to accept interest';
      
      // If interest already processed, refetch the list
      if (errorMessage.includes('already accepted') || errorMessage.includes('already rejected')) {
        toast.info('This interest request has already been processed');
        await fetchReceivedInterests();
      } else {
        toast.error(errorMessage);
      }
      
      setShowInterestConfirmModal(false);
      setSelectedInterest(null);
    }
  };

  // Handle Decline Interest Request
  const handleDeclineInterest = async () => {
    if (!selectedInterest) return;
    
    try {
      const response = await api.put(`/interests/${selectedInterest.id}/reject`);
      if (response.data.success) {
        setShowInterestConfirmModal(false);
        toast.success(`You declined ${selectedInterest.name}'s interest request`);
        setSelectedInterest(null);
        // Refetch the list to ensure we only show pending interests
        await fetchReceivedInterests();
      }
    } catch (error: any) {
      console.error('Error declining interest:', error);
      const errorMessage = error.response?.data?.message || 'Failed to decline interest';
      
      // If interest already processed, refetch the list
      if (errorMessage.includes('already accepted') || errorMessage.includes('already rejected')) {
        toast.info('This interest request has already been processed');
        await fetchReceivedInterests();
      } else {
        toast.error(errorMessage);
      }
      
      setShowInterestConfirmModal(false);
      setSelectedInterest(null);
    }
  };

  // Handle Unignore Member
  const handleUnignoreMember = (userId: string, userName: string) => {
    // TODO: When backend is ready, call API: DELETE /api/users/ignored/${userId}
    setIgnoredMembers(prev => prev.filter(member => member.userId !== userId));
    toast.success(`${userName} has been unignored and can now contact you! ✨`);
  };

  // Handle Remove from Shortlist
  const handleRemoveFromShortlist = async (userId: string, userName: string) => {
    try {
      const response = await api.delete(`/shortlist/${userId}`);
      if (response.data.success) {
        setShortlist(prev => prev.filter(item => item.shortlistedUserId._id !== userId));
        toast.success(`${userName} removed from shortlist`);
      }
    } catch (error: any) {
      console.error('Error removing from shortlist:', error);
      toast.error(error.response?.data?.message || 'Failed to remove from shortlist');
    }
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

  // Privacy settings handlers
  const handlePrivacyChange = (setting: string, value: any, label: string) => {
    setPendingChange({ setting, value, label });
    setShowConfirmModal(true);
  };

  const confirmPrivacyChange = () => {
    if (pendingChange) {
      setPrivacySettings(prev => ({
        ...prev,
        [pendingChange.setting]: pendingChange.value
      }));
      showToast(`${pendingChange.label} updated successfully! ✓`, 'success');
    }
    setShowConfirmModal(false);
    setPendingChange(null);
  };

  const cancelPrivacyChange = () => {
    setShowConfirmModal(false);
    setPendingChange(null);
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
      {/* Privacy Settings Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && pendingChange && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={cancelPrivacyChange}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Settings className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                Confirm Privacy Change
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to change <span className="font-semibold text-purple-600">"{pendingChange.label}"</span>?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelPrivacyChange}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPrivacyChange}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
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
                  <input
                    id="profile-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    className="hidden"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{userName}</h3>
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

            {/* Quick Actions - Manage Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-golden-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-golden-200 mb-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-golden-500 to-golden-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      Manage Your Profile
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Update your information, upload photos, and edit your bio
                    </p>
                  </div>
                </div>
                <Link href="/my-profile">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-golden-500 to-golden-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    Manage Profile
                  </motion.button>
                </Link>
              </div>
            </motion.div>

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

            {/* Shortlist Section */}
            {activeMenu === 'MENU_SHORTLIST' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-pink-100"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-6">{t('MENU_SHORTLIST')}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Profiles you've added to your shortlist for easy access
                </p>

                {/* Loading State */}
                {loadingShortlist ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-golden-200 border-t-golden-600 rounded-full animate-spin" />
                  </div>
                ) : shortlist.length > 0 ? (
                  /* Shortlist Grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {shortlist.map((item, index) => {
                      const user = item.shortlistedUserId;
                      const calculateAge = (dob: string) => {
                        const birthDate = new Date(dob);
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff = today.getMonth() - birthDate.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                          age--;
                        }
                        return age;
                      };
                      const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                      const profilePhoto = user?.profilePicture 
                        ? (user.profilePicture.startsWith('/') 
                            ? `${API_URL}${user.profilePicture}` 
                            : `${API_URL}/uploads/${user.profilePicture}`)
                        : '/app/images/hand1.jpeg';
                      
                      return (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                          {/* Profile Image */}
                          <div className="relative h-64 bg-gray-200">
                            <img 
                              src={profilePhoto} 
                              alt={user?.name} 
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => handleRemoveFromShortlist(user?._id, user?.name || 'this user')}
                              className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-all group shadow-lg"
                            >
                              <Heart className="w-5 h-5 text-pink-500 fill-current group-hover:text-red-500 transition-colors" />
                            </button>
                          </div>

                          {/* Profile Info */}
                          <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{user?.name || 'Unknown'}</h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {user?.dateOfBirth && `${calculateAge(user.dateOfBirth)} years`}
                              {user?.profession && ` • ${user.profession}`}
                            </p>
                            <p className="text-sm text-gray-500 mb-4 truncate">
                              {user?.city && user?.state ? `${user.city}, ${user.state}` : (user?.city || user?.state || 'Location not specified')}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Link href={`/profile/${user?._id}`} className="flex-1">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="w-full bg-gradient-to-r from-golden-500 to-golden-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
                                >
                                  View Profile
                                </motion.button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-12 h-12 text-pink-300" />
                      </div>
                      <p className="text-gray-500 font-medium">No profiles in shortlist</p>
                      <p className="text-gray-400 text-sm mt-2">Start adding profiles you like to your shortlist</p>
                      <Link href="/members">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-4 bg-gradient-to-r from-golden-500 to-golden-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          Browse Members
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                )}
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

                {/* Loading State */}
                {loadingInterests ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-golden-200 border-t-golden-600 rounded-full animate-spin" />
                  </div>
                ) : myInterests.length > 0 ? (
                  /* Interest List */
                  <div className="space-y-3 sm:space-y-4">
                    {myInterests.map((interest, index) => {
                      const receiver = interest.receiverId;
                      const calculateAge = (dob: string) => {
                        const birthDate = new Date(dob);
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff = today.getMonth() - birthDate.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                          age--;
                        }
                        return age;
                      };
                      const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                      const profilePhoto = receiver?.profilePicture 
                        ? (receiver.profilePicture.startsWith('/') 
                            ? `${API_URL}${receiver.profilePicture}` 
                            : `${API_URL}/uploads/${receiver.profilePicture}`)
                        : '/app/images/hand1.jpeg';
                      
                      return (
                      <motion.div
                        key={interest._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-pink-50 to-white border border-pink-100 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                              <img src={profilePhoto} alt={receiver?.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">{receiver?.name || 'Unknown'}</h3>
                              <p className="text-gray-600 text-xs sm:text-sm truncate">
                                {receiver?.dateOfBirth && `${calculateAge(receiver.dateOfBirth)} years`}
                                {receiver?.profession && ` • ${receiver.profession}`}
                              </p>
                              <p className="text-gray-500 text-xs sm:text-sm truncate">
                                {receiver?.city && receiver?.state ? `${receiver.city}, ${receiver.state}` : (receiver?.city || receiver?.state || 'Location not specified')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                            <span className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${
                              interest.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              interest.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {interest.status === 'accepted' ? t('STATUS_ACCEPTED') :
                              interest.status === 'pending' ? t('STATUS_PENDING') :
                              t('STATUS_DECLINED')}
                            </span>
                            <Link href={`/profile/${receiver?._id}`}>
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
                    );
                  })}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-golden-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-12 h-12 text-golden-300" />
                      </div>
                      <p className="text-gray-500 font-medium">{t('NO_INTERESTS_SENT')}</p>
                      <p className="text-gray-400 text-sm mt-2">{t('START_BROWSING_MEMBERS')}</p>
                      <Link href="/members">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-4 bg-gradient-to-r from-golden-500 to-golden-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          Browse Members
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                )}
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

                {/* Loading State */}
                {loadingInterests ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-golden-200 border-t-golden-600 rounded-full animate-spin" />
                  </div>
                ) : interestRequests.length > 0 ? (
                  /* Request List */
                  <div className="space-y-3 sm:space-y-4">
                    {interestRequests.map((request, index) => {
                      const sender = request.senderId;
                      const calculateAge = (dob: string) => {
                        const birthDate = new Date(dob);
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff = today.getMonth() - birthDate.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                          age--;
                        }
                        return age;
                      };
                      const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                      const profilePhoto = sender?.profilePicture 
                        ? (sender.profilePicture.startsWith('/') 
                            ? `${API_URL}${sender.profilePicture}` 
                            : `${API_URL}/uploads/${sender.profilePicture}`)
                        : '/app/images/hand1.jpeg';
                      
                      const timeAgo = (date: string) => {
                        const now = new Date();
                        const createdDate = new Date(date);
                        const diffMs = now.getTime() - createdDate.getTime();
                        const diffMins = Math.floor(diffMs / 60000);
                        const diffHours = Math.floor(diffMs / 3600000);
                        const diffDays = Math.floor(diffMs / 86400000);
                        
                        if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
                        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
                      };
                      
                      return (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-golden-50 to-white border border-golden-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                          <img src={profilePhoto} alt={sender?.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">{sender?.name || 'Unknown'}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm truncate">
                            {sender?.dateOfBirth && `${calculateAge(sender.dateOfBirth)} years`}
                            {sender?.profession && ` • ${sender.profession}`}
                          </p>
                          <p className="text-gray-500 text-xs sm:text-sm truncate">
                            {sender?.city && sender?.state ? `${sender.city}, ${sender.state}` : (sender?.city || sender?.state || 'Location not specified')}
                          </p>
                          <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo(request.createdAt)}
                          </p>
                          {request.message && (
                            <p className="text-gray-600 text-sm mt-2 italic bg-white/50 p-2 rounded">"{request.message}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => showInterestConfirmation(request._id, sender?.name || 'this user', 'accept')}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {t('ACCEPT')}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => showInterestConfirmation(request._id, sender?.name || 'this user', 'decline')}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <XCircle className="w-4 h-4" />
                          {t('DECLINE')}
                        </motion.button>
                        <Link href={`/profile/${sender?._id}`} className="flex-1 sm:flex-none">
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
                      );
                    })}
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Privacy Settings</h2>

                {/* Privacy Settings */}
                <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t('PRIVACY_SETTINGS')}</h3>
                    <div className="space-y-4">
                      {/* Profile Visibility */}
                      <div>
                        <label className="block text-gray-700 font-medium mb-3 text-sm">Profile Visibility</label>
                        <div className="flex gap-4">
                          <label className="flex items-center cursor-pointer">
                            <input 
                              type="radio" 
                              name="visibility" 
                              value="public" 
                              checked={privacySettings.visibility === 'public'}
                              onChange={(e) => handlePrivacyChange('visibility', e.target.value, 'Profile Visibility to Public')}
                              className="w-4 h-4 text-golden-600 focus:ring-golden-500" 
                            />
                            <span className="ml-2 text-gray-700">Public</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input 
                              type="radio" 
                              name="visibility" 
                              value="private" 
                              checked={privacySettings.visibility === 'private'}
                              onChange={(e) => handlePrivacyChange('visibility', e.target.value, 'Profile Visibility to Private')}
                              className="w-4 h-4 text-golden-600 focus:ring-golden-500" 
                            />
                            <span className="ml-2 text-gray-700">Private</span>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Public profiles are visible to all members. Private profiles are only visible to accepted connections.</p>
                      </div>
                      
                      {/* Other Privacy Options */}
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-700">{t('SHOW_PROFILE_ALL')}</span>
                        <input 
                          type="checkbox" 
                          checked={privacySettings.showProfileToAll}
                          onChange={(e) => handlePrivacyChange('showProfileToAll', e.target.checked, 'Show my profile to all members')}
                          className="w-5 h-5 text-golden-600 rounded focus:ring-golden-500" 
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-700">{t('ALLOW_CONTACT')}</span>
                        <input 
                          type="checkbox" 
                          checked={privacySettings.allowContact}
                          onChange={(e) => handlePrivacyChange('allowContact', e.target.checked, 'Allow members to contact me')}
                          className="w-5 h-5 text-golden-600 rounded focus:ring-golden-500" 
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-700">{t('SHOW_ONLINE')}</span>
                        <input 
                          type="checkbox" 
                          checked={privacySettings.showOnline}
                          onChange={(e) => handlePrivacyChange('showOnline', e.target.checked, "Show when I'm online")}
                          className="w-5 h-5 text-golden-600 rounded focus:ring-golden-500" 
                        />
                      </label>
                    </div>
                  </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Interest Confirmation Modal */}
      <AnimatePresence>
        {showInterestConfirmModal && selectedInterest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInterestConfirmModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className={`p-6 ${interestActionType === 'accept' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {interestActionType === 'accept' ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <XCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {interestActionType === 'accept' ? 'Accept Interest' : 'Decline Interest'}
                    </h2>
                    <p className="text-white/90 text-sm">from {selectedInterest.name}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-gray-700 text-lg mb-6">
                  {interestActionType === 'accept' 
                    ? `Are you sure you want to accept the interest from ${selectedInterest.name}? They will be notified and you can start connecting.`
                    : `Are you sure you want to decline the interest from ${selectedInterest.name}? This action cannot be undone.`
                  }
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowInterestConfirmModal(false)}
                    className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={interestActionType === 'accept' ? handleAcceptInterest : handleDeclineInterest}
                    className={`flex-1 py-3 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                      interestActionType === 'accept' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-r from-red-500 to-rose-600'
                    }`}
                  >
                    {interestActionType === 'accept' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Accept
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        Decline
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
