'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart, Menu, X, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();

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
    { href: '/members', label: 'Members' },
    { href: '/stories', label: 'Success Stories' },
    { href: '/plans', label: 'Plans' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-golden-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo on Left */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo.png" 
                alt="KalyanautsavaMat Logo" 
                width={96} 
                height={96}
                className="object-contain w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                priority
              />
            </Link>
          </div>

          {/* Brand Name in Center (Mobile and Up) */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0 lg:flex-1">
            <Link href="/" className="block lg:ml-3">
              <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text whitespace-nowrap" style={{ backgroundImage: 'linear-gradient(to right, #EEC900, #EEC900)' }}>
                KalyanautsavaMat
              </span>
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
            
            {isRegistered ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-golden-600 transition-colors duration-200 font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-golden-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-golden-600 hover:text-golden-700 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: '#EEC900' }}
                >
                  Register
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
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-golden-500 to-golden-600">
                    KalyanautsavaMat
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
                  Home
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

                {isRegistered && (
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 text-gray-700 hover:text-golden-600 hover:bg-golden-50 transition-all duration-200 py-2.5 px-4 rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
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
                    <span>Logout</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block w-full text-center text-golden-600 border-2 border-golden-500 px-6 py-3 rounded-full hover:bg-golden-50 transition-all duration-200 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full text-center text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-200 font-medium bg-gradient-to-r from-golden-500 to-golden-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
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
