import { ProfileEntity } from '../entities/profile.entity';
import { API_URL } from '@env'

export class ProfileInteractor {
  private baseUrl = API_URL;

  async fetchProfileById(profileId: number): Promise<ProfileEntity> {
    const response = await fetch(`${this.baseUrl}/${profileId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  }

  async updateProfile(profileId: number, profile: ProfileEntity): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${profileId}/full-update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
  }

  async updatePhoneNumber(profileId: number, phoneNumber: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${profileId}/phoneNumber`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });
    if (!response.ok) {
      throw new Error('Failed to update phone number');
    }
  }
}