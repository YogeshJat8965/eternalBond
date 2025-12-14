'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, Heart, Briefcase, 
  GraduationCap, DollarSign, Ruler, Users, Edit, Upload, 
  Trash2, Loader2, Camera, X
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { isAuthenticated } from '@/lib/auth-utils';
import Image from 'next/image';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  city: string;
  state?: string;
  country?: string;
  religion?: string;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;
  education?: string;
  profession?: string;
  annualIncome?: string;
  height?: string;
  complexion?: string;
  foodHabits?: string;
  maritalStatus: string;
  bio?: string;
  photos: string[];
  profilePicture?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deletePhotoIndex, setDeletePhotoIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/profile/me');
      console.log('Profile data:', response.data);
      setProfile(response.data.data);
      setEditForm(response.data.data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm(profile!);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditForm((prev) => ({...prev, [field]: value}));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Only send editable fields (exclude name, phone, gender, email)
      const updateData = {
        dateOfBirth: editForm.dateOfBirth,
        city: editForm.city,
        state: editForm.state,
        country: editForm.country,
        religion: editForm.religion,
        caste: editForm.caste,
        subCaste: editForm.subCaste,
        motherTongue: editForm.motherTongue,
        education: editForm.education,
        profession: editForm.profession,
        annualIncome: editForm.annualIncome,
        height: editForm.height,
        complexion: editForm.complexion,
        foodHabits: editForm.foodHabits,
        maritalStatus: editForm.maritalStatus,
        bio: editForm.bio
      };

      console.log('Sending update data:', updateData);
      const response = await api.put('/profile/me', updateData);
      console.log('Update response:', response.data);
      
      setProfile(response.data.data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;

    // Check photo limit
    if (profile && profile.photos && profile.photos.length >= 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', selectedFile);

      const response = await api.post('/profile/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Upload response:', response.data);
      
      // Update profile with new photos and profilePicture
      if (profile) {
        setProfile({
          ...profile,
          photos: response.data.data.photos || profile.photos,
          profilePicture: response.data.data.profilePicture || profile.profilePicture
        });
      }
      
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success('Photo uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = (index: number) => {
    setDeletePhotoIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDeletePhoto = async () => {
    if (deletePhotoIndex === null) return;

    try {
      const response = await api.delete(`/profile/photo/${deletePhotoIndex}`);
      
      // Update profile with new photos array
      if (profile) {
        setProfile({
          ...profile,
          photos: response.data.data.photos || profile.photos,
          profilePicture: response.data.data.profilePicture || profile.profilePicture
        });
      }
      
      toast.success('Photo deleted successfully!');
      setShowDeleteModal(false);
      setDeletePhotoIndex(null);
    } catch (error: any) {
      console.error('Error deleting photo:', error);
      toast.error(error.response?.data?.message || 'Failed to delete photo');
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-golden-50 via-lavender-50 to-golden-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-golden-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Photo?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this photo? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePhotoIndex(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletePhoto}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-pink-50 via-purple-50 to-golden-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-golden-200"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-golden-600 to-pink-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-600 mt-1">Manage your profile information and photos</p>
          </div>
          <button
            onClick={handleEditToggle}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-golden-500 to-golden-600 text-white rounded-full hover:from-golden-600 hover:to-golden-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Edit className="w-5 h-5" />
            <span className="font-semibold">{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photos */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-golden-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-golden-600 to-pink-600 bg-clip-text text-transparent">Photo Gallery</h2>
              
              {/* Profile Picture */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-golden-100 to-pink-100 shadow-lg border-4 border-white group">
                {profile.profilePicture ? (
                  <>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${profile.profilePicture.startsWith('/') ? profile.profilePicture : `/uploads/${profile.profilePicture}`}`}
                      alt={profile.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="font-semibold text-lg">{profile.name}</p>
                        <p className="text-sm">Profile Picture</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <User className="w-24 h-24 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Upload your photo</p>
                  </div>
                )}
              </div>

              {/* Photo Gallery */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {profile.photos && profile.photos.length > 0 ? (
                  profile.photos.map((photo, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-golden-50 to-pink-50 group shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${photo.startsWith('/') ? photo : `/uploads/${photo}`}`}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => handleDeletePhoto(index)}
                          className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 bg-gradient-to-br from-golden-50 to-pink-50 rounded-xl">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">No photos uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add photos to make your profile stand out</p>
                  </div>
                )}
              </div>

              {/* Upload Photo */}
              {profile.photos && profile.photos.length < 5 && (
                <div className="border-2 border-dashed border-golden-300 rounded-xl p-6 bg-gradient-to-br from-golden-50/50 to-pink-50/50 hover:border-golden-500 transition-colors duration-300">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg">
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUploadPhoto}
                          disabled={uploading}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 shadow-lg disabled:shadow-none font-semibold"
                        >
                          {uploading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> <span>Uploading...</span></>
                          ) : (
                            <><Upload className="w-5 h-5" /> <span>Upload</span></>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                          className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-md"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center space-y-3 text-gray-500 hover:text-golden-600 transition-all duration-300 py-4 group">
                        <div className="p-4 bg-gradient-to-br from-golden-100 to-pink-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                          <Camera className="w-8 h-8 text-golden-600" />
                        </div>
                        <span className="text-base font-semibold">Upload Photo</span>
                        <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full">{profile.photos?.length || 0}/5 photos</span>
                      </div>
                    </label>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-golden-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 pb-4 border-b-2 border-golden-200">
                <div className="p-2 bg-gradient-to-br from-golden-100 to-pink-100 rounded-lg">
                  <User className="w-6 h-6 text-golden-600" />
                </div>
                <span className="bg-gradient-to-r from-golden-600 to-pink-600 bg-clip-text text-transparent">Basic Information</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
                  <div className="bg-gray-100 px-4 py-3 rounded-xl border-2 border-gray-200">
                    <p className="text-gray-900 font-semibold text-lg">{profile.name}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
                  <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-xl">
                    <Mail className="w-5 h-5 text-golden-500" />
                    <p className="text-gray-900 font-medium flex-1">{profile.email}</p>
                    {profile.isEmailVerified && (
                      <span className="text-xs bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full font-semibold shadow-sm">✓ Verified</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Phone</label>
                  <div className="flex items-center space-x-3 bg-gray-100 px-4 py-3 rounded-xl border-2 border-gray-200">
                    <Phone className="w-5 h-5 text-golden-500" />
                    <p className="text-gray-900 font-medium">{profile.phone}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
                  <div className="bg-gradient-to-r from-golden-50 to-pink-50 px-4 py-3 rounded-xl border-2 border-gray-200">
                    <p className="text-gray-900 capitalize font-semibold">{profile.gender}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editForm.dateOfBirth?.split('T')[0] || ''}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-xl">
                      <Calendar className="w-5 h-5 text-golden-500" />
                      <p className="text-gray-900 font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()} <span className="text-golden-600">({calculateAge(profile.dateOfBirth)} years)</span></p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Marital Status</label>
                  {isEditing ? (
                    <select
                      value={editForm.maritalStatus || ''}
                      onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                    >
                      <option value="">Select Status</option>
                      <option value="Never Married">Never Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Awaiting Divorce">Awaiting Divorce</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-xl">
                      <Heart className="w-5 h-5 text-pink-500" />
                      <p className="text-gray-900 font-medium">{profile.maritalStatus}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-golden-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 pb-4 border-b-2 border-golden-200">
                <div className="p-2 bg-gradient-to-br from-golden-100 to-pink-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-golden-600" />
                </div>
                <span className="bg-gradient-to-r from-golden-600 to-pink-600 bg-clip-text text-transparent">Location</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white"
                      placeholder="Enter your city"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{profile.city || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">State</label>
                  {isEditing ? (
                    <select
                      value={editForm.state || ''}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{profile.state || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Country</label>
                  {isEditing ? (
                    <select
                      value={editForm.country || ''}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                    >
                      <option value="">Select Country</option>
                      <option value="India">🇮🇳 India</option>
                      <option value="United States">🇺🇸 United States</option>
                      <option value="United Kingdom">🇬🇧 United Kingdom</option>
                      <option value="Canada">🇨🇦 Canada</option>
                      <option value="Australia">🇦🇺 Australia</option>
                      <option value="United Arab Emirates">🇦🇪 UAE</option>
                      <option value="Singapore">🇸🇬 Singapore</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{profile.country || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Religious Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-golden-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 pb-4 border-b-2 border-golden-200">
                <div className="p-2 bg-gradient-to-br from-golden-100 to-pink-100 rounded-lg">
                  <Heart className="w-6 h-6 text-golden-600" />
                </div>
                <span className="bg-gradient-to-r from-golden-600 to-pink-600 bg-clip-text text-transparent">Religious Background</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Religion</label>
                  {isEditing ? (
                    <select
                      value={editForm.religion || ''}
                      onChange={(e) => handleInputChange('religion', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                    >
                      <option value="">Select Religion</option>
                      <option value="Hinduism">Hinduism</option>
                      <option value="Islam">Islam</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Sikhism">Sikhism</option>
                      <option value="Buddhism">Buddhism</option>
                      <option value="Jainism">Jainism</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{profile.religion || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Caste</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.caste || ''}
                      onChange={(e) => handleInputChange('caste', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white"
                      placeholder="Enter your caste"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{profile.caste || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Sub Caste</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.subCaste || ''}
                      onChange={(e) => handleInputChange('subCaste', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white"
                      placeholder="Enter your sub caste"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{profile.subCaste || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Mother Tongue</label>
                  {isEditing ? (
                    <select
                      value={editForm.motherTongue || ''}
                      onChange={(e) => handleInputChange('motherTongue', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                    >
                      <option value="">Select Mother Tongue</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                      <option value="Bengali">Bengali</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Gujarati">Gujarati</option>
                      <option value="Urdu">Urdu</option>
                      <option value="Kannada">Kannada</option>
                      <option value="Malayalam">Malayalam</option>
                      <option value="Odia">Odia</option>
                      <option value="Punjabi">Punjabi</option>
                      <option value="Assamese">Assamese</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{profile.motherTongue || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Professional Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-golden-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 pb-4 border-b-2 border-golden-200">
                <div className="p-2 bg-gradient-to-br from-golden-100 to-pink-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-golden-600" />
                </div>
                <span className="bg-gradient-to-r from-golden-600 to-pink-600 bg-clip-text text-transparent">Professional Details</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Education</label>
                  {isEditing ? (
                    <select
                      value={editForm.education || ''}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                    >
                      <option value="">Select Education</option>
                      <option value="High School">High School</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="PhD/Doctorate">PhD/Doctorate</option>
                      <option value="Professional Degree">Professional Degree</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-golden-500" />
                      <p className="text-gray-900 font-medium">{profile.education || 'Not specified'}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Profession</label>
                  {isEditing ? (
                    <select
                      value={editForm.profession || ''}
                      onChange={(e) => handleInputChange('profession', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                    >
                      <option value="">Select Profession</option>
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Engineer">Engineer</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Business Owner">Business Owner</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Lawyer">Lawyer</option>
                      <option value="Designer">Designer</option>
                      <option value="Manager">Manager</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Government Employee">Government Employee</option>
                      <option value="Student">Student</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{profile.profession || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Annual Income</label>
                  {isEditing ? (
                    <select
                      value={editForm.annualIncome || ''}
                      onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                    >
                      <option value="">Select Annual Income</option>
                      <option value="0-3 Lakhs">0-3 Lakhs</option>
                      <option value="3-5 Lakhs">3-5 Lakhs</option>
                      <option value="5-7 Lakhs">5-7 Lakhs</option>
                      <option value="7-10 Lakhs">7-10 Lakhs</option>
                      <option value="10-15 Lakhs">10-15 Lakhs</option>
                      <option value="15-20 Lakhs">15-20 Lakhs</option>
                      <option value="20-30 Lakhs">20-30 Lakhs</option>
                      <option value="30+ Lakhs">30+ Lakhs</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-xl">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <p className="text-gray-900 font-medium">{profile.annualIncome || 'Not specified'}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Physical Attributes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-golden-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 pb-4 border-b-2 border-golden-200">
                <div className="p-2 bg-gradient-to-br from-golden-100 to-pink-100 rounded-lg">
                  <Ruler className="w-6 h-6 text-golden-600" />
                </div>
                <span className="bg-gradient-to-r from-golden-600 to-pink-600 bg-clip-text text-transparent">Physical Attributes</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Height</label>
                  {isEditing ? (
                    <select
                      value={editForm.height || ''}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                    >
                      <option value="">Select Height</option>
                      <option value="4'6&quot; - 137cm">4'6&quot; - 137cm</option>
                      <option value="4'7&quot; - 140cm">4'7&quot; - 140cm</option>
                      <option value="4'8&quot; - 142cm">4'8&quot; - 142cm</option>
                      <option value="4'9&quot; - 145cm">4'9&quot; - 145cm</option>
                      <option value="4'10&quot; - 147cm">4'10&quot; - 147cm</option>
                      <option value="4'11&quot; - 150cm">4'11&quot; - 150cm</option>
                      <option value="5'0&quot; - 152cm">5'0&quot; - 152cm</option>
                      <option value="5'1&quot; - 155cm">5'1&quot; - 155cm</option>
                      <option value="5'2&quot; - 157cm">5'2&quot; - 157cm</option>
                      <option value="5'3&quot; - 160cm">5'3&quot; - 160cm</option>
                      <option value="5'4&quot; - 163cm">5'4&quot; - 163cm</option>
                      <option value="5'5&quot; - 165cm">5'5&quot; - 165cm</option>
                      <option value="5'6&quot; - 168cm">5'6&quot; - 168cm</option>
                      <option value="5'7&quot; - 170cm">5'7&quot; - 170cm</option>
                      <option value="5'8&quot; - 173cm">5'8&quot; - 173cm</option>
                      <option value="5'9&quot; - 175cm">5'9&quot; - 175cm</option>
                      <option value="5'10&quot; - 178cm">5'10&quot; - 178cm</option>
                      <option value="5'11&quot; - 180cm">5'11&quot; - 180cm</option>
                      <option value="6'0&quot; - 183cm">6'0&quot; - 183cm</option>
                      <option value="6'1&quot; - 185cm">6'1&quot; - 185cm</option>
                      <option value="6'2&quot; - 188cm">6'2&quot; - 188cm</option>
                      <option value="6'3&quot; - 191cm">6'3&quot; - 191cm</option>
                      <option value="6'4&quot; - 193cm">6'4&quot; - 193cm</option>
                      <option value="6'5&quot; - 196cm">6'5&quot; - 196cm</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{profile.height || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Complexion</label>
                  {isEditing ? (
                    <select
                      value={editForm.complexion || ''}
                      onChange={(e) => handleInputChange('complexion', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                    >
                      <option value="">Select Complexion</option>
                      <option value="Very Fair">Very Fair</option>
                      <option value="Fair">Fair</option>
                      <option value="Wheatish">Wheatish</option>
                      <option value="Dark">Dark</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{profile.complexion || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Food Habits</label>
                  {isEditing ? (
                    <select
                      value={editForm.foodHabits || ''}
                      onChange={(e) => handleInputChange('foodHabits', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                    >
                      <option value="">Select Food Habits</option>
                      <option value="Vegetarian">🌱 Vegetarian</option>
                      <option value="Non-Vegetarian">🍗 Non-Vegetarian</option>
                      <option value="Eggetarian">🥚 Eggetarian</option>
                      <option value="Vegan">🌿 Vegan</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">{profile.foodHabits || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* About Me */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-golden-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 pb-4 border-b-2 border-golden-200">
                <div className="p-2 bg-gradient-to-br from-golden-100 to-pink-100 rounded-lg">
                  <Users className="w-6 h-6 text-golden-600" />
                </div>
                <span className="bg-gradient-to-r from-golden-600 to-pink-600 bg-clip-text text-transparent">About Me</span>
              </h2>
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editForm.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={6}
                    maxLength={500}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-golden-400 focus:border-golden-400 transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                    placeholder="Share something about yourself, your interests, hobbies, or what you're looking for in a partner..."
                  />
                  <p className="text-sm text-gray-500 text-right">{editForm.bio?.length || 0}/500 characters</p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-golden-50 to-pink-50 p-6 rounded-xl">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {profile.bio || '📝 No bio added yet. Click "Edit Profile" to add a description about yourself.'}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Save Button */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-end space-x-4 sticky bottom-8 z-10"
              >
                <button
                  onClick={handleEditToggle}
                  className="px-10 py-4 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-10 py-4 bg-gradient-to-r from-golden-500 via-golden-600 to-pink-600 text-white rounded-full hover:from-golden-600 hover:via-golden-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 shadow-2xl hover:shadow-golden-500/50 transform hover:scale-105 font-bold text-lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <span>💾 Save All Changes</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
