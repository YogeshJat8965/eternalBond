'use client';

import ProfileView from './ProfileView';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProfileData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  age?: number;
  city: string;
  state: string;
  country: string;
  religion: string;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;
  maritalStatus: string;
  education: string;
  profession: string;
  annualIncome?: string;
  height: string;
  complexion?: string;
  foodHabits?: string;
  bio?: string;
  profilePicture?: string;
  photos?: string[];
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const response = await api.get(`/profile/${params.id}`);
        const data = response.data.data || response.data;
        
        // Check if interest already sent to this profile
        let interestAlreadySent = false;
        try {
          const sentInterestsResponse = await api.get('/interests/sent');
          if (sentInterestsResponse.data.success) {
            const sentInterests = sentInterestsResponse.data.data || [];
            interestAlreadySent = sentInterests.some(
              (interest: any) => interest.receiverId._id === params.id || interest.receiverId === params.id
            );
          }
        } catch (interestError) {
          console.log('Could not check sent interests:', interestError);
        }
        
        data.interestAlreadySent = interestAlreadySent;
        
        // Transform backend data to match ProfileView expected format
        const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        
        // Build gallery from profile pictures
        const gallery = [];
        if (data.profilePicture) {
          const mainPic = data.profilePicture.startsWith('/') 
            ? `${API_URL}${data.profilePicture}` 
            : `${API_URL}/uploads/${data.profilePicture}`;
          gallery.push(mainPic);
        }
        if (data.photos && data.photos.length > 0) {
          data.photos.forEach((photo: string) => {
            const photoUrl = photo.startsWith('/') 
              ? `${API_URL}${photo}` 
              : `${API_URL}/uploads/${photo}`;
            gallery.push(photoUrl);
          });
        }
        
        // If no photos, add a default
        if (gallery.length === 0) {
          gallery.push('/images/default-avatar.png');
        }

        // Transform to profile format - only include fields from database
        const transformedProfile = {
          id: data._id,
          name: data.name,
          age: calculateAge(data.dateOfBirth),
          profession: data.profession || 'Not Specified',
          location: `${data.city}${data.state ? ', ' + data.state : ''}${data.country ? ', ' + data.country : ''}`,
          image: gallery[0],
          gender: data.gender.charAt(0).toUpperCase() + data.gender.slice(1),
          height: data.height,
          religion: data.religion || 'Not Specified',
          caste: data.caste,
          subCaste: data.subCaste,
          motherTongue: data.motherTongue,
          maritalStatus: data.maritalStatus || 'Not Specified',
          education: data.education || 'Not Specified',
          income: data.annualIncome,
          complexion: data.complexion,
          foodHabits: data.foodHabits,
          bio: data.bio,
          email: data.email,
          phone: data.phone,
          gallery: gallery,
        };

        setProfile(transformedProfile);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error(error.response?.data?.message || 'Failed to load profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-golden-600 animate-spin" />
      </div>
    );
  }

  return <ProfileView profile={profile} />;
}
