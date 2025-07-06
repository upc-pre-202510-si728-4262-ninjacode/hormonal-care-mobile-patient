// ProfileContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { FullDataProfileEntity } from '../../modules/profile/entities/profile.entity';

interface ProfileContextProps {
  profile: FullDataProfileEntity | null;
  setProfile: (profile: FullDataProfileEntity | null) => void;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<FullDataProfileEntity | null>(null);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
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