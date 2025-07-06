import { FullDataProfileEntity } from "../entities/profile.entity";
import { ProfileInteractor } from "../interactors/profile.interactor";


interface ProfileViewInterface {
  showLoading: () => void;
  hideLoading: () => void;
  showError: (message: string) => void;
  showProfile: (profile: FullDataProfileEntity) => void;
}

export class ProfilePresenter {
  private profileView: ProfileViewInterface | null = null;
  private interactor : ProfileInteractor;
  
  constructor(interactor: ProfileInteractor) {
    this.interactor = interactor;
  }

  attachProfileView(view: ProfileViewInterface) {
    this.profileView = view;
  }

  async loadProfile(userId: number) {
    if (!this.profileView) return;

    try {
      this.profileView.showLoading();
      const profile = await this.interactor.fetchFullProfileData(userId);
      this.profileView.showProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      this.profileView.showError('Failed to load profile');
    } finally {
      setTimeout(() => {
        this.profileView?.hideLoading();
      }, 1000);
    }
  }

}