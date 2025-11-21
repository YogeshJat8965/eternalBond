'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PetalAnimation() {
  const petals = Array.from({ length: 15 }, (_, i) => i);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              i % 2 === 0 ? '#fce7f3' : '#fae8ff'
            }, transparent)`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{
            y: -50,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
            opacity: [0, 0.8, 0],
            rotate: 360,
            x: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
