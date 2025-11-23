'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileView from './[id]/ProfileView';

export default function MyPublicProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is registered
    const isRegistered = localStorage.getItem('isRegistered') === 'true';
    if (!isRegistered) {
      router.push('/login');
      return;
    }

    // Build user profile from localStorage data
    const userName = localStorage.getItem('userName') || 'Guest User';
    const userPhone = localStorage.getItem('userPhone') || '';
    const userEducation = localStorage.getItem('userEducation') || '';
    const profilePhoto = localStorage.getItem('profilePhoto') || '';
    
    // Get gallery images from localStorage
    const savedGallery = localStorage.getItem('galleryImages');
    let galleryImages: string[] = [];
    
    if (savedGallery) {
      try {
        galleryImages = JSON.parse(savedGallery);
      } catch (e) {
        console.error('Error parsing gallery images:', e);
      }
    }

    // Create profile object matching the ProfileView interface
    const profile = {
      id: 0, // Current user's profile
      name: userName,
      age: 25, // Default - can be updated from Profile Setting
      profession: 'Professional', // Default - can be updated from Profile Setting
      location: 'India', // Default - can be updated from Profile Setting
      image: profilePhoto || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      gender: 'Not Specified',
      height: '5\'6"',
      religion: 'Not Specified',
      caste: 'Not Specified',
      motherTongue: 'Not Specified',
      maritalStatus: 'Never Married',
      education: userEducation || 'Not Specified',
      college: 'Not Specified',
      employedIn: 'Not Specified',
      income: 'Not Specified',
      familyType: 'Not Specified',
      fatherOccupation: 'Not Specified',
      motherOccupation: 'Not Specified',
      siblings: 'Not Specified',
      bio: 'Welcome to my profile! I am looking forward to finding my life partner through EternalBond.',
      hobbies: ['Reading', 'Traveling', 'Music', 'Sports'],
      email: 'user@email.com', // Can be updated from Profile Setting
      phone: userPhone || 'Not Specified',
      gallery: galleryImages.length > 0 ? galleryImages : [
        profilePhoto || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
    };

    setUserProfile(profile);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return <ProfileView profile={userProfile} isOwnProfile={true} />;
}
