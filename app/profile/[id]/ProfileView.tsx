'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Heart, MapPin, Briefcase, GraduationCap, 
  Calendar, Ruler, Globe, Book, Sparkles,
  Award, MessageCircle, DollarSign, User, Coffee, Send
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageProvider';
import InterestModal from '@/components/InterestModal';
import { toast } from 'sonner';
import api from '@/lib/api';

type ProfileType = {
  id: string;
  name: string;
  age: number;
  profession: string;
  location: string;
  image: string;
  gender: string;
  height: string;
  religion: string;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;
  maritalStatus: string;
  education: string;
  income?: string;
  complexion?: string;
  foodHabits?: string;
  bio?: string;
  email: string;
  phone: string;
  gallery: string[];
  interestAlreadySent?: boolean;
} | null;

export default function ProfileView({ profile, isOwnProfile = false }: { profile: ProfileType; isOwnProfile?: boolean }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [sendingInterest, setSendingInterest] = useState(false);
  const [interestSent, setInterestSent] = useState(profile?.interestAlreadySent || false);
  const [togglingShortlist, setTogglingShortlist] = useState(false);
  const { t } = useTranslation();

  // Check if profile is shortlisted and interest status on mount
  useEffect(() => {
    if (profile && !isOwnProfile) {
      checkShortlistStatus();
      checkInterestStatus();
    }
  }, [profile?.id, isOwnProfile]);

  const checkShortlistStatus = async () => {
    if (!profile) return;
    try {
      const response = await api.get(`/shortlist/check/${profile.id}`);
      if (response.data.success) {
        setIsLiked(response.data.isShortlisted);
      }
    } catch (error) {
      console.error('Error checking shortlist status:', error);
    }
  };

  const checkInterestStatus = async () => {
    if (!profile) return;
    try {
      const response = await api.get('/interests/sent');
      if (response.data.success) {
        const sentInterests = response.data.data || [];
        // Check if we already sent an interest to this profile
        const alreadySent = sentInterests.some(
          (interest: any) => interest.receiverId?._id === profile.id || interest.receiverId === profile.id
        );
        setInterestSent(alreadySent);
      }
    } catch (error) {
      console.error('Error checking interest status:', error);
    }
  };

  const handleToggleShortlist = async () => {
    if (!profile || togglingShortlist) return;
    
    setTogglingShortlist(true);
    try {
      if (isLiked) {
        // Remove from shortlist
        const response = await api.delete(`/shortlist/${profile.id}`);
        if (response.data.success) {
          setIsLiked(false);
          toast.success('Removed from shortlist');
        }
      } else {
        // Add to shortlist
        const response = await api.post('/shortlist', { userId: profile.id });
        if (response.data.success) {
          setIsLiked(true);
          toast.success('Added to shortlist! ❤️');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update shortlist';
      toast.error(errorMessage);
      console.error('Error toggling shortlist:', error);
    } finally {
      setTogglingShortlist(false);
    }
  };

  const handleSendInterest = async (message: string) => {
    if (!profile) return;
    
    setSendingInterest(true);
    try {
      const response = await api.post('/interests/send', {
        receiverId: profile.id,
        message: message
      });

      if (response.data.success) {
        toast.success('Interest sent successfully! 🎉');
        setInterestSent(true);
        setShowInterestModal(false);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send interest. Please try again.';
      toast.error(errorMessage);
      console.error('Error sending interest:', error);
    } finally {
      setSendingInterest(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-12 rounded-3xl shadow-xl"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-golden-100 to-pink-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-golden-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist or has been removed.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/members')}
            className="bg-gradient-to-r from-golden-500 to-golden-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 via-white to-golden-50/30">

      {/* Header with Back Button */}
      <div className="container mx-auto px-4 pt-6 pb-4 max-w-7xl">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => isOwnProfile ? router.push('/dashboard') : router.push('/members')}
          className="flex items-center gap-2 text-gray-600 hover:text-golden-600 transition-colors mb-8 font-medium group"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-lg">{isOwnProfile ? 'Back to Dashboard' : 'Back to Browse'}</span>
        </motion.button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Images & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Main Image with modern styling */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl mb-6 group">
              <div className="relative h-[500px] overflow-hidden">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={profile.gallery[selectedImage]}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Gallery Thumbnails with modern design */}
              {profile.gallery.length > 1 && (
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
                  <div className="grid grid-cols-4 gap-3">
                    {profile.gallery.slice(0, 4).map((img, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-20 rounded-xl overflow-hidden transition-all ${
                          selectedImage === index
                            ? 'ring-4 ring-golden-500 shadow-lg'
                            : 'ring-2 ring-gray-200 hover:ring-golden-300'
                        }`}
                      >
                        <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                        {selectedImage === index && (
                          <div className="absolute inset-0 bg-golden-500/20" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats with modern cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatCard icon={Calendar} label="Age" value={`${profile.age} years`} />
              <StatCard icon={Ruler} label="Height" value={profile.height} />
              {profile.motherTongue && <StatCard icon={Globe} label="Language" value={profile.motherTongue} />}
              <StatCard icon={Award} label="Status" value={profile.maritalStatus} />
            </div>

            {/* Action Buttons - Modern design */}
            {!isOwnProfile && (
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: interestSent ? 1 : 1.02 }}
                  whileTap={{ scale: interestSent ? 1 : 0.98 }}
                  onClick={() => !interestSent && setShowInterestModal(true)}
                  disabled={interestSent}
                  className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-xl transition-all group ${
                    interestSent
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-golden-500 via-golden-600 to-amber-600 text-white hover:shadow-2xl'
                  }`}
                >
                  <Send className={`w-5 h-5 ${!interestSent && 'group-hover:translate-x-1 transition-transform'}`} />
                  {interestSent ? 'Interest Sent ✓' : 'Send Interest'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggleShortlist}
                  disabled={togglingShortlist}
                  className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg ${
                    isLiked
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  } ${togglingShortlist ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {togglingShortlist ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  )}
                  {togglingShortlist ? 'Updating...' : (isLiked ? 'Shortlisted' : 'Add to Shortlist')}
                </motion.button>
              </div>
            )}

            {/* Own Profile Message - Website theme */}
            {isOwnProfile && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-golden-50 via-amber-50 to-pink-50 rounded-2xl p-8 border-2 border-golden-200 text-center shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-golden-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-800 font-semibold text-lg mb-2">This is your profile</p>
                <p className="text-gray-600 text-sm">Others see this information when they view your profile</p>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Detailed Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Profile Header - Modern design with website theme */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-golden-100 hover:shadow-2xl transition-shadow">
              <div className="mb-6">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-golden-600 via-amber-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  {profile.name}
                </h1>
                <div className="flex flex-wrap gap-4">
                  <InfoBadge icon={Briefcase} text={profile.profession} />
                  <InfoBadge icon={MapPin} text={profile.location} />
                  <InfoBadge icon={User} text={profile.gender} />
                </div>
              </div>

              {/* Bio Section - Always displayed */}
              <div className="pt-6 border-t border-golden-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-golden-100 to-amber-100 rounded-lg flex items-center justify-center">
                    <Book className="w-5 h-5 text-golden-700" />
                  </div>
                  <span className="bg-gradient-to-r from-golden-600 to-amber-600 bg-clip-text text-transparent">
                    About Me
                  </span>
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {profile.bio || 'No bio provided yet.'}
                </p>
              </div>
            </div>

            {/* Education & Career - Website theme */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-golden-100 hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-golden-400 to-golden-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-golden-600 to-amber-600 bg-clip-text text-transparent">
                  Education & Career
                </span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <DetailCard label="Education" value={profile.education} icon={GraduationCap} />
                <DetailCard label="Profession" value={profile.profession} icon={Briefcase} />
                {profile.income && profile.income !== 'Not Specified' && (
                  <DetailCard label="Annual Income" value={profile.income} icon={DollarSign} />
                )}
              </div>
            </div>

            {/* Religious & Cultural Background - Website theme */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Religious & Cultural Background
                </span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <DetailCard label="Religion" value={profile.religion} icon={Globe} />
                <DetailCard label="Marital Status" value={profile.maritalStatus} icon={Award} />
                {profile.caste && (
                  <DetailCard label="Caste" value={profile.caste.toUpperCase()} icon={Award} />
                )}
                {profile.subCaste && (
                  <DetailCard label="Sub Caste" value={profile.subCaste} icon={Award} />
                )}
                {profile.motherTongue && (
                  <DetailCard label="Mother Tongue" value={profile.motherTongue} icon={Book} />
                )}
              </div>
            </div>

            {/* Lifestyle & Preferences - Website theme */}
            {(profile.foodHabits || profile.complexion) && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100 hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Coffee className="w-6 h-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Lifestyle & Preferences
                  </span>
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {profile.foodHabits && (
                    <DetailCard label="Food Habits" value={profile.foodHabits} icon={Coffee} />
                  )}
                  {profile.complexion && (
                    <DetailCard label="Complexion" value={profile.complexion} icon={User} />
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Interest Modal */}
      {profile && (
        <InterestModal
          isOpen={showInterestModal}
          onClose={() => setShowInterestModal(false)}
          onSend={handleSendInterest}
          receiverName={profile.name}
          loading={sendingInterest}
        />
      )}
    </div>
  );
}

// Modern helper components
function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-gradient-to-br from-white to-golden-50 rounded-2xl p-4 shadow-lg border-2 border-golden-100 hover:shadow-xl transition-all"
    >
      <div className="w-8 h-8 bg-gradient-to-br from-golden-400 to-amber-500 rounded-lg flex items-center justify-center mb-2 shadow-sm">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-sm font-bold bg-gradient-to-r from-golden-700 to-amber-700 bg-clip-text text-transparent">{value}</p>
    </motion.div>
  );
}

function InfoBadge({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-golden-50 to-amber-50 rounded-full border border-golden-200 shadow-sm">
      <Icon className="w-4 h-4 text-golden-600" />
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </div>
  );
}

function DetailCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-golden-100 to-amber-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-golden-700" />
        </div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-lg font-bold text-gray-900 ml-13">{value}</p>
    </motion.div>
  );
}
