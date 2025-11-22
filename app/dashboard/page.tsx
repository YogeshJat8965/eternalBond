'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, Image, Eye, List, MessageCircle, Ban, Settings, Key, LogOut, Camera, LayoutDashboard, ShoppingCart, ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [userName, setUserName] = useState('');
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
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
    
    setUserName(name);
    setFormData(prev => ({ ...prev, name }));
    
    // Show onboarding if not completed
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
  }, [router]);

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

  const stats = [
    { icon: Heart, label: 'Remaining Interests', value: '50', color: 'from-golden-400 to-golden-500', bgColor: 'bg-golden-50', textColor: 'text-golden-600' },
    { icon: Eye, label: 'Remaining Contact View', value: '20', color: 'from-orange-400 to-orange-500', bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
    { icon: ImageIcon, label: 'Remaining Image Upload', value: '20', color: 'from-green-400 to-green-500', bgColor: 'bg-green-50', textColor: 'text-green-600' },
    { icon: List, label: 'Total Shortlisted', value: '0', color: 'from-purple-400 to-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { icon: Heart, label: 'Interest Sent', value: '0', color: 'from-golden-400 to-rose-500', bgColor: 'bg-golden-50', textColor: 'text-golden-600' },
    { icon: Heart, label: 'Interest Requests', value: '0', color: 'from-amber-400 to-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-600' },
  ];

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: ShoppingCart, label: 'Purchase History' },
    { icon: ImageIcon, label: 'Gallery' },
    { icon: List, label: 'Shortlist' },
    { icon: Heart, label: 'My Interest' },
    { icon: Heart, label: 'Interest Request' },
    { icon: Ban, label: 'Ignored Lists' },
    { icon: MessageCircle, label: 'Message' },
    { icon: MessageCircle, label: 'Support Tickets' },
    { icon: Settings, label: 'Profile Setting' },
    { icon: Key, label: 'Change Password' },
    { icon: LogOut, label: 'Sign Out' },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-pink-50 to-white">
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
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h2>
                <p className="text-gray-600 mb-6">Step {onboardingStep} of 3</p>
                
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
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Basic Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
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
        <div className="flex flex-col lg:flex-row gap-8">
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
                  <div className="w-24 h-24 bg-gradient-to-br from-golden-400 to-golden-500 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-golden-500 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-600 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
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
                    key={item.label}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      setActiveMenu(item.label);
                      if (item.label === 'Sign Out') {
                        handleLogout();
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeMenu === item.label
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
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            </motion.div>

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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Package</h2>
              
              <div className="mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-golden-500 to-golden-500 bg-clip-text text-transparent mb-4">
                  Free
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">50 Express Interests</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">20 Contact View</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">20 Image Upload</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 mb-6">Package expiry date : 21 Dec, 2025</p>

              <Link href="/plans">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-golden-500 to-golden-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Upgrade Package
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Interests</h2>
              
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-golden-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-12 h-12 text-golden-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No interests yet</p>
                  <p className="text-gray-400 text-sm mt-2">Start browsing members to send interests</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
