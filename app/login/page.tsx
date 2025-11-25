'use client';

import { motion } from 'framer-motion';
import { Mail, Lock, Heart } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import FloatingHearts from '@/components/animations/FloatingHearts';
import { useTranslation } from '@/context/LanguageProvider';

export default function LoginPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Login functionality will be implemented with backend!');
  };

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <FloatingHearts />

      <div className="absolute inset-0 bg-gradient-to-br from-golden-50 via-lavender-50 to-golden-50" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-golden-100">
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block mb-4"
              >
                <Heart className="w-16 h-16 text-red-500 fill-red-500 mx-auto" />
              </motion.div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {t('WELCOME_BACK')}
              </h1>
              <p className="text-gray-600">
                {t('SIGN_IN_SUB')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-golden-600 border-pink-300 rounded focus:ring-golden-500"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData({ ...formData, rememberMe: e.target.checked })
                    }
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-700"
                  >
                    {t('REMEMBER_ME')}
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-golden-600 hover:text-golden-700"
                >
                  {t('FORGOT_PASSWORD')}
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                {t('SIGN_IN')}
              </motion.button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-golden-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    {t('OR_CONTINUE_WITH')}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="flex items-center justify-center space-x-3 px-6 py-3 border border-golden-200 rounded-lg hover:bg-golden-50 transition-colors w-full max-w-xs"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-gray-700 font-medium">{t('CONTINUE_WITH_GOOGLE')}</span>
                </motion.button>
              </div>
            </div>

            <p className="mt-8 text-center text-gray-600">
              {t('DONT_HAVE_ACCOUNT')}{' '}
              <Link
                href="/register"
                className="text-golden-600 hover:text-golden-700 font-semibold"
              >
                {t('SIGN_UP')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
