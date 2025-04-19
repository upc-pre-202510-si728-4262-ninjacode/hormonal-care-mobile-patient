import { useState, useEffect } from 'react';
import profileInteractor from '../interactor/profileInteractor';
import { ProfileState, ProfileData } from '../entity/profileEntity';
import { useAuthPresenter } from '../../auth/presenter/authPresenter';

export const useProfilePresenter = () => {
  const initialState: ProfileState = {
    loading: false,
    error: null,
    profile: null,
  };

  const [profileState, setProfileState] = useState<ProfileState>(initialState);
  const { logout } = useAuthPresenter();

  const fetchProfile = async () => {
    try {
      setProfileState({ ...profileState, loading: true, error: null });
      
      const profile = await profileInteractor.getProfile();
      
      setProfileState({
        loading: false,
        error: null,
        profile,
      });
    } catch (error: any) {
      setProfileState({
        ...profileState,
        loading: false,
        error: error.message,
      });
    }
  };

  const updateProfile = async (profileData: Partial<ProfileData>) => {
    try {
      setProfileState({ ...profileState, loading: true, error: null });
      
      const updatedProfile = await profileInteractor.updateProfile({
        ...profileState.profile,
        ...profileData,
      } as ProfileData);
      
      setProfileState({
        loading: false,
        error: null,
        profile: updatedProfile,
      });
      
      return { success: true };
    } catch (error: any) {
      setProfileState({
        ...profileState,
        loading: false,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profileState,
    refreshProfile: fetchProfile,
    updateProfile,
    logout: handleLogout,
  };
};