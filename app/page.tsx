'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Users, Award, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FloatingHearts from '@/components/animations/FloatingHearts';
import RotatingWords from '@/components/animations/RotatingWords';
import CounterAnimation from '@/components/animations/CounterAnimation';
import emmaAndDavid from './images/ama&david.jpg';
import sophiaAndRyan from './images/sophia&ryan.jpg';
import aishaAndOmar from './images/aisha&romar.jpg';
import priyaAndArjun from './images/priya&arjun.jpg';
import isabellaAndLucas from './images/isabella&lucas.jpg';
import yukiAndTakeshi from './images/yuki&takesi.jpg';
import heroSection1 from './images/heroSection1.jpg';
import heroSection2 from './images/heroSection2.jpg';
import heroSection3 from './images/heroSection3.jpg';

export default function Home() {
  const [searchData, setSearchData] = useState({
    gender: '',
    ageFrom: '',
    ageTo: '',
    religion: '',
  });
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [heroSection1, heroSection2, heroSection3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

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
      story: 'We found each other through KalyanautsavaMat and it was love at first sight!',
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
    {
      couple: 'Priya & Arjun',
      story: 'Our families are thrilled! We found our perfect match through KalyanautsavaMat.',
      image: priyaAndArjun,
    },
    {
      couple: 'Isabella & Lucas',
      story: 'Distance was no barrier with KalyanautsavaMat. Now we\'re building our future together!',
      image: isabellaAndLucas,
    },
    {
      couple: 'Yuki & Takeshi',
      story: 'From skeptics to believers! KalyanautsavaMat gave us our happily ever after.',
      image: yukiAndTakeshi,
    },
  ];

  return (
    <div className="relative">
      {/* Hide floating hearts on mobile for better performance */}
      <div className="hidden md:block">
        <FloatingHearts />
      </div>

      <section className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-20 md:pt-16 pb-8 md:pb-0 overflow-hidden">
        {/* Animated Background Images */}
        <div className="absolute inset-0 w-full h-full">
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: index === 0 ? 1 : 0 }}
              animate={{ 
                opacity: index === currentImageIndex ? 1 : 0,
                scale: index === currentImageIndex ? 1 : 1.05
              }}
              transition={{ 
                duration: 2, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={image}
                alt={`Hero background ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                quality={90}
              />
            </motion.div>
          ))}
        </div>

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/50"></div>
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZWNkZDMiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-1 gap-8 lg:gap-12 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center space-x-2 bg-white/95 backdrop-blur-md px-4 py-2 md:px-5 md:py-2.5 rounded-full shadow-xl border border-golden-200"
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-golden-600 flex-shrink-0" />
                <span className="text-golden-700 text-xs sm:text-sm md:text-base font-semibold">
                  Trusted by thousands of happy couples
                </span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight drop-shadow-2xl px-4">
                Find Your{' '}
                <span className="block mt-2">
                  <RotatingWords 
                    className="bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent"
                    words={['Perfect Match', 'True Love', 'Soulmate', 'Forever Partner']}
                  />
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-relaxed drop-shadow-lg px-6 max-w-3xl mx-auto font-medium">
                Discover meaningful connections and begin your journey to eternal
                happiness with someone special.
              </p>

              <div className="bg-white/95 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-xl border border-golden-100 max-w-2xl mx-auto">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                  Quick Partner Search
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                  <select
                    className="px-3 py-2 md:px-4 md:py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 text-sm md:text-base"
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
                    className="px-3 py-2 md:px-4 md:py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 text-sm md:text-base"
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
                    className="px-3 py-2 md:px-4 md:py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 text-sm md:text-base"
                    value={searchData.ageFrom}
                    onChange={(e) =>
                      setSearchData({ ...searchData, ageFrom: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Age To"
                    className="px-3 py-2 md:px-4 md:py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 text-sm md:text-base"
                    value={searchData.ageTo}
                    onChange={(e) =>
                      setSearchData({ ...searchData, ageTo: e.target.value })
                    }
                  />
                </div>
                <Link href="/find-partner">
                  <button className="w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-2.5 md:py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base">
                    <Search className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Search Now</span>
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 md:p-8 rounded-2xl bg-gradient-to-br from-golden-50 to-lavender-50 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-golden-500 to-golden-500 rounded-full mb-3 md:mb-4">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  <CounterAnimation 
                    end={stat.value} 
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </h3>
                <p className="text-sm md:text-base text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-golden-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
              Featured Profiles
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Meet some of our amazing members
            </p>
          </motion.div>

          {/* Auto-scrolling carousel - hidden on mobile, use static grid instead */}
          <div className="hidden md:block relative overflow-hidden">
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
                  className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-golden-100"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
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
                    <button 
                      onClick={(e) => e.preventDefault()} 
                      className="mt-4 w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-2 rounded-lg hover:shadow-md transition-all duration-200 cursor-default"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Static grid for mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredProfiles.slice(0, 4).map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-golden-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    {profile.profession}
                  </p>
                  <p className="text-gray-500 text-xs mb-3">{profile.location}</p>
                  <button 
                    onClick={(e) => e.preventDefault()} 
                    className="w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-2 text-sm rounded-lg hover:shadow-md transition-all duration-200 cursor-default"
                  >
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link href="/members">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-golden-500 to-golden-500 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2 text-sm md:text-base"
              >
                <span>View All Members</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-golden-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
              Success Stories
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Real couples, real happiness
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                animate={{
                  y: hoveredStory === index ? -20 : 0,
                  scale: hoveredStory === index ? 1.08 : 1,
                  rotateZ: hoveredStory === index ? (index % 2 === 0 ? 2 : -2) : 0,
                }}
                whileHover={{ 
                  transition: { duration: 0.4, type: "spring", stiffness: 200, damping: 15 }
                }}
                onHoverStart={() => setHoveredStory(index)}
                onHoverEnd={() => setHoveredStory(null)}
                className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 group cursor-pointer"
              >
                {/* Animated gradient border effect - hide on mobile */}
                <motion.div 
                  className="hidden md:block absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 transition-opacity duration-500"
                  animate={{
                    opacity: hoveredStory === index ? 1 : 0,
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    opacity: { duration: 0.5 },
                    backgroundPosition: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                  style={{ 
                    backgroundSize: '200% 200%',
                    padding: '3px'
                  }}
                >
                  <div className="w-full h-full bg-white rounded-2xl" />
                </motion.div>

                {/* Bursting hearts animation on hover - only on desktop */}
                <AnimatePresence>
                  {hoveredStory === index && (
                    <motion.div 
                      className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden z-20 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {[...Array(20)].map((_, i) => {
                        // Randomly position hearts across the entire card
                        const startX = Math.random() * 100;
                        const startY = Math.random() * 100;
                        
                        // Random direction for burst effect
                        const angle = Math.random() * 360;
                        const distance = 30 + Math.random() * 40;
                        const endX = startX + Math.cos((angle * Math.PI) / 180) * distance;
                        const endY = startY + Math.sin((angle * Math.PI) / 180) * distance;
                        const delay = i * 0.05;
                        
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
                              scale: [0, 1.2, 1.5, 0],
                              x: [`0%`, `${endX - startX}%`],
                              y: [`0%`, `${endY - startY}%`],
                              rotate: [0, 360 + Math.random() * 180],
                            }}
                            transition={{
                              duration: 1.8,
                              delay: delay,
                              repeat: Infinity,
                              ease: "easeOut",
                              repeatDelay: 0.3,
                            }}
                          >
                            <Heart className="w-4 h-4 text-red-500 fill-red-500 drop-shadow-lg" />
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content wrapper */}
                <div className="relative z-10">
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <motion.img
                      src={story.image.src}
                      alt={story.couple}
                      className="w-full h-full object-cover"
                      animate={{
                        scale: hoveredStory === index ? 1.15 : 1,
                      }}
                      transition={{ 
                        duration: 0.6,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Shimmer effect overlay - hide on mobile */}
                    <AnimatePresence>
                      {hoveredStory === index && (
                        <motion.div
                          className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          initial={{ x: '-100%' }}
                          animate={{ x: '200%' }}
                          exit={{ x: '200%' }}
                          transition={{ 
                            duration: 1.2, 
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 0.5
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div 
                    className="p-4 md:p-6 bg-white"
                    animate={{
                      backgroundColor: hoveredStory === index ? 'rgb(255, 250, 250)' : 'rgb(255, 255, 255)',
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.h3 
                      className="text-lg md:text-xl font-semibold mb-2 transition-colors duration-400"
                      animate={{
                        color: hoveredStory === index ? 'rgb(244, 63, 94)' : 'rgb(31, 41, 55)',
                        x: hoveredStory === index ? 5 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {story.couple}
                    </motion.h3>
                    <motion.p 
                      className="text-sm md:text-base text-gray-600 italic"
                      animate={{
                        opacity: hoveredStory === index ? 1 : 0.8,
                        y: hoveredStory === index ? -2 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {story.story}
                    </motion.p>
                  </motion.div>
                </div>

                {/* Sparkle effect on corners - hide on mobile */}
                <AnimatePresence>
                  {hoveredStory === index && (
                    <motion.div
                      className="hidden md:block absolute top-2 right-2 text-yellow-400"
                      initial={{ opacity: 0, scale: 0, rotate: 0 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1.2, 1, 0],
                        rotate: [0, 180, 360],
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 0.3
                      }}
                    >
                      <Sparkles className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link href="/stories">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-golden-500 to-golden-500 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2 text-sm md:text-base"
              >
                <span>Read More Stories</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gradient-to-r from-golden-500 to-golden-500 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
              Ready to Find Your Soulmate?
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-6 md:mb-8">
              Join thousands of happy couples who found love through KalyanautsavaMat
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-golden-600 px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-200 text-base md:text-lg"
              >
                Get Started Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-golden-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Everything you need to know about KalyanautsavaMat
            </p>
          </motion.div>

          <div className="space-y-3 md:space-y-4">
            {[
              {
                question: "How does KalyanautsavaMat work?",
                answer: "KalyanautsavaMat uses advanced matching algorithms to connect compatible individuals based on their preferences, values, interests, and lifestyle. Simply create a profile, set your preferences, and start connecting with potential matches."
              },
              {
                question: "Is KalyanautsavaMat free to use?",
                answer: "Yes! We offer a free basic membership that allows you to create a profile, browse matches, and send limited messages. For unlimited messaging, advanced search filters, and premium features, you can upgrade to our Premium or VIP plans."
              },
              {
                question: "How do I ensure my profile stands out?",
                answer: "Upload clear, recent photos, write a genuine and detailed bio, be honest about your interests and values, and regularly update your profile. Premium members also get priority visibility in search results."
              },
              {
                question: "Is my information safe and secure?",
                answer: "Absolutely! We use bank-level encryption to protect your data. Your personal information is never shared without your consent. We have strict privacy policies and verification processes to ensure a safe environment for all members."
              },
              {
                question: "How long does it take to find a match?",
                answer: "While success varies for each individual, many of our members report meaningful connections within the first few weeks. Stay active, keep your profile updated, and be patient - the right person is worth the wait!"
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your premium subscription at any time from your account settings. You'll continue to have access to premium features until the end of your billing period."
              },
              {
                question: "What makes KalyanautsavaMat different from other platforms?",
                answer: "We focus on meaningful relationships, not casual dating. Our verification process ensures authentic profiles, and our matching algorithm considers values, compatibility, and long-term potential. Plus, we provide personalized support throughout your journey."
              },
              {
                question: "How do I verify my profile?",
                answer: "Profile verification is simple! Upload a government-issued ID and take a selfie. Our team reviews and approves verifications within 24 hours. Verified profiles get a special badge and higher visibility."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer p-4 md:p-6 font-semibold text-gray-800 text-base md:text-lg list-none">
                    <span className="flex items-center gap-2 md:gap-3 pr-4">
                      <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-golden-100 text-golden-600 font-bold text-xs md:text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-left">{faq.question}</span>
                    </span>
                    <motion.span
                      className="text-golden-600 text-2xl flex-shrink-0"
                      animate={{ rotate: 0 }}
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.span>
                  </summary>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 md:px-6 pb-4 md:pb-6 pt-2 text-gray-600 leading-relaxed text-sm md:text-base"
                  >
                    {faq.answer}
                  </motion.div>
                </details>
              </motion.div>
            ))}
          </div>

          {/* Still have questions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8 md:mt-12"
          >
            <p className="text-gray-600 mb-4 text-sm md:text-base">Still have questions?</p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-golden-500 to-golden-500 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 text-sm md:text-base"
              >
                Contact Support
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
