import { ProfileInteractor } from '../interactors/profile.interactor';
import { ProfileEntity } from '../entities/profile.entity';
import { PatientEntity } from '../entities/patient.entity';

interface View {
  displayProfile(profile: ProfileEntity, patient: PatientEntity): void;
  displayError(message: string): void;
}

export class ProfilePresenter {
  private interactor: ProfileInteractor;
  private view: View;

  constructor(view: View) {
    this.view = view;
    this.interactor = new ProfileInteractor();
  }

  async loadProfile(userId: number) {
    try {
      const profile = await this.interactor.fetchProfile(userId);
      const patient = await this.interactor.fetchPatient(profile.id);
      this.view.displayProfile(profile, patient);
    } catch (error) {
      this.view.displayError('Failed to load profile');
    }
  }
}