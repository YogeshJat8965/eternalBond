'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Heart, MapPin, Briefcase, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageProvider';

export default function MembersPage() {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [burstingHeart, setBurstingHeart] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ show: boolean; message: string; name: string }>({
    show: false,
    message: '',
    name: ''
  });
  const [filters, setFilters] = useState({
    gender: '',
    ageFrom: '',
    ageTo: '',
    religion: '',
    location: '',
    profession: '',
    height: '',
    maritalStatus: '',
    caste: '',
    education: '',
  });

  const showNotification = (name: string) => {
    setNotification({ 
      show: true, 
      message: t('YOU_LIKED'), 
      name: name 
    });
    setTimeout(() => {
      setNotification({ show: false, message: '', name: '' });
    }, 3000);
  };

  const toggleLike = (memberId: number, memberName: string) => {
    if (likedProfiles.includes(memberId)) {
      setLikedProfiles(likedProfiles.filter((id) => id !== memberId));
    } else {
      setLikedProfiles([...likedProfiles, memberId]);
      setBurstingHeart(memberId);
      showNotification(memberName);
      setTimeout(() => setBurstingHeart(null), 600);
    }
  };

  const members = [
    {
      id: 1,
      name: t('PROFILE_1_NAME'),
      age: 28,
      height: "5'6\"",
      profession: t('PROFILE_1_PROFESSION'),
      location: t('PROFILE_1_LOCATION'),
      religion: t('RELIGION_CHRISTIANITY'),
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      name: t('PROFILE_2_NAME'),
      age: 32,
      height: "5'10\"",
      profession: t('PROFILE_2_PROFESSION'),
      location: t('PROFILE_2_LOCATION'),
      religion: t('RELIGION_BUDDHISM'),
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      name: t('PROFILE_3_NAME'),
      age: 26,
      height: "5'4\"",
      profession: t('PROFILE_3_PROFESSION'),
      location: t('PROFILE_3_LOCATION'),
      religion: t('RELIGION_HINDUISM'),
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 4,
      name: t('PROFILE_4_NAME'),
      age: 30,
      height: "6'0\"",
      profession: t('PROFILE_4_PROFESSION'),
      location: t('PROFILE_4_LOCATION'),
      religion: t('RELIGION_CHRISTIANITY'),
      image: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 5,
      name: 'Aisha Ahmed',
      age: 27,
      height: "5'5\"",
      profession: 'Marketing Manager',
      location: 'Dubai, UAE',
      religion: t('RELIGION_ISLAM'),
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 6,
      name: 'David Martinez',
      age: 35,
      height: "5'11\"",
      profession: 'Business Owner',
      location: 'Madrid, Spain',
      religion: t('RELIGION_CHRISTIANITY'),
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 7,
      name: t('PROFILE_7_NAME'),
      age: 29,
      height: "5'3\"",
      profession: t('PROFILE_7_PROFESSION'),
      location: t('PROFILE_7_LOCATION'),
      religion: t('RELIGION_BUDDHISM'),
      image: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 8,
      name: t('PROFILE_8_NAME'),
      age: 31,
      height: "5'9\"",
      profession: t('PROFILE_8_PROFESSION'),
      location: t('PROFILE_8_LOCATION'),
      religion: t('RELIGION_ISLAM'),
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-golden-50 to-white">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-20 left-1/2 z-50 bg-white rounded-2xl shadow-2xl p-4 border-2 border-pink-200 min-w-[300px]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-pink-100 p-2 rounded-full">
                <Heart className="w-6 h-6 text-pink-600 fill-pink-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-semibold text-sm">
                  {notification.message} <span className="text-golden-600">{notification.name}</span>! 💕
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{t('INTEREST_SENT_SUCCESSFULLY')}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <span className="bg-gradient-to-r from-golden-500 to-golden-500 bg-clip-text text-transparent">
              {t('BROWSE_MEMBERS')}
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            {t('FIND_PROFILES_COUNT').replace('{count}', members.length.toString())}
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
                  <h2 className="text-xl font-semibold text-gray-800">{t('FILTERS')}</h2>
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
                    {t('GENDER')}
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    value={filters.gender}
                    onChange={(e) =>
                      setFilters({ ...filters, gender: e.target.value })
                    }
                  >
                    <option value="">{t('ALL')}</option>
                    <option value="male">{t('MALE')}</option>
                    <option value="female">{t('FEMALE')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('AGE_RANGE')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder={t('FROM')}
                      className="px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                      value={filters.ageFrom}
                      onChange={(e) =>
                        setFilters({ ...filters, ageFrom: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder={t('TO')}
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
                    {t('RELIGION')}
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    value={filters.religion}
                    onChange={(e) =>
                      setFilters({ ...filters, religion: e.target.value })
                    }
                  >
                    <option value="">{t('ALL')}</option>
                    <option value="christianity">Christianity</option>
                    <option value="islam">Islam</option>
                    <option value="hinduism">Hinduism</option>
                    <option value="buddhism">Buddhism</option>
                    <option value="sikhism">Sikhism</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('LOCATION')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('CITY_COUNTRY')}
                    className="w-full px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('PROFESSION')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('EG_ENGINEER')}
                    className="w-full px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    value={filters.profession}
                    onChange={(e) =>
                      setFilters({ ...filters, profession: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caste
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Caste"
                    className="w-full px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    value={filters.caste}
                    onChange={(e) =>
                      setFilters({ ...filters, caste: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    value={filters.education}
                    onChange={(e) =>
                      setFilters({ ...filters, education: e.target.value })
                    }
                  >
                    <option value="">{t('ALL')}</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="mbbs">MBBS</option>
                    <option value="md">MD</option>
                    <option value="btech">B.Tech</option>
                    <option value="mtech">M.Tech</option>
                    <option value="ca">CA (Chartered Accountant)</option>
                    <option value="cs">CS (Company Secretary)</option>
                    <option value="diploma">Diploma</option>
                    <option value="12th">12th Pass</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('MARITAL_STATUS')}
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                    value={filters.maritalStatus}
                    onChange={(e) =>
                      setFilters({ ...filters, maritalStatus: e.target.value })
                    }
                  >
                    <option value="">{t('ALL')}</option>
                    <option value="never-married">{t('NEVER_MARRIED')}</option>
                    <option value="divorced">{t('DIVORCED')}</option>
                    <option value="widowed">{t('WIDOWED')}</option>
                  </select>
                </div>

                <button className="w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                  {t('APPLY_FILTERS')}
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
                      caste: '',
                      education: '',
                    })
                  }
                  className="w-full bg-pink-100 text-golden-600 py-3 rounded-lg font-semibold hover:bg-pink-200 transition-all duration-200"
                >
                  {t('CLEAR_ALL_FILTERS')}
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
                <span>{t('SHOW_FILTERS')}</span>
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
                        onClick={() => toggleLike(member.id, member.name)}
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

                    <Link href={`/profile/${member.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-2 rounded-lg hover:shadow-md transition-all duration-200 font-medium"
                      >
                        {t('VIEW_PROFILE')}
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
                  {t('PREVIOUS')}
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
                  {t('NEXT')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
