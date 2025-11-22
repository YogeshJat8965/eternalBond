'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import hand1 from '@/app/images/hand1.jpg';
import hand2 from '@/app/images/hand2.jpg';
import hand3 from '@/app/images/hand3.jpg';
import hand4 from '@/app/images/hand4.jpg';

const images = [hand1, hand2, hand3, hand4];

export default function HeroImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      {/* Animated gradient background */}
      <motion.div
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-3xl opacity-30"
      />
      
      {/* Image slideshow with crossfade */}
      <div className="relative rounded-3xl shadow-2xl overflow-hidden w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={images[currentIndex].src}
              alt={`Happy Couple ${currentIndex + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating heart decoration */}
      <motion.div
        className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <svg
          className="w-8 h-8 text-rose-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>
    </div>
  );
}
