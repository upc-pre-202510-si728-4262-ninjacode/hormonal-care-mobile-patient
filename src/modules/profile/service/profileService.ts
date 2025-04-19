import api from '../../../config/api';
import { ProfileData } from '../entity/profileEntity';
import storageService from '../../../common/services/storageService';

const PROFILE_ENDPOINTS = {
  GET_PROFILE: '/api/v1/medical-record/patient/user',
  UPDATE_PROFILE: '/api/v1/medical-record/patient',
};

const profileService = {
  getProfile: async (): Promise<ProfileData> => {
    try {
      const userId = await storageService.getUserId();
      if (!userId) {
        throw new Error('No user ID found');
      }
      
      const { data } = await api.get<ProfileData>(`${PROFILE_ENDPOINTS.GET_PROFILE}/${userId}`);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (profileData: Partial<ProfileData>): Promise<ProfileData> => {
    try {
      const { data } = await api.put<ProfileData>(
        `${PROFILE_ENDPOINTS.UPDATE_PROFILE}/${profileData.id}`, 
        profileData
      );
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};

export default profileService;