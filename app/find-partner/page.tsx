'use client';

import { motion } from 'framer-motion';
import { Search, Filter, Heart, MapPin, Briefcase, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageProvider';
import api from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';

interface Member {
  _id: string;
  name: string;
  dateOfBirth: string;
  age?: number;
  height: string;
  profession: string;
  city: string;
  state: string;
  country: string;
  religion: string;
  education: string;
  profilePicture?: string;
  photos?: string[];
  maritalStatus?: string;
  annualIncome?: string;
}

export default function FindPartnerPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [burstingHeart, setBurstingHeart] = useState<string | null>(null);
  const [togglingShortlist, setTogglingShortlist] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    gender: '',
    ageFrom: '',
    ageTo: '',
    religion: '',
    city: '',
    state: '',
    country: '',
    profession: '',
    heightFrom: '',
    heightTo: '',
    maritalStatus: '',
    education: '',
    annualIncome: '',
  });

  // Initialize filters from URL params on component mount
  useEffect(() => {
    const gender = searchParams.get('gender') || '';
    const profession = searchParams.get('profession') || '';
    const city = searchParams.get('city') || '';
    const caste = searchParams.get('caste') || '';
    const maritalStatus = searchParams.get('maritalStatus') || '';
    const autoSearch = searchParams.get('autoSearch') === 'true';

    // Update filters if URL params exist
    if (gender || profession || city || caste || maritalStatus) {
      setSearchFilters(prev => ({
        ...prev,
        gender,
        profession,
        city,
        maritalStatus,
      }));

      // Auto-trigger search if autoSearch flag is set
      if (autoSearch) {
        setTimeout(() => {
          handleSearch({
            ...searchFilters,
            gender,
            profession,
            city,
            maritalStatus,
          });
        }, 500);
      }
    }
  }, [searchParams]);


  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fetch shortlist status for members
  const fetchShortlistStatus = async (memberIds: string[]) => {
    try {
      const shortlistedIds: string[] = [];
      await Promise.all(
        memberIds.map(async (memberId) => {
          try {
            const response = await api.get(`/shortlist/check/${memberId}`);
            if (response.data.isShortlisted) {
              shortlistedIds.push(memberId);
            }
          } catch (error) {
            // Ignore errors for individual checks
          }
        })
      );
      setLikedProfiles(shortlistedIds);
    } catch (error) {
      console.error('Error fetching shortlist status:', error);
    }
  };

  // Toggle shortlist
  const toggleShortlist = async (memberId: string, memberName: string) => {
    if (togglingShortlist === memberId) return; // Prevent double clicks
    
    try {
      setTogglingShortlist(memberId);
      const isCurrentlyLiked = likedProfiles.includes(memberId);
      
      if (isCurrentlyLiked) {
        // Remove from shortlist
        await api.delete(`/shortlist/${memberId}`);
        setLikedProfiles(likedProfiles.filter((id) => id !== memberId));
        toast.success(`${memberName} removed from shortlist`);
      } else {
        // Add to shortlist
        await api.post('/shortlist', { userId: memberId });
        setLikedProfiles([...likedProfiles, memberId]);
        setBurstingHeart(memberId);
        setTimeout(() => setBurstingHeart(null), 600);
        toast.success(`${memberName} added to shortlist! ❤️`);
      }
    } catch (error: any) {
      console.error('Error toggling shortlist:', error);
      toast.error(error.response?.data?.message || 'Failed to update shortlist');
    } finally {
      setTogglingShortlist(null);
    }
  };

  // Fetch shortlist status when members change
  useEffect(() => {
    if (members.length > 0) {
      const memberIds = members.map(m => m._id);
      fetchShortlistStatus(memberIds);
    }
  }, [members]);

  const handleSearch = async (filtersToUse?: typeof searchFilters) => {
    try {
      setLoading(true);
      setShowResults(true);
      
      // Use provided filters or current state filters
      const filters = filtersToUse || searchFilters;
      
      console.log('handleSearch called with filters:', filters);
      
      // Build query parameters
      const params: any = {
        page: currentPage,
        limit: 12
      };
      
      // Add filters only if they have values
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value) {
          params[key] = value;
        }
      });
      
      console.log('Sending API request with params:', params);
      
      const response = await api.get('/search', { params });
      console.log('Search response:', response.data);
      
      const data = response.data.data || response.data;
      const membersWithAge = data.map((member: Member) => ({
        ...member,
        age: calculateAge(member.dateOfBirth)
      }));
      
      setMembers(membersWithAge);
      setTotalResults(response.data.total || 0);
      
      // Fetch shortlist status for the members
      if (membersWithAge.length > 0) {
        const memberIds = membersWithAge.map((m: Member) => m._id);
        await fetchShortlistStatus(memberIds);
      }
      
      // Scroll to results section
      setTimeout(() => {
        document.getElementById('search-results')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.response?.data?.message || 'Failed to search members');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchFilters({
      gender: '',
      ageFrom: '',
      ageTo: '',
      religion: '',
      city: '',
      state: '',
      country: '',
      profession: '',
      heightFrom: '',
      heightTo: '',
      maritalStatus: '',
      education: '',
      annualIncome: '',
    });
    setShowResults(false);
    setMembers([]);
    setTotalResults(0);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-golden-50 to-white">
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
            className="inline-flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-sm font-medium">
              {t('ADVANCED_PARTNER_SEARCH')}
            </span>
          </motion.div>

          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            {t('FIND_YOUR_PERFECT_PARTNER')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Use our advanced filters to discover your ideal match
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-golden-100"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Filter className="w-5 h-5 text-golden-600" />
            <h2 className="text-2xl font-bold text-gray-800">{t('SEARCH_FILTERS')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('LOOKING_FOR')}
              </label>
              <select
                className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
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
                className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
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
                className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
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
                className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                value={searchFilters.religion}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, religion: e.target.value })
                }
              >
                <option value="">All Religions</option>
                <option value="Hindu">Hinduism</option>
                <option value="Muslim">Islam</option>
                <option value="Christian">Christianity</option>
                <option value="Sikh">Sikhism</option>
                <option value="Buddhist">Buddhism</option>
                <option value="Jain">Jainism</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="e.g., Mumbai"
                className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                value={searchFilters.city}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, city: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profession
              </label>
              <select
                className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                value={searchFilters.profession}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, profession: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Engineer">Engineer</option>
                <option value="Doctor">Doctor</option>
                <option value="Teacher">Teacher</option>
                <option value="Business">Business</option>
                <option value="Lawyer">Lawyer</option>
                <option value="Accountant">Accountant</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marital Status
              </label>
              <select
                className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                value={searchFilters.maritalStatus}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, maritalStatus: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level
              </label>
              <select
                className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                value={searchFilters.education}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, education: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="High School">High School</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income
              </label>
              <select
                className="w-full px-4 py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                value={searchFilters.annualIncome}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, annualIncome: e.target.value })
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
              onClick={() => handleSearch()}
              className="flex-1 bg-gradient-to-r from-golden-500 to-golden-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>{t('SEARCH_PARTNERS')}</span>
            </motion.button>
            <button
              onClick={handleClearFilters}
              className="px-8 py-4 bg-pink-100 text-golden-600 rounded-lg font-semibold hover:bg-pink-200 transition-colors"
            >
              {t('CLEAR_FILTERS')}
            </button>
          </div>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-golden-600 animate-spin" />
            <span className="ml-3 text-xl text-gray-600">Searching for your perfect match...</span>
          </div>
        )}

        {showResults && !loading && (
          <>
            <div id="search-results" className="mb-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-800"
              >
                Search Results{' '}
                <span className="text-gray-500 font-normal text-lg">
                  ({totalResults} profiles found)
                </span>
              </motion.h2>
            </div>

            {members.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-600 mb-4">No members found matching your criteria</p>
                <p className="text-gray-500">Try adjusting your filters to see more results</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.map((result, index) => {
                  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                  const profileImage = result.profilePicture 
                    ? (result.profilePicture.startsWith('/') ? `${API_URL}${result.profilePicture}` : `${API_URL}/uploads/${result.profilePicture}`)
                    : '/images/default-avatar.png';
                  
                  return (
                <motion.div
                  key={result._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-golden-100"
                >
                  <div className="relative h-72 overflow-hidden group">
                    <Link href={`/profile/${result._id}`}>
                      <img
                        src={profileImage}
                        alt={result.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                      />
                    </Link>
                    
                    <div className="absolute top-4 right-4">
                      <motion.button
                        onClick={() => toggleShortlist(result._id, result.name)}
                        disabled={togglingShortlist === result._id}
                        whileHover={{ scale: togglingShortlist === result._id ? 1 : 1.1 }}
                        whileTap={{ scale: togglingShortlist === result._id ? 1 : 0.9 }}
                        className="relative bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <motion.div
                          animate={
                            likedProfiles.includes(result._id)
                              ? { scale: [1, 1.3, 1] }
                              : {}
                          }
                          transition={{ duration: 0.3 }}
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors duration-200 ${
                              likedProfiles.includes(result._id)
                                ? 'text-red-500 fill-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </motion.div>
                      </motion.button>

                      {burstingHeart === result._id && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(8)].map((_, i) => {
                            const angle = (i * 360) / 8;
                            const x = Math.cos((angle * Math.PI) / 180) * 40;
                            const y = Math.sin((angle * Math.PI) / 180) * 40;
                            
                            return (
                              <motion.div
                                key={i}
                                className="absolute top-1/2 left-1/2"
                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                animate={{ x: x, y: y, opacity: 0, scale: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
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
                      {result.name}, {result.age}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{result.height || 'Not specified'}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <Briefcase className="w-4 h-4 text-golden-600" />
                        <span>{result.profession || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 text-golden-600" />
                        <span>{result.city}, {result.state || result.country}</span>
                      </div>
                    </div>

                    <Link href={`/profile/${result._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-2 rounded-lg hover:shadow-md transition-all duration-200 font-medium"
                      >
                        View Full Profile
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
