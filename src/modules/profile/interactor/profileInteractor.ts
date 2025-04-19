import profileService from '../service/profileService';
import { ProfileData } from '../entity/profileEntity';

class ProfileInteractor {
  async getProfile(): Promise<ProfileData> {
    return await profileService.getProfile();
  }

  async updateProfile(profileData: Partial<ProfileData>): Promise<ProfileData> {
    return await profileService.updateProfile(profileData);
  }
}

export default new ProfileInteractor();