import { apiClient } from '../../../config/api';
import { ProfileEntity } from '../entities/profile.entity';
import { PatientEntity } from '../entities/patient.entity';

export class ProfileInteractor {
  async fetchProfile(userId: number): Promise<ProfileEntity> {
    const response = await apiClient.get(`/api/v1/profile/profile/userId/${userId}`);
    return response.data as ProfileEntity;
  }

  async fetchPatient(profileId: number): Promise<PatientEntity> {
    const response = await apiClient.get(`/api/v1/medical-record/patient/${profileId}`);
    return response.data as PatientEntity;
  }
}
