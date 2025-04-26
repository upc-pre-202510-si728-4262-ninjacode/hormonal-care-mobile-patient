import { ProfileEntity } from '../entities/profile.entity';
import { ProfileInteractor } from '../interactors/profile.interactor';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ProfilePresenter {
  private interactor: ProfileInteractor;
  private view: ProfileView;

  constructor(view: ProfileView) {
    this.view = view;
    this.interactor = new ProfileInteractor();
  }

  async loadProfile(userId: number) {
    try {
      const profile = await this.interactor.fetchProfileById(userId);
      this.view.displayProfile(profile); // Envía los datos del perfil a la vista
    } catch (error) {
      this.view.displayError('Failed to load profile');
    }
  };

  async saveProfile(profileId: number, profile: ProfileEntity) {
    try {
      await this.interactor.updateProfile(profileId, profile);
      this.view.displaySuccess('Profile updated successfully');
    } catch (error) {
      this.view.displayError('Failed to update profile');
    }
  }

  async updatePhoneNumber(profileId: number, phoneNumber: string) {
    try {
      await this.interactor.updatePhoneNumber(profileId, phoneNumber);
      this.view.displaySuccess('Phone number updated successfully');
    } catch (error) {
      this.view.displayError('Failed to update phone number');
    }
  }
}

export interface ProfileView {
  displayProfile(profile: ProfileEntity): void;
  displayError(message: string): void;
  displaySuccess(message: string): void;
}