'use client';

import { motion } from 'framer-motion';
import { Heart, Quote } from 'lucide-react';
import PetalAnimation from '@/components/animations/PetalAnimation';
import emmaAndDavid from '../images/ama&david.jpg';
import sophiaAndRyan from '../images/sophia&ryan.jpg';
import aishaAndOmar from '../images/aisha&romar.jpg';
import priyaAndArjun from '../images/priya&arjun.jpg';
import isabellaAndLucas from '../images/isabella&lucas.jpg';
import yukiAndTakeshi from '../images/yuki&takesi.jpg';
import { useState } from 'react';
import { useTranslation } from '@/context/LanguageProvider';

export default function StoriesPage() {
  const { t } = useTranslation();
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);
  
  const stories = [
    {
      id: 1,
      couple: t('STORY_1_COUPLE'),
      date: t('STORY_1_DATE'),
      story: t('STORY_1_FULL'),
      image: emmaAndDavid,
      location: t('STORY_1_LOCATION'),
    },
    {
      id: 2,
      couple: t('STORY_2_COUPLE'),
      date: t('STORY_2_DATE'),
      story: t('STORY_2_FULL'),
      image: sophiaAndRyan,
      location: t('STORY_2_LOCATION'),
    },
    {
      id: 3,
      couple: t('STORY_3_COUPLE'),
      date: t('STORY_3_DATE'),
      story: t('STORY_3_FULL'),
      image: aishaAndOmar,
      location: t('STORY_3_LOCATION'),
    },
    {
      id: 4,
      couple: t('STORY_4_COUPLE'),
      date: t('STORY_4_DATE'),
      story: t('STORY_4_FULL'),
      image: priyaAndArjun,
      location: t('STORY_4_LOCATION'),
    },
    {
      id: 5,
      couple: t('STORY_5_COUPLE'),
      date: t('STORY_5_DATE'),
      story: t('STORY_5_FULL'),
      image: isabellaAndLucas,
      location: t('STORY_5_LOCATION'),
    },
    {
      id: 6,
      couple: t('STORY_6_COUPLE'),
      date: t('STORY_6_DATE'),
      story: t('STORY_6_FULL'),
      image: yukiAndTakeshi,
      location: t('STORY_6_LOCATION'),
    },
  ];

  return (
    <div className="min-h-screen pt-16 relative">
      <PetalAnimation />

      <div className="relative z-10 bg-gradient-to-br from-golden-50 via-lavender-50 to-golden-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-6"
            >
              <Heart className="w-16 h-16 text-red-500 fill-red-500 mx-auto" />
            </motion.div>

            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              {t('LOVE_STORIES_THAT')}{' '}
              <span className="bg-gradient-to-r from-golden-500 to-golden-500 bg-clip-text text-transparent">
                {t('INSPIRE_US')}
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('STORIES_SUBTITLE')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  rotateZ: index % 2 === 0 ? 1 : -1,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 }
                }}
                onHoverStart={() => setHoveredStory(story.id)}
                onHoverEnd={() => setHoveredStory(null)}
                className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-golden-100 group cursor-pointer"
              >
                {/* Animated gradient border effect on hover */}
                <motion.div 
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-golden-400 via-golden-400 to-golden-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ 
                    backgroundSize: '200% 200%',
                    padding: '2px'
                  }}
                >
                  <div className="w-full h-full bg-white rounded-3xl" />
                </motion.div>

                {/* Heart burst animation on hover - WHOLE CARD */}
                {hoveredStory === story.id && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 rounded-3xl">
                    {[...Array(10)].map((_, i) => {
                      const startX = Math.random() * 100;
                      const startY = Math.random() * 100;
                      const endX = startX + (Math.random() - 0.5) * 50;
                      const endY = startY - 30 - Math.random() * 40;
                      const delay = (i * 0.2) % 2;
                      
                      return (
                        <motion.div
                          key={`burst-${i}`}
                          className="absolute"
                          style={{
                            left: `${startX}%`,
                            top: `${startY}%`,
                          }}
                          initial={{
                            opacity: 0,
                            scale: 0,
                            rotate: 0,
                          }}
                          animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0, 1, 1.3, 0.7],
                            x: [`0%`, `${endX - startX}%`],
                            y: [`0%`, `${endY - startY}%`],
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 2,
                            delay: delay,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        >
                          <Heart className="w-4 h-4 text-red-500 fill-red-500 drop-shadow-lg" />
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Content wrapper */}
                <div className="relative z-10">
                  <div className="relative h-80 overflow-hidden">
                    <motion.img
                      src={story.image.src}
                      alt={story.couple}
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.4 }
                      }}
                    />
                    
                    {/* Shimmer effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{
                        x: '100%',
                        transition: { duration: 0.8, ease: "easeInOut" }
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <motion.div 
                      className="absolute bottom-6 left-6 right-6 text-white"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-3xl font-bold mb-2 group-hover:text-golden-200 transition-colors duration-300">
                        {story.couple}
                      </h3>
                      <p className="text-white/90 text-sm">{story.location}</p>
                    </motion.div>
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <p className="text-golden-600 text-sm font-semibold">
                        {story.date}
                      </p>
                    </div>
                  </div>

                  <div className="p-8 bg-white">
                    <Quote className="w-8 h-8 text-golden-300 mb-4 group-hover:text-golden-400 transition-colors duration-300" />
                    <p className="text-gray-700 leading-relaxed italic group-hover:text-gray-900 transition-colors duration-300">
                      {story.story}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}
