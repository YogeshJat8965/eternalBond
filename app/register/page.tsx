'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Heart, ArrowRight, ArrowLeft, Check, Sparkles, Phone, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PetalAnimation from '@/components/animations/PetalAnimation';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/context/LanguageProvider';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { isAuthenticated } from '@/lib/auth-utils';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/members');
    }
  }, [router]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    city: '',
    height: '',
    maritalStatus: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.height) {
      newErrors.height = 'Height is required';
    }
    if (!formData.maritalStatus) {
      newErrors.maritalStatus = 'Marital status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        city: formData.city,
        height: formData.height,
        maritalStatus: formData.maritalStatus,
      });
      
      // Show success animation
      setShowSuccess(true);
      
      toast.success('Registration successful! Please check your email to verify your account.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('=== Registration Error Debug Info ===');
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error code:', error.code);
      
      // Get detailed error information
      const errorMessage = error.response?.data?.message || '';
      const errorDetails = error.response?.data?.errors;
      const statusCode = error.response?.status;
      
      // Handle specific error cases with detailed messages
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        // Network error - backend not running
        toast.error('🔌 Cannot connect to server. Please ensure the backend is running on http://localhost:5000');
        console.error('💡 Solution: Start the backend server with "npm start" in the backend directory');
        
      } else if (statusCode === 400) {
        // Bad request - validation errors
        if (errorMessage.toLowerCase().includes('already exists') || 
            errorMessage.toLowerCase().includes('already registered') ||
            errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('phone')) {
          toast.error('🚫 User with this email or phone already exists!\n\nPlease:\n• Login if you already have an account\n• Use a different email/phone number');
          
        } else if (errorMessage.toLowerCase().includes('required')) {
          // Missing required fields
          toast.error(`❌ Missing Required Information\n\n${errorMessage}\n\nPlease fill all required fields and try again.`);
          
        } else if (errorMessage.toLowerCase().includes('invalid email')) {
          toast.error('📧 Invalid Email Format\n\nPlease enter a valid email address (e.g., user@example.com)');
          
        } else if (errorMessage.toLowerCase().includes('password')) {
          toast.error(`🔒 Password Issue\n\n${errorMessage}\n\nPassword must be at least 8 characters long.`);
          
        } else if (errorMessage.toLowerCase().includes('phone')) {
          toast.error(`📱 Phone Number Issue\n\n${errorMessage}\n\nPlease enter a valid phone number.`);
          
        } else if (errorDetails && Array.isArray(errorDetails)) {
          // Multiple validation errors
          const errorList = errorDetails.map(err => `• ${err}`).join('\n');
          toast.error(`❌ Validation Errors:\n\n${errorList}`);
          
        } else {
          // Generic 400 error
          toast.error(`⚠️ Registration Error\n\n${errorMessage}\n\nPlease check your information and try again.`);
        }
        
      } else if (statusCode === 500) {
        // Server error
        toast.error('❌ Server Error\n\nSomething went wrong on our end. Please try again later.\n\nIf the problem persists, contact support.');
        console.error('Server error details:', error.response?.data);
        
      } else if (statusCode === 409) {
        // Conflict - duplicate entry
        toast.error('🚫 Account Already Exists\n\nAn account with this email or phone number already exists.\n\nPlease login or use different credentials.');
        
      } else if (statusCode === 429) {
        // Too many requests
        toast.error('⏳ Too Many Attempts\n\nPlease wait a moment before trying again.');
        
      } else {
        // Unknown error - show whatever message we have
        const fallbackMessage = errorMessage || 'Registration failed. Please check your information and try again.';
        toast.error(`❌ Registration Failed\n\n${fallbackMessage}\n\nIf this continues, please contact support.`);
        console.error('Unknown error type - Status:', statusCode);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <PetalAnimation />

      <div className="absolute inset-0 bg-gradient-to-br from-golden-50 via-lavender-50 to-golden-50" />

      {/* Success Animation Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-4 text-center relative overflow-hidden"
            >
              {/* Burst hearts animation */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => {
                  const angle = (i * 360) / 20;
                  const x = Math.cos((angle * Math.PI) / 180) * 150;
                  const y = Math.sin((angle * Math.PI) / 180) * 150;
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                      animate={{
                        x: x,
                        y: y,
                        opacity: 0,
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.05,
                        ease: "easeOut",
                      }}
                    >
                      <Heart className="w-4 h-4 text-green-500 fill-green-500" />
                    </motion.div>
                  );
                })}
              </div>

              {/* Success checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative z-10"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Check className="w-12 h-12 text-white" strokeWidth={3} />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    {t('REGISTRATION_SUCCESSFUL')}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Welcome, {formData.name}!
                  </p>
                  <p className="text-gray-600 mb-4">
                    Please check your email to verify your account.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <Mail className="w-5 h-5" />
                    <p className="font-semibold">Verification email sent!</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Animated confetti */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={`confetti-${i}`}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '-10%',
                      backgroundColor: ['#10b981', '#f43f5e', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 4)],
                    }}
                    animate={{
                      y: ['0vh', '110vh'],
                      x: [0, (Math.random() - 0.5) * 100],
                      rotate: [0, 360],
                      opacity: [1, 0.8, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 0.5,
                      ease: "easeIn",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-golden-100">
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block mb-4"
              >
                <Image 
                  src="/images/Kalyanautsava Matrimony-01.png"
                  alt="Kalyanautsava Logo"
                  width={120}
                  height={120}
                  className="mx-auto"
                  priority
                />
              </motion.div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {t('BEGIN_JOURNEY')}
              </h1>
              <p className="text-gray-600">
                {t('CREATE_PROFILE_FIND_MATCH')}
              </p>
            </div>

            <div className="flex items-center justify-center mb-8">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: step === s ? 1.2 : 1,
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s
                        ? 'bg-gradient-to-r from-golden-500 to-golden-500 text-white'
                        : 'bg-pink-100 text-gray-400'
                    }`}
                  >
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </motion.div>
                  {s < 2 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        step > s ? 'bg-rose-500' : 'bg-pink-100'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {t('BASIC_INFORMATION')}
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('FULL_NAME')}
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          className="w-full pl-12 pr-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('EMAIL_ADDRESS')}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          required
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 ${
                            errors.email ? 'border-red-500' : 'border-golden-200'
                          }`}
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('PHONE')}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          required
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 ${
                            errors.phone ? 'border-red-500' : 'border-golden-200'
                          }`}
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 ${
                          errors.city ? 'border-red-500' : 'border-golden-200'
                        }`}
                        placeholder="Mumbai"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('GENDER')}
                        </label>
                        <select
                          required
                          className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                        >
                          <option value="">{t('SELECT')}</option>
                          <option value="male">{t('MALE')}</option>
                          <option value="female">{t('FEMALE')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('DATE_OF_BIRTH')}
                        </label>
                        <input
                          type="date"
                          required
                          className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dateOfBirth: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Height
                        </label>
                        <select
                          required
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 ${
                            errors.height ? 'border-red-500' : 'border-golden-200'
                          }`}
                          value={formData.height}
                          onChange={(e) =>
                            setFormData({ ...formData, height: e.target.value })
                          }
                        >
                          <option value="">Select Height</option>
                          <option value="4'6&quot;">4'6"</option>
                          <option value="4'7&quot;">4'7"</option>
                          <option value="4'8&quot;">4'8"</option>
                          <option value="4'9&quot;">4'9"</option>
                          <option value="4'10&quot;">4'10"</option>
                          <option value="4'11&quot;">4'11"</option>
                          <option value="5'0&quot;">5'0"</option>
                          <option value="5'1&quot;">5'1"</option>
                          <option value="5'2&quot;">5'2"</option>
                          <option value="5'3&quot;">5'3"</option>
                          <option value="5'4&quot;">5'4"</option>
                          <option value="5'5&quot;">5'5"</option>
                          <option value="5'6&quot;">5'6"</option>
                          <option value="5'7&quot;">5'7"</option>
                          <option value="5'8&quot;">5'8"</option>
                          <option value="5'9&quot;">5'9"</option>
                          <option value="5'10&quot;">5'10"</option>
                          <option value="5'11&quot;">5'11"</option>
                          <option value="6'0&quot;">6'0"</option>
                          <option value="6'1&quot;">6'1"</option>
                          <option value="6'2&quot;">6'2"</option>
                          <option value="6'3&quot;">6'3"</option>
                          <option value="6'4&quot;">6'4"</option>
                          <option value="6'5&quot;">6'5"</option>
                          <option value="6'6&quot;">6'6"</option>
                        </select>
                        {errors.height && (
                          <p className="text-red-500 text-sm mt-1">{errors.height}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marital Status
                        </label>
                        <select
                          required
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 ${
                            errors.maritalStatus ? 'border-red-500' : 'border-golden-200'
                          }`}
                          value={formData.maritalStatus}
                          onChange={(e) =>
                            setFormData({ ...formData, maritalStatus: e.target.value })
                          }
                        >
                          <option value="">Select Status</option>
                          <option value="Never Married">Never Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                        {errors.maritalStatus && (
                          <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {t('SECURE_YOUR_ACCOUNT')}
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('PASSWORD')}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          required
                          className="w-full pl-12 pr-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('CONFIRM_PASSWORD')}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          required
                          className="w-full pl-12 pr-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong>{t('SECURITY_TIPS')}</strong>
                      </p>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        <li>{t('SECURITY_TIP_1')}</li>
                        <li>{t('SECURITY_TIP_2')}</li>
                        <li>{t('SECURITY_TIP_3')}</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleBack}
                    disabled={loading}
                    className="flex-1 bg-pink-100 text-golden-600 py-4 rounded-lg font-semibold hover:bg-pink-200 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{t('BACK')}</span>
                  </motion.button>
                )}

                {step < 2 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-golden-500 to-golden-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>{t('CONTINUE')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-golden-500 to-golden-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        <span>{t('COMPLETE_REGISTRATION')}</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </form>

            <p className="mt-8 text-center text-gray-600">
              {t('ALREADY_HAVE_ACCOUNT')}{' '}
              <Link
                href="/login"
                className="text-golden-600 hover:text-golden-700 font-semibold"
              >
                {t('SIGN_IN')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
