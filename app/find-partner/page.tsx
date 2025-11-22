'use client';

import { motion } from 'framer-motion';
import { Search, Filter, Heart, MapPin, Briefcase, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function FindPartnerPage() {
  const [showResults, setShowResults] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [burstingHeart, setBurstingHeart] = useState<number | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    gender: '',
    ageFrom: '',
    ageTo: '',
    religion: '',
    location: '',
    profession: '',
    heightFrom: '',
    heightTo: '',
    maritalStatus: '',
    education: '',
    income: '',
  });

  const searchResults = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 28,
      height: "5'6\"",
      profession: 'Software Engineer',
      location: 'New York, USA',
      education: 'Masters in Computer Science',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      matchScore: 95,
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 32,
      height: "5'10\"",
      profession: 'Doctor',
      location: 'Los Angeles, USA',
      education: 'MD in Medicine',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      matchScore: 92,
    },
    {
      id: 3,
      name: 'Priya Sharma',
      age: 26,
      height: "5'4\"",
      profession: 'Teacher',
      location: 'Mumbai, India',
      education: 'Bachelors in Education',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      matchScore: 88,
    },
    {
      id: 4,
      name: 'James Wilson',
      age: 30,
      height: "6'0\"",
      profession: 'Architect',
      location: 'London, UK',
      education: 'Masters in Architecture',
      image: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=400',
      matchScore: 90,
    },
  ];

  const handleSearch = () => {
    setShowResults(true);
    // Scroll to results section
    setTimeout(() => {
      document.getElementById('search-results')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleClearFilters = () => {
    setSearchFilters({
      gender: '',
      ageFrom: '',
      ageTo: '',
      religion: '',
      location: '',
      profession: '',
      heightFrom: '',
      heightTo: '',
      maritalStatus: '',
      education: '',
      income: '',
    });
    setShowResults(false);
  };

  const toggleLike = (profileId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle like state
    if (likedProfiles.includes(profileId)) {
      setLikedProfiles(likedProfiles.filter(id => id !== profileId));
    } else {
      setLikedProfiles([...likedProfiles, profileId]);
      // Trigger burst animation
      setBurstingHeart(profileId);
      setTimeout(() => setBurstingHeart(null), 600);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-rose-100 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="text-rose-600 text-sm font-medium">
              Advanced Partner Search
            </span>
          </motion.div>

          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Find Your{' '}
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Perfect Partner
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Use our advanced filters to discover your ideal match
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-pink-100"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Filter className="w-5 h-5 text-rose-500" />
            <h2 className="text-2xl font-bold text-gray-800">Search Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Looking For
              </label>
              <select
                className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={searchFilters.gender}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, gender: e.target.value })
                }
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age From
              </label>
              <input
                type="number"
                placeholder="18"
                className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={searchFilters.ageFrom}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, ageFrom: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age To
              </label>
              <input
                type="number"
                placeholder="50"
                className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={searchFilters.ageTo}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, ageTo: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Religion
              </label>
              <select
                className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={searchFilters.religion}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, religion: e.target.value })
                }
              >
                <option value="">All Religions</option>
                <option value="christianity">Christianity</option>
                <option value="islam">Islam</option>
                <option value="hinduism">Hinduism</option>
                <option value="buddhism">Buddhism</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="City, Country"
                className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={searchFilters.location}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, location: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profession
              </label>
              <input
                type="text"
                placeholder="e.g., Engineer"
                className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={searchFilters.profession}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, profession: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marital Status
              </label>
              <select
                className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={searchFilters.maritalStatus}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, maritalStatus: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="never-married">Never Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level
              </label>
              <select
                className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={searchFilters.education}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, education: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="high-school">High School</option>
                <option value="bachelors">Bachelors</option>
                <option value="masters">Masters</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income
              </label>
              <select
                className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={searchFilters.income}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, income: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="0-30k">$0 - $30,000</option>
                <option value="30k-60k">$30,000 - $60,000</option>
                <option value="60k-100k">$60,000 - $100,000</option>
                <option value="100k+">$100,000+</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search Partners</span>
            </motion.button>
            <button
              onClick={handleClearFilters}
              className="px-8 py-4 bg-pink-100 text-rose-500 rounded-lg font-semibold hover:bg-pink-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {showResults && (
          <>
            <div id="search-results" className="mb-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-800"
              >
                Search Results{' '}
                <span className="text-gray-500 font-normal text-lg">
                  ({searchResults.length} profiles found)
                </span>
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-pink-100"
                >
                  <div className="relative h-72 overflow-hidden group">
                    <img
                      src={result.image}
                      alt={result.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {result.matchScore}% Match
                    </div>
                    
                    {/* Heart Button with Burst Animation */}
                    <div className="absolute top-4 right-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => toggleLike(result.id, e)}
                        className="relative bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transition-colors"
                      >
                        <Heart 
                          className={`w-5 h-5 transition-colors ${
                            likedProfiles.includes(result.id) 
                              ? 'text-rose-500 fill-rose-500' 
                              : 'text-rose-500'
                          }`} 
                        />
                      </motion.button>

                      {/* Burst Animation Hearts */}
                      {burstingHeart === result.id && (
                        <>
                          {[...Array(12)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{
                                x: 0,
                                y: 0,
                                scale: 1,
                                opacity: 1,
                              }}
                              animate={{
                                x: Math.cos((i * 30) * Math.PI / 180) * (60 + Math.random() * 40),
                                y: Math.sin((i * 30) * Math.PI / 180) * (60 + Math.random() * 40),
                                scale: 0,
                                opacity: 0,
                              }}
                              transition={{
                                duration: 0.6,
                                ease: 'easeOut',
                              }}
                              className="absolute top-2 right-2 pointer-events-none"
                            >
                              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                            </motion.div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {result.name}, {result.age}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{result.height}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <Briefcase className="w-4 h-4 text-rose-500" />
                        <span>{result.profession}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <span>{result.location}</span>
                      </div>
                    </div>

                    <Link href={`/members/${result.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-2 rounded-lg hover:shadow-md transition-all duration-200 font-medium"
                      >
                        View Full Profile
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
