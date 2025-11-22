'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FloatingHearts() {
  const hearts = Array.from({ length: 15 }, (_, i) => i);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {hearts.map((i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
            opacity: 0,
          }}
          animate={{
            y: -100,
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: i * 1.5,
            ease: 'linear',
          }}
          style={{
            left: `${Math.random() * 100}%`,
          }}
        >
          <Heart
            className="text-rose-400 fill-rose-300 drop-shadow-lg"
            style={{
              width: `${24 + Math.random() * 20}px`,
              height: `${24 + Math.random() * 20}px`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
