import { ProfileInteractor } from '../interactors/profile.interactor';
import { ProfileEntity } from '../entities/profile.entity';

export interface ProfileView {
  displayProfile(profile: ProfileEntity): void;
  displayError(message: string): void;
}

export class ProfilePresenter {
  private interactor: ProfileInteractor;
  private view: ProfileView;

  constructor(view: ProfileView) {
    this.view = view;
    this.interactor = new ProfileInteractor();
  }

  async loadProfile(userId: number) {
    try {
      const profile = await this.interactor.fetchProfile(userId);
      this.view.displayProfile(profile); // Envía los datos a la vista
    } catch (error) {
      this.view.displayError('Failed to load profile');
    }
  }
}