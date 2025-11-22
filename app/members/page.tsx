'use client';

import { motion } from 'framer-motion';
import { Filter, Heart, MapPin, Briefcase, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function MembersPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [burstingHeart, setBurstingHeart] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    gender: '',
    ageFrom: '',
    ageTo: '',
    religion: '',
    location: '',
    profession: '',
    height: '',
    maritalStatus: '',
  });

  const toggleLike = (memberId: number) => {
    if (likedProfiles.includes(memberId)) {
      setLikedProfiles(likedProfiles.filter((id) => id !== memberId));
    } else {
      setLikedProfiles([...likedProfiles, memberId]);
      setBurstingHeart(memberId);
      setTimeout(() => setBurstingHeart(null), 600);
    }
  };

  const members = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 28,
      height: "5'6\"",
      profession: 'Software Engineer',
      location: 'New York, USA',
      religion: 'Christianity',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 32,
      height: "5'10\"",
      profession: 'Doctor',
      location: 'Los Angeles, USA',
      religion: 'Buddhism',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      name: 'Priya Sharma',
      age: 26,
      height: "5'4\"",
      profession: 'Teacher',
      location: 'Mumbai, India',
      religion: 'Hinduism',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 4,
      name: 'James Wilson',
      age: 30,
      height: "6'0\"",
      profession: 'Architect',
      location: 'London, UK',
      religion: 'Christianity',
      image: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 5,
      name: 'Aisha Ahmed',
      age: 27,
      height: "5'5\"",
      profession: 'Marketing Manager',
      location: 'Dubai, UAE',
      religion: 'Islam',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 6,
      name: 'David Martinez',
      age: 35,
      height: "5'11\"",
      profession: 'Business Owner',
      location: 'Madrid, Spain',
      religion: 'Christianity',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 7,
      name: 'Yuki Tanaka',
      age: 29,
      height: "5'3\"",
      profession: 'Graphic Designer',
      location: 'Tokyo, Japan',
      religion: 'Buddhism',
      image: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 8,
      name: 'Omar Hassan',
      age: 31,
      height: "5'9\"",
      profession: 'Civil Engineer',
      location: 'Cairo, Egypt',
      religion: 'Islam',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-golden-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Browse{' '}
            <span className="bg-gradient-to-r from-golden-500 to-golden-500 bg-clip-text text-transparent">
              Members
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Find your perfect match from {members.length} amazing profiles
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-golden-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-golden-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    value={filters.gender}
                    onChange={(e) =>
                      setFilters({ ...filters, gender: e.target.value })
                    }
                  >
                    <option value="">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="From"
                      className="px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                      value={filters.ageFrom}
                      onChange={(e) =>
                        setFilters({ ...filters, ageFrom: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="To"
                      className="px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                      value={filters.ageTo}
                      onChange={(e) =>
                        setFilters({ ...filters, ageTo: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religion
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    value={filters.religion}
                    onChange={(e) =>
                      setFilters({ ...filters, religion: e.target.value })
                    }
                  >
                    <option value="">All</option>
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
                    className="w-full px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
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
                    className="w-full px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    value={filters.profession}
                    onChange={(e) =>
                      setFilters({ ...filters, profession: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    value={filters.maritalStatus}
                    onChange={(e) =>
                      setFilters({ ...filters, maritalStatus: e.target.value })
                    }
                  >
                    <option value="">All</option>
                    <option value="never-married">Never Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>

                <button className="w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                  Apply Filters
                </button>
                <button
                  onClick={() =>
                    setFilters({
                      gender: '',
                      ageFrom: '',
                      ageTo: '',
                      religion: '',
                      location: '',
                      profession: '',
                      height: '',
                      maritalStatus: '',
                    })
                  }
                  className="w-full bg-pink-100 text-golden-600 py-3 rounded-lg font-semibold hover:bg-pink-200 transition-all duration-200"
                >
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>

          <div className="flex-1">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(true)}
                className="w-full bg-white border border-golden-200 px-4 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-golden-50 transition-colors"
              >
                <Filter className="w-5 h-5 text-golden-600" />
                <span className="font-medium text-gray-700">Show Filters</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-golden-100"
                >
                  <div className="relative h-72 overflow-hidden group">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Heart button with burst animation */}
                    <div className="absolute top-4 right-4">
                      <motion.button
                        onClick={() => toggleLike(member.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg z-10"
                      >
                        <motion.div
                          animate={
                            likedProfiles.includes(member.id)
                              ? {
                                  scale: [1, 1.3, 1],
                                }
                              : {}
                          }
                          transition={{ duration: 0.3 }}
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors duration-200 ${
                              likedProfiles.includes(member.id)
                                ? 'text-red-500 fill-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </motion.div>
                      </motion.button>

                      {/* Burst animation particles */}
                      {burstingHeart === member.id && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(8)].map((_, i) => {
                            const angle = (i * 360) / 8;
                            const x = Math.cos((angle * Math.PI) / 180) * 40;
                            const y = Math.sin((angle * Math.PI) / 180) * 40;
                            
                            return (
                              <motion.div
                                key={i}
                                className="absolute top-1/2 left-1/2"
                                initial={{
                                  x: 0,
                                  y: 0,
                                  opacity: 1,
                                  scale: 1,
                                }}
                                animate={{
                                  x: x,
                                  y: y,
                                  opacity: 0,
                                  scale: 0,
                                }}
                                transition={{
                                  duration: 0.6,
                                  ease: 'easeOut',
                                }}
                              >
                                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {member.name}, {member.age}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{member.height}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <Briefcase className="w-4 h-4 text-golden-600" />
                        <span>{member.profession}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 text-golden-600" />
                        <span>{member.location}</span>
                      </div>
                    </div>

                    <Link href={`/members/${member.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-2 rounded-lg hover:shadow-md transition-all duration-200 font-medium"
                      >
                        View Profile
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex justify-center"
            >
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-pink-100 text-golden-600 rounded-lg hover:bg-pink-200 transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-golden-500 to-golden-500 text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 bg-pink-100 text-golden-600 rounded-lg hover:bg-pink-200 transition-colors">
                  2
                </button>
                <button className="px-4 py-2 bg-pink-100 text-golden-600 rounded-lg hover:bg-pink-200 transition-colors">
                  3
                </button>
                <button className="px-4 py-2 bg-pink-100 text-golden-600 rounded-lg hover:bg-pink-200 transition-colors">
                  Next
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
