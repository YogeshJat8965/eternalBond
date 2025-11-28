'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart, Menu, X, LogOut, LayoutDashboard, Shield, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const router = useRouter();
  // translation
  const { t, language, setLanguage } = (() => {
    try {
      // lazy require to avoid server import issues
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const ctx = require('@/context/LanguageProvider');
      return ctx.useTranslation();
    } catch (e) {
      // fallback when not wrapped
      return { t: (k: string) => k, language: 'en', setLanguage: (_: any) => {} } as any;
    }
  })();

  useEffect(() => {
    // Check if user is registered
    const checkRegistration = () => {
      const registered = localStorage.getItem('isRegistered') === 'true';
      setIsRegistered(registered);
    };
    
    // Check on mount
    checkRegistration();
    
    // Listen for registration events
    window.addEventListener('registrationComplete', checkRegistration);
    window.addEventListener('storage', checkRegistration);
    
    // Cleanup
    return () => {
      window.removeEventListener('registrationComplete', checkRegistration);
      window.removeEventListener('storage', checkRegistration);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('userName');
    setIsRegistered(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/members', label: t('MEMBERS') },
    { href: '/stories', label: t('STORIES') },
    { href: '/plans', label: t('PLANS') },
    { href: '/contact', label: t('CONTACT') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-golden-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo on Left */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/Kalyanautsava Matrimony-01.png" 
                alt="Kalyanautsava Logo" 
                width={96} 
                height={96}
                className="object-contain w-20 h-20 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-24 lg:h-24"
                priority
              />
            </Link>
          </div>

          {/* Brand Name in Center (Mobile and Up) */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0 lg:flex-1">
            <Link href="/" className="block lg:ml-3">
              <motion.span 
                className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold whitespace-nowrap"
                style={{
                  background: 'linear-gradient(90deg, #B91C1C 0%, #EAB308 50%, #B91C1C 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                Kalyanautsava
              </motion.span>
            </Link>
          </div>

          {/* Desktop Menu on Right - Fixed Width */}
          <div className="hidden lg:flex items-center space-x-6 flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-golden-600 transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu((s) => !s)}
                className="flex items-center space-x-2 text-gray-700 hover:text-golden-600 transition-colors duration-200 font-medium p-2 rounded"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase text-sm">{language}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-golden-100 rounded shadow-md z-50">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setShowLangMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-golden-50"
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi');
                      setShowLangMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-golden-50"
                  >
                    हिन्दी
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ta');
                      setShowLangMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-golden-50"
                  >
                    தமிழ்
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('te');
                      setShowLangMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-golden-50"
                  >
                    తెలుగు
                  </button>
                </div>
              )}
            </div>
            {isRegistered ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-golden-600 transition-colors duration-200 font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('MENU_DASHBOARD')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-golden-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('LOGOUT')}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-golden-600 hover:text-golden-700 font-medium"
                >
                  {t('LOGIN')}
                </Link>
                <Link
                  href="/register"
                  className="text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: '#EEC900' }}
                >
                  {t('REGISTER')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Hamburger Menu on Right */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-golden-600 p-2 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slide in from Right */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay - Full Screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-in Menu from Right - Full Height */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-[280px] sm:w-[320px] bg-white shadow-2xl z-[101] lg:hidden overflow-y-auto"
            >
              {/* Header with Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-golden-100">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <span className="text-xl font-bold text-red-700">
                    Kalyanautsava
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="px-6 py-4 space-y-1">
                <Link
                  href="/"
                  className="block text-gray-700 hover:text-golden-600 hover:bg-golden-50 transition-all duration-200 py-2.5 px-4 rounded-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('HOME')}
                </Link>
                
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-gray-700 hover:text-golden-600 hover:bg-golden-50 transition-all duration-200 py-2.5 px-4 rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile language dropdown */}
                <div className="mt-3">
                  <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="w-full flex items-center justify-between text-gray-700 hover:text-golden-600 hover:bg-golden-50 transition-all duration-200 py-2.5 px-4 rounded-lg font-medium"
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5" />
                      <span>{language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : language === 'ta' ? 'தமிழ்' : 'తెలుగు'}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: showLangMenu ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {showLangMenu && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 ml-4 space-y-1">
                          <button
                            onClick={() => {
                              setLanguage('en');
                              setShowLangMenu(false);
                            }}
                            className={`w-full text-left py-2 px-4 rounded-lg transition-all duration-200 ${
                              language === 'en'
                                ? 'bg-golden-100 text-golden-700 font-medium'
                                : 'text-gray-600 hover:bg-golden-50'
                            }`}
                          >
                            English
                          </button>
                          <button
                            onClick={() => {
                              setLanguage('hi');
                              setShowLangMenu(false);
                            }}
                            className={`w-full text-left py-2 px-4 rounded-lg transition-all duration-200 ${
                              language === 'hi'
                                ? 'bg-golden-100 text-golden-700 font-medium'
                                : 'text-gray-600 hover:bg-golden-50'
                            }`}
                          >
                            हिन्दी
                          </button>
                          <button
                            onClick={() => {
                              setLanguage('ta');
                              setShowLangMenu(false);
                            }}
                            className={`w-full text-left py-2 px-4 rounded-lg transition-all duration-200 ${
                              language === 'ta'
                                ? 'bg-golden-100 text-golden-700 font-medium'
                                : 'text-gray-600 hover:bg-golden-50'
                            }`}
                          >
                            தமிழ்
                          </button>
                          <button
                            onClick={() => {
                              setLanguage('te');
                              setShowLangMenu(false);
                            }}
                            className={`w-full text-left py-2 px-4 rounded-lg transition-all duration-200 ${
                              language === 'te'
                                ? 'bg-golden-100 text-golden-700 font-medium'
                                : 'text-gray-600 hover:bg-golden-50'
                            }`}
                          >
                            తెలుగు
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isRegistered && (
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 text-gray-700 hover:text-golden-600 hover:bg-golden-50 transition-all duration-200 py-2.5 px-4 rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>{t('MENU_DASHBOARD')}</span>
                  </Link>
                )}
              </div>

              {/* Action Buttons - Placed after navigation */}
              <div className="px-6 pb-4">
                {isRegistered ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('LOGOUT')}</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block w-full text-center text-golden-600 border-2 border-golden-500 px-6 py-3 rounded-full hover:bg-golden-50 transition-all duration-200 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('LOGIN')}
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full text-center text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-200 font-medium bg-gradient-to-r from-golden-500 to-golden-600"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('REGISTER')}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
