import { apiClient } from '../../../config/api';
import { FullDataProfileEntity, ProfileEntity } from '../entities/profile.entity';
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

  async fetchFullProfileData(userId: number): Promise<FullDataProfileEntity> {
    const profile = await this.fetchProfile(userId);
    const patient = await this.fetchPatient(profile.id);
    const fullData : FullDataProfileEntity = {
      id: profile.id,
      fullName: profile.fullName,
      gender: profile.gender,
      phoneNumber: profile.phoneNumber,
      image: profile.image,
      birthday: profile.birthday,
      typeOfBlood: patient.typeOfBlood,
      personalHistory: patient.personalHistory,
      familyHistory: patient.familyHistory,
      doctorId: patient.doctorId,
    }
    return fullData;
  }

}
