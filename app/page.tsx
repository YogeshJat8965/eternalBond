'use client';

import { motion } from 'framer-motion';
import { Search, Heart, Users, Award, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import FloatingHearts from '@/components/animations/FloatingHearts';
import RotatingWords from '@/components/animations/RotatingWords';
import HeroImageSlider from '@/components/animations/HeroImageSlider';
import CounterAnimation from '@/components/animations/CounterAnimation';
import emmaAndDavid from './images/ama&david.jpg';
import sophiaAndRyan from './images/sophia&ryan.jpg';
import aishaAndOmar from './images/aisha&romar.jpg';

export default function Home() {
  const [searchData, setSearchData] = useState({
    gender: '',
    ageFrom: '',
    ageTo: '',
    religion: '',
  });
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);

  const featuredProfiles = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 28,
      profession: 'Software Engineer',
      location: 'New York, USA',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 32,
      profession: 'Doctor',
      location: 'Los Angeles, USA',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      name: 'Priya Sharma',
      age: 26,
      profession: 'Teacher',
      location: 'Mumbai, India',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 4,
      name: 'James Wilson',
      age: 30,
      profession: 'Architect',
      location: 'London, UK',
      image: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 5,
      name: 'Emily Rodriguez',
      age: 29,
      profession: 'Marketing Manager',
      location: 'Toronto, Canada',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 6,
      name: 'David Kim',
      age: 31,
      profession: 'Business Analyst',
      location: 'Singapore',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const stats = [
    { icon: Users, label: 'Active Members', value: 50, suffix: 'K+' },
    { icon: Heart, label: 'Success Stories', value: 10, suffix: 'K+' },
    { icon: Award, label: 'Years of Trust', value: 15, suffix: '+' },
  ];

  const successStories = [
    {
      couple: 'Emma & David',
      story: 'We found each other through EternalBond and it was love at first sight!',
      image: emmaAndDavid,
    },
    {
      couple: 'Sophia & Ryan',
      story: 'Thank you for bringing us together. Best decision we ever made!',
      image: sophiaAndRyan,
    },
    {
      couple: 'Aisha & Omar',
      story: 'A perfect match made through perfect service. Highly recommended!',
      image: aishaAndOmar,
    },
  ];

  return (
    <div className="relative">
      <FloatingHearts />

      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-lavender-50 to-rose-50 pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZWNkZDMiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-rose-100 px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span className="text-rose-600 text-sm font-medium">
                  Trusted by thousands of happy couples
                </span>
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Find Your{' '}
                <RotatingWords 
                  className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent"
                  words={['Perfect Match', 'True Love', 'Soulmate', 'Forever Partner']}
                />
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover meaningful connections and begin your journey to eternal
                happiness with someone special.
              </p>

              <div className="bg-white p-6 rounded-2xl shadow-xl border border-pink-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Quick Partner Search
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <select
                    className="px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    value={searchData.gender}
                    onChange={(e) =>
                      setSearchData({ ...searchData, gender: e.target.value })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <select
                    className="px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    value={searchData.religion}
                    onChange={(e) =>
                      setSearchData({ ...searchData, religion: e.target.value })
                    }
                  >
                    <option value="">Select Religion</option>
                    <option value="christianity">Christianity</option>
                    <option value="islam">Islam</option>
                    <option value="hinduism">Hinduism</option>
                    <option value="buddhism">Buddhism</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Age From"
                    className="px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    value={searchData.ageFrom}
                    onChange={(e) =>
                      setSearchData({ ...searchData, ageFrom: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Age To"
                    className="px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    value={searchData.ageTo}
                    onChange={(e) =>
                      setSearchData({ ...searchData, ageTo: e.target.value })
                    }
                  />
                </div>
                <Link href="/find-partner">
                  <button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Search Now</span>
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <HeroImageSlider />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-lavender-50 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">
                  <CounterAnimation 
                    end={stat.value} 
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-pink-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Featured Profiles
            </h2>
            <p className="text-gray-600 text-lg">
              Meet some of our amazing members
            </p>
          </motion.div>

          {/* Auto-scrolling carousel */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: [0, -1920], // Adjust based on card width (320px * 6 cards = 1920px)
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {/* Render profiles twice for seamless loop */}
              {[...featuredProfiles, ...featuredProfiles].map((profile, index) => (
                <div
                  key={`${profile.id}-${index}`}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-pink-100"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                      <Heart className="w-5 h-5 text-rose-500" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {profile.name}, {profile.age}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {profile.profession}
                    </p>
                    <p className="text-gray-500 text-sm">{profile.location}</p>
                    <Link href="/members">
                      <button className="mt-4 w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-2 rounded-lg hover:shadow-md transition-all duration-200">
                        View Profile
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link href="/members">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
              >
                <span>View All Members</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-pink-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Success Stories
            </h2>
            <p className="text-gray-600 text-lg">
              Real couples, real happiness
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -15,
                  scale: 1.05,
                  rotateZ: index % 2 === 0 ? 2 : -2,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 }
                }}
                onHoverStart={() => setHoveredStory(index)}
                onHoverEnd={() => setHoveredStory(null)}
                className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              >
                {/* Animated gradient border effect */}
                <motion.div 
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                    padding: '3px'
                  }}
                >
                  <div className="w-full h-full bg-white rounded-2xl" />
                </motion.div>

                {/* Continuous bursting hearts on hover - WHOLE CARD */}
                {hoveredStory === index && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                    {[...Array(12)].map((_, i) => {
                      const startX = Math.random() * 100;
                      const startY = Math.random() * 100;
                      const endX = startX + (Math.random() - 0.5) * 60;
                      const endY = startY - 40 - Math.random() * 40;
                      const delay = (i * 0.15) % 1.8;
                      
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
                            scale: [0, 1, 1.2, 0.8],
                            x: [`0%`, `${endX - startX}%`],
                            y: [`0%`, `${endY - startY}%`],
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 1.8,
                            delay: delay,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        >
                          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Content wrapper */}
                <div className="relative z-10">
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={story.image.src}
                      alt={story.couple}
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.15,
                        transition: { duration: 0.4 }
                      }}
                    />
                    
                    {/* Floating hearts on hover */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute"
                          initial={{ 
                            bottom: "10%",
                            left: `${20 + i * 15}%`,
                            opacity: 0 
                          }}
                          whileHover={{
                            bottom: "90%",
                            opacity: [0, 1, 0],
                            transition: {
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Infinity,
                            }
                          }}
                        >
                          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Shimmer effect overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{
                        x: '100%',
                        transition: { duration: 0.8, ease: "easeInOut" }
                      }}
                    />
                  </div>

                  <div className="p-6 bg-white">
                    <motion.h3 
                      className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-rose-500 transition-colors duration-300"
                      whileHover={{ scale: 1.05, x: 5 }}
                    >
                      {story.couple}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-600 italic"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ 
                        opacity: 1,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {story.story}
                    </motion.p>
                  </div>
                </div>

                {/* Sparkle effect on corners */}
                <motion.div
                  className="absolute top-2 right-2 text-yellow-400"
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  whileHover={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.2, 1, 0],
                    rotate: [0, 180, 360],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }
                  }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/stories">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
              >
                <span>Read More Stories</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-rose-500 to-pink-500 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Find Your Soulmate?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Join thousands of happy couples who found love through EternalBond
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-rose-500 px-8 py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-200 text-lg"
              >
                Get Started Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
