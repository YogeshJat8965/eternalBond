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

export default function StoriesPage() {
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);
  const stories = [
    {
      id: 1,
      couple: 'Emma & David',
      date: 'Married: June 2024',
      story: 'We met on KalyanautsavaMat in early 2023, and from our very first conversation, we knew there was something special. David\'s sense of humor and Emma\'s warm personality clicked instantly. After months of video calls and meeting in person, we realized we had found our soulmate. Thank you KalyanautsavaMat for bringing us together!',
      image: emmaAndDavid,
      location: 'New York, USA',
    },
    {
      id: 2,
      couple: 'Sophia & Ryan',
      date: 'Married: March 2024',
      story: 'Finding love felt impossible until we found KalyanautsavaMat. The platform\'s detailed matching system helped us discover each other despite living in different cities. Our first date was magical, and we haven\'t looked back since. We\'re now happily married and expecting our first child!',
      image: sophiaAndRyan,
      location: 'Los Angeles, USA',
    },
    {
      id: 3,
      couple: 'Aisha & Omar',
      date: 'Married: December 2023',
      story: 'As busy professionals, we struggled to find time for dating. KalyanautsavaMat made it easy to connect with like-minded individuals. Omar\'s profile stood out immediately, and after our first coffee date, we knew we were meant to be. The journey from strangers to soulmates was beautiful.',
      image: aishaAndOmar,
      location: 'Dubai, UAE',
    },
    {
      id: 4,
      couple: 'Priya & Arjun',
      date: 'Married: August 2024',
      story: 'Our families had been searching for the perfect match for us for years. When we both joined KalyanautsavaMat independently, we found each other within weeks. It felt like destiny. Our similar values, dreams, and aspirations aligned perfectly. We couldn\'t be happier!',
      image: priyaAndArjun,
      location: 'Mumbai, India',
    },
    {
      id: 5,
      couple: 'Isabella & Lucas',
      date: 'Married: February 2024',
      story: 'Long-distance relationships are challenging, but KalyanautsavaMat gave us the tools to make it work. We video chatted for months before meeting in person, and when we finally did, it exceeded all expectations. Now we\'re building our life together in the same city!',
      image: isabellaAndLucas,
      location: 'Barcelona, Spain',
    },
    {
      id: 6,
      couple: 'Yuki & Takeshi',
      date: 'Married: May 2024',
      story: 'Both of us were skeptical about online matrimonial services, but KalyanautsavaMat changed our minds. The platform\'s emphasis on compatibility and shared values helped us find each other. Our wedding was a beautiful blend of tradition and modern love. Thank you for everything!',
      image: yukiAndTakeshi,
      location: 'Tokyo, Japan',
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
              Love Stories That{' '}
              <span className="bg-gradient-to-r from-golden-500 to-golden-500 bg-clip-text text-transparent">
                Inspire Us
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real couples, real love stories. Discover how KalyanautsavaMat helped thousands
              find their perfect match and begin their journey to eternal happiness.
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

      <div className="relative z-10 bg-gradient-to-r from-golden-500 to-golden-500 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Want to Share Your Story?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              If you found love through KalyanautsavaMat, we would love to hear from you!
              Share your journey and inspire others.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-golden-600 px-8 py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-200 text-lg"
            >
              Share Your Story
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
