 'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Users, Award, ArrowRight, Sparkles, Quote, ChevronLeft, ChevronRight, Star, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/context/LanguageProvider';
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    lookingFor: '',
    profession: '',
    city: '',
    caste: '',
    maritalStatus: '',
  });
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  // Fetch testimonials from database
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}/testimonials`);
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data.slice(0, 6)); // Show only first 6
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Fallback to default testimonials if API fails
        setTestimonials([
          {
            _id: '1',
            name: t('TESTIMONIAL_1_NAME'),
            message: t('TESTIMONIAL_1_CONTENT'),
            rating: 5,
            position: t('TESTIMONIAL_1_ROLE'),
          }
        ]);
      }
    };
    fetchTestimonials();
  }, [t]);

  // Fetch FAQs from database
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`${API_URL}/faqs`);
        if (response.ok) {
          const data = await response.json();
          setFaqs(data.filter((faq: any) => faq.isActive).slice(0, 8)); // Show only first 8 active FAQs
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };
    fetchFAQs();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonials]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const heroImages = [heroSection1, heroSection2, heroSection3];

  // Handle quick search submission
  const handleQuickSearch = () => {
    // Build query parameters from search data
    const queryParams = new URLSearchParams();
    
    // Map lookingFor to gender
    if (searchData.lookingFor === 'bride') {
      queryParams.append('gender', 'female');
    } else if (searchData.lookingFor === 'groom') {
      queryParams.append('gender', 'male');
    }
    
    // Add other filters
    if (searchData.profession) queryParams.append('profession', searchData.profession);
    if (searchData.city) queryParams.append('city', searchData.city);
    if (searchData.caste) queryParams.append('caste', searchData.caste);
    if (searchData.maritalStatus) queryParams.append('maritalStatus', searchData.maritalStatus);
    
    // Add auto-search flag
    queryParams.append('autoSearch', 'true');
    
    // Navigate to find-partner page with filters
    router.push(`/find-partner?${queryParams.toString()}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const featuredProfiles = [
    {
      id: 1,
      name: t('PROFILE_1_NAME'),
      age: 28,
      profession: t('PROFILE_1_PROFESSION'),
      location: t('PROFILE_1_LOCATION'),
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      gender: 'Female',
      height: '5\'6"',
      religion: 'Christian',
      caste: 'Not Specified',
      motherTongue: 'English',
      maritalStatus: 'Never Married',
      education: 'Master\'s in Computer Science',
      college: 'Stanford University',
      employedIn: 'Private Sector',
      income: '$120,000 per year',
      familyType: 'Nuclear Family',
      fatherOccupation: 'Business Owner',
      motherOccupation: 'Homemaker',
      siblings: '1 Sister',
      bio: 'Passionate about technology and innovation. Love traveling, reading, and trying new cuisines. Looking for someone who shares similar values and has a good sense of humor.',
      hobbies: ['Reading', 'Traveling', 'Cooking', 'Yoga'],
      email: 'sarah.j@email.com',
      phone: '+1-555-0101',
      gallery: [
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
    },
    {
      id: 2,
      name: t('PROFILE_2_NAME'),
      age: 32,
      profession: t('PROFILE_2_PROFESSION'),
      location: t('PROFILE_2_LOCATION'),
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      gender: 'Male',
      height: '5\'10"',
      religion: 'Buddhist',
      caste: 'Not Applicable',
      motherTongue: 'Mandarin',
      maritalStatus: 'Never Married',
      education: 'MD - Cardiology',
      college: 'UCLA Medical School',
      employedIn: 'Government/Public Sector',
      income: '$150,000 per year',
      familyType: 'Nuclear Family',
      fatherOccupation: 'Professor',
      motherOccupation: 'Doctor',
      siblings: '1 Brother',
      bio: 'Dedicated medical professional with a passion for helping others. Enjoy hiking, photography, and spending time with family. Seeking a life partner who values health, family, and personal growth.',
      hobbies: ['Hiking', 'Photography', 'Music', 'Volunteering'],
      email: 'michael.chen@email.com',
      phone: '+1-555-0102',
      gallery: [
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1484810/pexels-photo-1484810.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
    },
    {
      id: 3,
      name: t('PROFILE_3_NAME'),
      age: 26,
      profession: t('PROFILE_3_PROFESSION'),
      location: t('PROFILE_3_LOCATION'),
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      gender: 'Female',
      height: '5\'4"',
      religion: 'Hindu',
      caste: 'Brahmin',
      motherTongue: 'Hindi',
      maritalStatus: 'Never Married',
      education: 'Bachelor of Education',
      college: 'Delhi University',
      employedIn: 'Private Sector',
      income: '₹6,00,000 per year',
      familyType: 'Joint Family',
      fatherOccupation: 'Retired Government Officer',
      motherOccupation: 'Homemaker',
      siblings: '2 Brothers',
      bio: 'Educator with a love for literature and arts. Believe in traditional values with a modern outlook. Looking for someone who respects family and values education.',
      hobbies: ['Dancing', 'Painting', 'Reading', 'Gardening'],
      email: 'priya.sharma@email.com',
      phone: '+91-9876543210',
      gallery: [
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
    },
    {
      id: 4,
      name: t('PROFILE_4_NAME'),
      age: 30,
      profession: t('PROFILE_4_PROFESSION'),
      location: t('PROFILE_4_LOCATION'),
      image: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=400',
      gender: 'Male',
      height: '6\'0"',
      religion: 'Christian',
      caste: 'Not Specified',
      motherTongue: 'English',
      maritalStatus: 'Never Married',
      education: 'Master\'s in Architecture',
      college: 'University of Cambridge',
      employedIn: 'Private Sector',
      income: '£85,000 per year',
      familyType: 'Nuclear Family',
      fatherOccupation: 'Engineer',
      motherOccupation: 'Teacher',
      siblings: '1 Sister',
      bio: 'Creative architect passionate about sustainable design. Love exploring new cultures and cuisines. Seeking an intelligent and caring partner to share life\'s adventures.',
      hobbies: ['Sketching', 'Travel', 'Cycling', 'Photography'],
      email: 'james.wilson@email.com',
      phone: '+44-7700-900123',
      gallery: [
        'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
    },
    {
      id: 5,
      name: t('PROFILE_5_NAME'),
      age: 29,
      profession: t('PROFILE_5_PROFESSION'),
      location: t('PROFILE_5_LOCATION'),
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      gender: 'Female',
      height: '5\'5"',
      religion: 'Catholic',
      caste: 'Not Applicable',
      motherTongue: 'Spanish',
      maritalStatus: 'Never Married',
      education: 'MBA in Marketing',
      college: 'University of Toronto',
      employedIn: 'Private Sector',
      income: 'CAD 95,000 per year',
      familyType: 'Nuclear Family',
      fatherOccupation: 'Business Owner',
      motherOccupation: 'Social Worker',
      siblings: '1 Brother, 1 Sister',
      bio: 'Dynamic professional with a creative mindset. Love fitness, fashion, and meaningful conversations. Looking for an ambitious partner who values family and personal growth.',
      hobbies: ['Fitness', 'Fashion', 'Cooking', 'Traveling'],
      email: 'emily.rodriguez@email.com',
      phone: '+1-416-555-0105',
      gallery: [
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
    },
    {
      id: 6,
      name: t('PROFILE_6_NAME'),
      age: 31,
      profession: t('PROFILE_6_PROFESSION'),
      location: t('PROFILE_6_LOCATION'),
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
      gender: 'Male',
      height: '5\'9"',
      religion: 'Christian',
      caste: 'Not Applicable',
      motherTongue: 'Korean',
      maritalStatus: 'Never Married',
      education: 'Master\'s in Business Analytics',
      college: 'National University of Singapore',
      employedIn: 'Private Sector',
      income: 'SGD 110,000 per year',
      familyType: 'Nuclear Family',
      fatherOccupation: 'Businessman',
      motherOccupation: 'Accountant',
      siblings: 'Single Child',
      bio: 'Analytical thinker with a passion for data and technology. Enjoy sports, music, and exploring new restaurants. Seeking a compatible partner who is understanding and supportive.',
      hobbies: ['Sports', 'Music', 'Gaming', 'Traveling'],
      email: 'david.kim@email.com',
      phone: '+65-9123-4567',
      gallery: [
        'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1484810/pexels-photo-1484810.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
    },
  ];

  const stats = [
    { icon: Users, label: t('STATS_ACTIVE_MEMBERS'), value: 50, suffix: 'K+' },
    { icon: Heart, label: t('STATS_SUCCESS_STORIES'), value: 10, suffix: 'K+' },
    { icon: Award, label: t('STATS_YEARS_TRUST'), value: 15, suffix: '+' },
  ];

  const successStories = [
    {
      couple: t('STORY_1_COUPLE'),
      story: t('STORY_1_TEXT'),
      image: emmaAndDavid,
    },
    {
      couple: t('STORY_2_COUPLE'),
      story: t('STORY_2_TEXT'),
      image: sophiaAndRyan,
    },
    {
      couple: t('STORY_3_COUPLE'),
      story: t('STORY_3_TEXT'),
      image: aishaAndOmar,
    },
    {
      couple: t('STORY_4_COUPLE'),
      story: t('STORY_4_TEXT'),
      image: priyaAndArjun,
    },
    {
      couple: t('STORY_5_COUPLE'),
      story: t('STORY_5_TEXT'),
      image: isabellaAndLucas,
    },
    {
      couple: t('STORY_6_COUPLE'),
      story: t('STORY_6_TEXT'),
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
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 md:space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center space-x-2 bg-white/95 backdrop-blur-md px-4 py-2 md:px-5 md:py-2.5 rounded-full shadow-xl border border-golden-200"
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700 text-xs sm:text-sm md:text-base font-semibold">
                  Discover Your Forever
                </span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
                <span className="block">{t('FIND_YOUR')}</span>
                <span className="block mt-2">
                  <RotatingWords 
                    className="bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent"
                    words={[t('PERFECT_MATCH'), t('TRUE_LOVE'), t('SOULMATE'), t('FOREVER_PARTNER')]}
                  />
                </span>
                <span className="block mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-5xl">
                  {t('AND_START_JOURNEY')}
                </span>
              </h1>
            </motion.div>

            {/* Right Side - Quick Partner Search Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/95 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-2xl shadow-2xl border border-golden-100"
            >
              <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 mb-3 md:mb-4 lg:mb-6">
                {t('QUICK_PARTNER_SEARCH')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4 lg:mb-6">
                <select
                  className="px-3 py-2 md:px-4 md:py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 text-sm md:text-base"
                  value={searchData.lookingFor}
                  onChange={(e) =>
                    setSearchData({ ...searchData, lookingFor: e.target.value })
                  }
                >
                  <option value="">Looking for</option>
                  <option value="bride">Bride</option>
                  <option value="groom">Groom</option>
                </select>
                <select
                  className="px-3 py-2 md:px-4 md:py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 text-sm md:text-base"
                  value={searchData.profession}
                  onChange={(e) =>
                    setSearchData({ ...searchData, profession: e.target.value })
                  }
                >
                  <option value="">Profession</option>
                  <option value="engineer">Engineer</option>
                  <option value="doctor">Doctor</option>
                  <option value="teacher">Teacher</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="City"
                  className="px-3 py-2 md:px-4 md:py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 text-sm md:text-base"
                  value={searchData.city}
                  onChange={(e) =>
                    setSearchData({ ...searchData, city: e.target.value })
                  }
                />
                <select
                  className="px-3 py-2 md:px-4 md:py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 text-sm md:text-base"
                  value={searchData.caste}
                  onChange={(e) =>
                    setSearchData({ ...searchData, caste: e.target.value })
                  }
                >
                  <option value="">Caste</option>
                  <option value="brahmin">Brahmin</option>
                  <option value="kshatriya">Kshatriya</option>
                  <option value="vaishya">Vaishya</option>
                  <option value="shudra">Shudra</option>
                  <option value="other">Other</option>
                </select>
                <select
                  className="px-3 py-2 md:px-4 md:py-3 border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 text-sm md:text-base sm:col-span-2"
                  value={searchData.maritalStatus}
                  onChange={(e) =>
                    setSearchData({ ...searchData, maritalStatus: e.target.value })
                  }
                >
                  <option value="">Marital Status</option>
                  <option value="never-married">Never Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                  <option value="awaiting-divorce">Awaiting Divorce</option>
                </select>
              </div>
              <button 
                onClick={handleQuickSearch}
                className="w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-2.5 md:py-3 lg:py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
                <span>{t('SEARCH_NOW')}</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 md:py-20 pb-8 md:pb-10 bg-gradient-to-br from-white via-golden-50/30 to-lavender-50/30 relative z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-golden-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-lavender-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
              <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-3 md:space-x-4 bg-red-50 px-8 md:px-12 py-4 md:py-6 rounded-full mb-6"
            >
              <Heart className="w-8 h-8 md:w-10 md:h-10 text-red-700" />
              <span className="text-xl md:text-2xl lg:text-3xl font-bold text-red-700">{t('ABOUT_TITLE')}</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
              {t('WHERE_TRUE_LOVE')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('ABOUT_DESC')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="prose prose-lg">
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  {t('ABOUT_FOUNDED')}
                  <span className="font-semibold text-golden-600"> {t('BRAND')}</span> {t('ABOUT_COMBINES')}
                </p>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  {t('ABOUT_WITH_OVER')} <span className="font-bold text-golden-600">{t('YEARS_EXPERIENCE')}</span>{t('ABOUT_HELPED')}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-xl shadow-md border border-golden-100"
                >
                  <div className="text-2xl font-bold text-golden-600 mb-1">100%</div>
                  <div className="text-sm text-gray-600">{t('VERIFIED_PROFILES')}</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-xl shadow-md border border-golden-100"
                >
                  <div className="text-2xl font-bold text-golden-600 mb-1">24/7</div>
                  <div className="text-sm text-gray-600">{t('SUPPORT_AVAILABLE')}</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-br from-golden-50 to-lavender-50 p-6 rounded-2xl border border-golden-100 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-golden-500 to-golden-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{t('PRIVACY_SECURITY')}</h3>
                    <p className="text-gray-600 text-sm">{t('PRIVACY_DESC')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-lavender-50 to-golden-50 p-6 rounded-2xl border border-lavender-100 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{t('VERIFIED_PROFILES_TITLE')}</h3>
                    <p className="text-gray-600 text-sm">{t('VERIFIED_DESC')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-golden-50 to-white p-6 rounded-2xl border border-golden-100 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{t('SUCCESS_STORIES_TITLE')}</h3>
                    <p className="text-gray-600 text-sm">{t('SUCCESS_DESC')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pt-0 pb-12 md:pb-20 bg-gradient-to-br from-white via-golden-50/30 to-lavender-50/30 relative z-10">
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

      <section className="py-12 md:py-20 relative z-10" style={{ backgroundColor: '#FFF9E7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
              {t('FEATURED_PROFILES')}
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              {t('MEET_MEMBERS')}
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
                  className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden border border-golden-100"
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
                    <Link href={`/profile/${profile.id}`}>
                      <button className="mt-4 w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-2 rounded-lg hover:shadow-md transition-all duration-200">
                        {t('VIEW_PROFILE')}
                      </button>
                    </Link>
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
                className="bg-white rounded-2xl overflow-hidden border border-golden-100"
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
                  <Link href={`/profile/${profile.id}`}>
                    <button className="w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-2 text-sm rounded-lg hover:shadow-md transition-all duration-200">
                      {t('VIEW_PROFILE')}
                    </button>
                  </Link>
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
                <span>{t('VIEW_ALL_MEMBERS')}</span>
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
              {t('SUCCESS_STORIES')}
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              {t('REAL_COUPLES')}
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

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-lavender-50 via-white to-golden-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t('WHAT_MEMBERS_SAY')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {t('HEAR_FROM_MEMBERS')}
            </p>
          </motion.div>

          {/* Testimonial Slider */}
          <div className="relative max-w-4xl mx-auto">
            {testimonials.length > 0 ? (
            <>
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white shadow-2xl border border-golden-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="p-6 sm:p-8 md:p-12 lg:p-16"
                >
                  {/* Quote Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex justify-center mb-4 md:mb-6"
                  >
                    <div className="bg-gradient-to-br from-golden-400 to-golden-600 p-3 md:p-4 rounded-full">
                      <Quote className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                  </motion.div>

                  {/* Stars */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center gap-1 md:gap-2 mb-4 md:mb-6"
                  >
                    {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <Star className="w-5 h-5 md:w-6 md:h-6 text-golden-500 fill-golden-500" />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Content */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-center mb-6 md:mb-8 italic px-2"
                  >
                    "{testimonials[currentTestimonial]?.message || testimonials[currentTestimonial]?.content}"
                  </motion.p>

                  {/* Name and Role */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                  >
                    <h4 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                      {testimonials[currentTestimonial]?.name}
                    </h4>
                    <p className="text-golden-600 font-medium text-sm md:text-base">
                      {testimonials[currentTestimonial]?.position || testimonials[currentTestimonial]?.role}
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-golden-600 group-hover:text-golden-700" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-golden-600 group-hover:text-golden-700" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6 md:mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentTestimonial
                      ? 'bg-golden-500 w-8 h-3'
                      : 'bg-golden-200 w-3 h-3 hover:bg-golden-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            </>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <p className="text-gray-600">Loading testimonials...</p>
              </div>
            )}
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
              {t('READY_FIND_SOULMATE')}
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-6 md:mb-8">
              {t('JOIN_HAPPY_COUPLES')}
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-golden-600 px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-200 text-base md:text-lg"
              >
                {t('GET_STARTED_NOW')}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-golden-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
              {t('FAQ_TITLE')}
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              {t('FAQ_SUBTITLE')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {faqs.length > 0 ? faqs.map((faq, index) => (
              <motion.div
                key={faq._id}
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
            )) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                Loading FAQs...
              </div>
            )}
          </div>

          {/* Still have questions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8 md:mt-12"
          >
            <p className="text-gray-600 mb-4 text-sm md:text-base">{t('STILL_HAVE_QUESTIONS')}</p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-golden-500 to-golden-500 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 text-sm md:text-base"
              >
                {t('CONTACT_SUPPORT')}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
