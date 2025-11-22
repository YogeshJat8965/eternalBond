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
    { href: '/find-partner', label: 'Find Partner' },
    { href: '/stories', label: 'Success Stories' },
    { href: '/plans', label: 'Plans' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-golden-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand Name on Left */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image 
                src="/images/logo.png" 
                alt="KalyanautsavaMat Logo" 
                width={96} 
                height={96}
                className="object-contain w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                priority
              />
            </Link>
            <Link href="/" className="hidden sm:block">
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text whitespace-nowrap" style={{ backgroundImage: 'linear-gradient(to right, #EEC900, #EEC900)' }}>
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-golden-100"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-700 hover:text-golden-600 transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {isRegistered ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 text-gray-700 hover:text-golden-600 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-golden-500 text-white px-6 py-2 rounded-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-golden-600 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block text-white px-6 py-2 rounded-full text-center"
                    style={{ backgroundColor: '#EEC900' }}
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
