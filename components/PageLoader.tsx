'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="relative">
        {/* Animated rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-rose-200"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ width: '150px', height: '150px', left: '-25px', top: '-25px' }}
        />
        
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-pink-200"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          style={{ width: '150px', height: '150px', left: '-25px', top: '-25px' }}
        />
        
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-purple-200"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
          style={{ width: '150px', height: '150px', left: '-25px', top: '-25px' }}
        />

        {/* Center heart with pulse */}
        <motion.div
          className="relative w-24 h-24 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart className="w-12 h-12 text-white fill-white" />
          </motion.div>
        </motion.div>

        {/* Floating hearts around */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * 360;
          const distance = 80;
          const x = Math.cos((angle * Math.PI) / 180) * distance;
          const y = Math.sin((angle * Math.PI) / 180) * distance;
          
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            >
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            </motion.div>
          );
        })}
      </div>

      {/* Loading text */}
      <motion.div
        className="absolute bottom-1/3 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.h3
          className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-2"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Finding Your Perfect Match
        </motion.h3>
        
        {/* Animated dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-rose-500 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
