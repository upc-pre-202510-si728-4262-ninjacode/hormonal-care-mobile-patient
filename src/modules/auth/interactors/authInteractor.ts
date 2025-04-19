import { apiClient } from '../../../config/api';
import { 
  SignInRequest, 
  SignInResponse, 
  SignUpRequest, 
  SignUpResponse,
  PatientProfileRequest,
  PatientProfileResponse
} from '../entities/authEntities';
import { saveUserData, clearUserData } from '../../../common/storage/tokenStorage';

export class AuthInteractor {
  async signIn(data: SignInRequest): Promise<SignInResponse> {
    try {
      const response = await apiClient.post<SignInResponse>('/api/v1/authentication/sign-in', data);
      await saveUserData(response.data);
      return response.data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signUp(data: SignUpRequest): Promise<SignUpResponse> {
    try {
      const response = await apiClient.post<SignUpResponse>('/api/v1/authentication/sign-up', data);
      return response.data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async checkProfileExists(userId: number): Promise<boolean> {
    try {
      const response = await apiClient.get<boolean>(`/api/v1/profile/profile/userId/exists/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Check profile error:', error);
      throw error;
    }
  }

  async createPatientProfile(data: PatientProfileRequest): Promise<PatientProfileResponse> {
    try {
      const response = await apiClient.post<PatientProfileResponse>('/api/v1/medical-record/patient', data);
      return response.data;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await clearUserData();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}