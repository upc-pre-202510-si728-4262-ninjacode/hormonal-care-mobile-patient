// ProfileContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FullDataProfileEntity } from '../../modules/profile/entities/profile.entity';
import { ProfileInteractor } from '../../modules/profile/interactors/profile.interactor';
import { useAuth } from './AuthContext';

interface ProfileContextProps {
  profile: FullDataProfileEntity | null;
  setProfile: (profile: FullDataProfileEntity | null) => void;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<FullDataProfileEntity | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const profileInteractor = new ProfileInteractor();

  const refreshProfile = async () => {
    if (!user?.id) {
      console.log('ProfileContext: No user found, skipping profile load');
      return;
    }

    setLoading(true);
    setError(null);
    console.log('ProfileContext: Loading profile for user:', user.id);

    try {
      const fullProfile = await profileInteractor.fetchFullProfileData(user.id);
      console.log('ProfileContext: Profile loaded successfully:', fullProfile);
      setProfile(fullProfile);
    } catch (err: any) {
      console.error('ProfileContext: Error loading profile:', err);
      
      // Don't set error if it's just a network issue - let the app continue
      if (err?.response?.status === 404) {
        setError('Profile not found');
      } else if (err?.message?.includes('Network Error')) {
        console.log('ProfileContext: Network error, but continuing without profile');
        setError(null); // Don't block the UI for network errors
      } else {
        setError('Error loading profile');
      }
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load profile when user is authenticated
  useEffect(() => {
    if (user?.id) {
      console.log('ProfileContext: User authenticated, loading profile...');
      refreshProfile();
    } else {
      console.log('ProfileContext: User not authenticated, clearing profile');
      setProfile(null);
      setError(null);
    }
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading, error, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};