import { getUserData } from '../../../common/storage/tokenStorage';
import { AuthInteractor } from '../../auth/interactors/authInteractor';

export class NavigationInteractor {
  private authInteractor: AuthInteractor;
  
  constructor() {
    this.authInteractor = new AuthInteractor();
  }
  
  async checkAuthState(): Promise<boolean> {
    try {
      const userData = await getUserData();
      if (userData && userData.token) {
        const hasProfile = await this.authInteractor.checkProfileExists(userData.id);
        return hasProfile;
      }
      return false;
    } catch (error) {
      console.error('Error checking auth state:', error);
      return false;
    }
  }
}