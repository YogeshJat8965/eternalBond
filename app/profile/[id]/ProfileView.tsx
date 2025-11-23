'use client';

import { motion } from 'framer-motion';
import { 
  ArrowLeft, Heart, MapPin, Briefcase, GraduationCap, Home, 
  Calendar, Ruler, Globe, Book, Sparkles,
  Award, CheckCircle, MessageCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PetalAnimation from '@/components/animations/PetalAnimation';

type ProfileType = {
  id: number;
  name: string;
  age: number;
  profession: string;
  location: string;
  image: string;
  gender: string;
  height: string;
  religion: string;
  caste: string;
  motherTongue: string;
  maritalStatus: string;
  education: string;
  college: string;
  employedIn: string;
  income: string;
  familyType: string;
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  bio: string;
  hobbies: string[];
  email: string;
  phone: string;
  gallery: string[];
} | null;

export default function ProfileView({ profile, isOwnProfile = false }: { profile: ProfileType; isOwnProfile?: boolean }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (!profile) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="text-golden-600 hover:text-golden-700 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden" style={{ backgroundColor: '#FFF9E7' }}>
      <PetalAnimation />

      {/* Header with Back Button */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => isOwnProfile ? router.push('/dashboard') : router.push('/')}
          className="flex items-center gap-2 text-gray-700 hover:text-golden-600 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          {isOwnProfile ? 'Back to Dashboard' : 'Back to Profiles'}
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            {/* Main Image */}
            <div className="bg-white rounded-3xl overflow-hidden border border-golden-100 mb-6">
              <div className="relative h-96 overflow-hidden">
                <img
                  src={profile.gallery[selectedImage]}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">Verified</span>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className="p-4 grid grid-cols-3 gap-3">
                {profile.gallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-golden-500 shadow-lg'
                        : 'border-gray-200 hover:border-golden-300'
                    }`}
                  >
                    <img src={img} alt={`${profile.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-3xl border border-golden-100 p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-golden-500" />
                Quick Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-golden-500" />
                  <span className="text-sm"><strong>Age:</strong> {profile.age} years</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Ruler className="w-5 h-5 text-golden-500" />
                  <span className="text-sm"><strong>Height:</strong> {profile.height}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Globe className="w-5 h-5 text-golden-500" />
                  <span className="text-sm"><strong>Mother Tongue:</strong> {profile.motherTongue}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Award className="w-5 h-5 text-golden-500" />
                  <span className="text-sm"><strong>Marital Status:</strong> {profile.maritalStatus}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Only show for other profiles */}
            {!isOwnProfile && (
              <div className="mt-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    isLiked
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white border-2 border-golden-200 text-gray-700 hover:border-golden-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                  {isLiked ? 'Liked' : 'Like Profile'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-golden-400 to-golden-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Send Message
                </motion.button>
              </div>
            )}

            {/* Own Profile Message */}
            {isOwnProfile && (
              <div className="mt-6 bg-gradient-to-r from-golden-50 to-lavender-50 rounded-2xl p-6 border border-golden-200">
                <p className="text-center text-gray-700 font-medium">
                  This is how your profile appears to other members! 👀
                </p>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Update your information from Profile Settings in the dashboard
                </p>
              </div>
            )}
          </motion.div>

          {/* Right Column - Detailed Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Profile Header */}
            <div className="bg-white rounded-3xl border border-golden-100 p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{profile.name}</h1>
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-golden-500" />
                      {profile.profession}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-golden-500" />
                      {profile.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Book className="w-5 h-5 text-golden-500" />
                  About Me
                </h3>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>

              {/* Hobbies */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-golden-500" />
                  Hobbies & Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-golden-50 to-lavender-50 rounded-full text-sm font-semibold text-gray-700 border border-golden-200"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Education & Career */}
            <div className="bg-white rounded-3xl border border-golden-100 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-golden-500" />
                Education & Career
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InfoItem label="Education" value={profile.education} />
                <InfoItem label="College/University" value={profile.college} />
                <InfoItem label="Employed In" value={profile.employedIn} />
                <InfoItem label="Annual Income" value={profile.income} />
              </div>
            </div>

            {/* Religious & Cultural Background */}
            <div className="bg-white rounded-3xl border border-golden-100 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-golden-500" />
                Religious & Cultural Background
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InfoItem label="Religion" value={profile.religion} />
                <InfoItem label="Caste" value={profile.caste} />
                <InfoItem label="Mother Tongue" value={profile.motherTongue} />
                <InfoItem label="Gender" value={profile.gender} />
              </div>
            </div>

            {/* Family Details */}
            <div className="bg-white rounded-3xl border border-golden-100 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Home className="w-6 h-6 text-golden-500" />
                Family Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InfoItem label="Family Type" value={profile.familyType} />
                <InfoItem label="Father's Occupation" value={profile.fatherOccupation} />
                <InfoItem label="Mother's Occupation" value={profile.motherOccupation} />
                <InfoItem label="Siblings" value={profile.siblings} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Helper component for info items
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-800">{value}</p>
    </div>
  );
}
