'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Heart, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PetalAnimation from '@/components/animations/PetalAnimation';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/context/LanguageProvider';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    otp: '',
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success animation
    setShowSuccess(true);
    
    // Store registration status in localStorage
    localStorage.setItem('isRegistered', 'true');
    localStorage.setItem('userName', formData.name);
    
    // Dispatch custom event to notify navbar
    window.dispatchEvent(new Event('registrationComplete'));
    
    // Redirect to home after 3 seconds
    setTimeout(() => {
      router.push('/');
    }, 3000);
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
                  <p className="text-gray-600 mb-4">
                    {t('WELCOME_TO')}, {formData.name}!
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <Sparkles className="w-5 h-5" />
                    <p className="font-semibold">{t('JOURNEY_BEGINS')}</p>
                    <Sparkles className="w-5 h-5" />
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
              {[1, 2, 3].map((s) => (
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
                  {s < 3 && (
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
                          className="w-full pl-12 pr-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
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
                        {t('PASSWORD_HINT')}
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

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {t('VERIFY_YOUR_EMAIL')}
                    </h2>

                    <div className="bg-golden-50 border border-golden-200 rounded-lg p-6 text-center">
                      <Mail className="w-12 h-12 text-golden-600 mx-auto mb-4" />
                      <p className="text-gray-700 mb-2">
                        {t('VERIFICATION_CODE_SENT')}
                      </p>
                      <p className="font-semibold text-gray-800 mb-4">
                        {formData.email}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                        {t('ENTER_6_DIGIT_CODE')}
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        className="w-full px-4 py-4 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 text-center text-2xl font-semibold tracking-widest"
                        placeholder="000000"
                        value={formData.otp}
                        onChange={(e) =>
                          setFormData({ ...formData, otp: e.target.value })
                        }
                      />
                    </div>

                    <p className="text-center text-sm text-gray-600">
                      {t('DIDNT_RECEIVE_CODE')}{' '}
                      <button
                        type="button"
                        className="text-golden-600 hover:text-golden-700 font-semibold"
                      >
                        {t('RESEND')}
                      </button>
                    </p>
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
                    className="flex-1 bg-pink-100 text-golden-600 py-4 rounded-lg font-semibold hover:bg-pink-200 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{t('BACK')}</span>
                  </motion.button>
                )}

                {step < 3 ? (
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
                    className="flex-1 bg-gradient-to-r from-golden-500 to-golden-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>{t('COMPLETE_REGISTRATION')}</span>
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
