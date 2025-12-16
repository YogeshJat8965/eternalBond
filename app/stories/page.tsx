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
import { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Default image mapping based on couple name or use fallback
const imageMap: any = {
  'Emma & David': emmaAndDavid,
  'Sophia & Ryan': sophiaAndRyan,
  'Aisha & Omar': aishaAndOmar,
  'Priya & Arjun': priyaAndArjun,
  'Isabella & Lucas': isabellaAndLucas,
  'Yuki & Takeshi': yukiAndTakeshi,
};

export default function StoriesPage() {
  const { t } = useTranslation();
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/stories`);
        if (response.ok) {
          const data = await response.json();
          // Map stories with images
          const storiesWithImages = data.map((story: any) => ({
            ...story,
            imageFile: imageMap[story.coupleName] || emmaAndDavid, // Use mapped image or default
          }));
          setStories(storiesWithImages);
        } else {
          throw new Error('Failed to fetch stories');
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
        // Fallback to default stories
        setStories([
          {
            _id: '1',
            coupleName: t('STORY_1_COUPLE'),
            weddingDate: t('STORY_1_DATE'),
            story: t('STORY_1_FULL'),
            imageFile: emmaAndDavid,
            location: t('STORY_1_LOCATION'),
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [t]);

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
            {loading && (
              <p className="col-span-2 text-center text-gray-600 text-lg">Loading stories...</p>
            )}
            {!loading && stories.length === 0 && (
              <p className="col-span-2 text-center text-gray-600 text-lg">No success stories yet. Check back soon!</p>
            )}
            {stories.map((story, index) => (
              <motion.div
                key={story._id}
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
                onHoverStart={() => setHoveredStory(index)}
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
                {hoveredStory === index && (
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
                    {story.imageFile ? (
                      <motion.img
                        src={story.imageFile.src}
                        alt={story.coupleName}
                        className="w-full h-full object-cover"
                        whileHover={{ 
                          scale: 1.1,
                          transition: { duration: 0.4 }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-golden-200 to-golden-400 flex items-center justify-center text-6xl">
                        {story.image || '💑'}
                      </div>
                    )}
                    
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
                        {story.coupleName}
                      </h3>
                      <p className="text-white/90 text-sm">{story.location}</p>
                    </motion.div>
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <p className="text-golden-600 text-sm font-semibold">
                        {story.weddingDate}
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
