'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Briefcase, CheckCircle, Filter, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function MembersPage() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [burstingHeart, setBurstingHeart] = useState<string | null>(null);
  const [togglingShortlist, setTogglingShortlist] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ show: boolean; message: string; name: string }>({
    show: false,
    message: '',
    name: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    ageFrom: '',
    ageTo: '',
    religion: '',
    caste: '',
    subCaste: '',
    location: '',
    city: '',
    state: '',
    country: '',
    profession: '',
    heightFrom: '',
    heightTo: '',
    maritalStatus: '',
    annualIncomeFrom: '',
    annualIncomeTo: '',
    complexion: '',
    foodHabits: '',
    education: '',
    annualIncome: '',
  });

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

  // Fetch members from API
  const fetchMembers = async (page: number = 1) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params: any = {
        page,
        limit: 12
      };
      
      // Add filters only if they have values
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value) {
          // Map location to city for backward compatibility
          if (key === 'location') {
            params['city'] = value;
          } else {
            params[key] = value;
          }
        }
      });
      
      const response = await api.get('/search', { params });
      console.log('Browse members response:', response.data);
      
      const data = response.data.data || response.data;
      const membersWithAge = data.map((member: Member) => ({
        ...member,
        age: calculateAge(member.dateOfBirth)
      }));
      
      setMembers(membersWithAge);
      setTotalResults(response.data.total || 0);
      setTotalPages(response.data.totalPages || Math.ceil((response.data.total || 0) / 12));
      setCurrentPage(page);
    } catch (error: any) {
      console.error('Error fetching members:', error);
      toast.error(error.response?.data?.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  // Fetch shortlist status for current members
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

  // Load members on mount
  useEffect(() => {
    fetchMembers(1);
  }, []);

  // Fetch shortlist status when members change
  useEffect(() => {
    if (members.length > 0) {
      const memberIds = members.map(m => m._id);
      fetchShortlistStatus(memberIds);
    }
  }, [members]);

  const showNotification = (name: string) => {
    setNotification({ 
      show: true, 
      message: 'You liked', 
      name: name 
    });
    setTimeout(() => {
      setNotification({ show: false, message: '', name: '' });
    }, 3000);
  };

  const toggleLike = async (memberId: string, memberName: string) => {
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

  const handleApplyFilters = () => {
    fetchMembers(1);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      gender: '',
      ageFrom: '',
      ageTo: '',
      religion: '',
      caste: '',
      subCaste: '',
      location: '',
      city: '',
      state: '',
      country: '',
      profession: '',
      heightFrom: '',
      heightTo: '',
      maritalStatus: '',
      annualIncomeFrom: '',
      annualIncomeTo: '',
      complexion: '',
      foodHabits: '',
      education: '',
      annualIncome: '',
    });
    fetchMembers(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchMembers(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-golden-50 to-white">
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
                <p className="text-gray-500 text-xs mt-0.5">Interest sent successfully</p>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                <span className="bg-gradient-to-r from-golden-500 to-golden-600 bg-clip-text text-transparent">
                  Browse Members
                </span>
              </h1>
              <p className="text-gray-600 text-lg">
                {totalResults} profiles found
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-2 bg-golden-500 text-white rounded-lg flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-80 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-golden-600" />
                <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={filters.ageFrom}
                      onChange={(e) => setFilters({ ...filters, ageFrom: e.target.value })}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                    >
                      <option value="">From</option>
                      {Array.from({ length: 43 }, (_, i) => i + 18).map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                    <select
                      value={filters.ageTo}
                      onChange={(e) => setFilters({ ...filters, ageTo: e.target.value })}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                    >
                      <option value="">To</option>
                      {Array.from({ length: 43 }, (_, i) => i + 18).map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Religion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religion
                  </label>
                  <select
                    value={filters.religion}
                    onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Religion</option>
                    <option value="Hindu">Hinduism</option>
                    <option value="Muslim">Islam</option>
                    <option value="Christian">Christianity</option>
                    <option value="Sikh">Sikhism</option>
                    <option value="Buddhist">Buddhism</option>
                    <option value="Jain">Jainism</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Caste */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caste
                  </label>
                  <select
                    value={filters.caste}
                    onChange={(e) => setFilters({ ...filters, caste: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Caste</option>
                    <option value="brahmin">Brahmin</option>
                    <option value="kshatriya">Kshatriya</option>
                    <option value="vaishya">Vaishya</option>
                    <option value="shudra">Shudra</option>
                    <option value="jat">Jat</option>
                    <option value="rajput">Rajput</option>
                    <option value="maratha">Maratha</option>
                    <option value="other">Other</option>
                    <option value="no-caste">No Caste</option>
                  </select>
                </div>

                {/* Sub Caste */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Caste
                  </label>
                  <select
                    value={filters.subCaste}
                    onChange={(e) => setFilters({ ...filters, subCaste: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Sub Caste</option>
                    <option value="agarwal">Agarwal</option>
                    <option value="iyer">Iyer</option>
                    <option value="iyengar">Iyengar</option>
                    <option value="nair">Nair</option>
                    <option value="reddy">Reddy</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Location</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Pune">Pune</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Profession */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profession
                  </label>
                  <select
                    value={filters.profession}
                    onChange={(e) => setFilters({ ...filters, profession: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Profession</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Business">Business</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Lawyer">Lawyer</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Height Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={filters.heightFrom}
                      onChange={(e) => setFilters({ ...filters, heightFrom: e.target.value })}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                    >
                      <option value="">From</option>
                      <option value="4'6">4'6"</option>
                      <option value="4'9">4'9"</option>
                      <option value="5'0">5'0"</option>
                      <option value="5'3">5'3"</option>
                      <option value="5'6">5'6"</option>
                      <option value="5'9">5'9"</option>
                      <option value="6'0">6'0"</option>
                      <option value="6'3">6'3"</option>
                      <option value="6'6">6'6"</option>
                    </select>
                    <select
                      value={filters.heightTo}
                      onChange={(e) => setFilters({ ...filters, heightTo: e.target.value })}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                    >
                      <option value="">To</option>
                      <option value="4'9">4'9"</option>
                      <option value="5'0">5'0"</option>
                      <option value="5'3">5'3"</option>
                      <option value="5'6">5'6"</option>
                      <option value="5'9">5'9"</option>
                      <option value="6'0">6'0"</option>
                      <option value="6'3">6'3"</option>
                      <option value="6'6">6'6"</option>
                      <option value="6'9">6'9"</option>
                    </select>
                  </div>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    value={filters.maritalStatus}
                    onChange={(e) => setFilters({ ...filters, maritalStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                {/* Annual Income */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Income
                  </label>
                  <select
                    value={filters.annualIncome}
                    onChange={(e) => setFilters({ ...filters, annualIncome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Income Range</option>
                    <option value="0-2 Lakhs">0 - 2 Lakhs</option>
                    <option value="2-5 Lakhs">2 - 5 Lakhs</option>
                    <option value="5-10 Lakhs">5 - 10 Lakhs</option>
                    <option value="10-20 Lakhs">10 - 20 Lakhs</option>
                    <option value="20+ Lakhs">20+ Lakhs</option>
                  </select>
                </div>

                {/* Complexion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complexion
                  </label>
                  <select
                    value={filters.complexion}
                    onChange={(e) => setFilters({ ...filters, complexion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Complexion</option>
                    <option value="Fair">Fair</option>
                    <option value="Wheatish">Wheatish</option>
                    <option value="Dusky">Dusky</option>
                    <option value="Dark">Dark</option>
                  </select>
                </div>

                {/* Food Habits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Habits
                  </label>
                  <select
                    value={filters.foodHabits}
                    onChange={(e) => setFilters({ ...filters, foodHabits: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Food Habit</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Eggetarian">Eggetarian</option>
                  </select>
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <select
                    value={filters.education}
                    onChange={(e) => setFilters({ ...filters, education: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Education</option>
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelors">Bachelor's Degree</option>
                    <option value="Masters">Master's Degree</option>
                    <option value="PhD">PhD</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Apply Filters Button */}
                <button
                  onClick={handleApplyFilters}
                  className="w-full py-3 px-4 bg-gradient-to-r from-golden-500 to-golden-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Apply Filters
                </button>

                {/* Clear Filters Button */}
                <button
                  onClick={handleClearFilters}
                  className="w-full py-2 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Member Cards */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="w-12 h-12 text-golden-600 animate-spin" />
              </div>
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <p className="text-gray-500 text-lg mb-2">No members found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {members.map((member, index) => {
                    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                    const profileImage = member.profilePicture 
                      ? (member.profilePicture.startsWith('/') 
                          ? `${API_URL}${member.profilePicture}` 
                          : `${API_URL}/uploads/${member.profilePicture}`)
                      : '/images/default-avatar.png';
                    
                    return (
                      <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-golden-100"
                      >
                        <div className="relative h-72 overflow-hidden group">
                          <Image
                            src={profileImage}
                            alt={member.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/default-avatar.png';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="absolute top-4 right-4">
                            <motion.button
                              onClick={() => toggleLike(member._id, member.name)}
                              disabled={togglingShortlist === member._id}
                              whileHover={{ scale: togglingShortlist === member._id ? 1 : 1.1 }}
                              whileTap={{ scale: togglingShortlist === member._id ? 1 : 0.9 }}
                              className="relative bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <motion.div
                                animate={
                                  likedProfiles.includes(member._id)
                                    ? { scale: [1, 1.3, 1] }
                                    : {}
                                }
                                transition={{ duration: 0.3 }}
                              >
                                <Heart
                                  className={`w-5 h-5 transition-colors duration-200 ${
                                    likedProfiles.includes(member._id)
                                      ? 'text-red-500 fill-red-500'
                                      : 'text-gray-400'
                                  }`}
                                />
                              </motion.div>
                            </motion.button>

                            {burstingHeart === member._id && (
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
                              <span>{member.city}, {member.state || member.country}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600 text-sm">
                              <Heart className="w-4 h-4 text-golden-600" />
                              <span>{member.religion}</span>
                            </div>
                          </div>

                          <Link
                            href={`/profile/${member._id}`}
                            className="block w-full bg-gradient-to-r from-golden-500 to-golden-600 text-white text-center py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                          >
                            View Profile
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-golden-600 hover:bg-golden-50 border border-golden-200'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-golden-500 to-golden-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-golden-50 border border-gray-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-golden-600 hover:bg-golden-50 border border-golden-200'
                      }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
