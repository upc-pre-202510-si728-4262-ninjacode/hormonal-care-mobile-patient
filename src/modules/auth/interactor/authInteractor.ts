import authService from '../service/authService';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  PatientProfileRequest 
} from '../entity/authEntity';

class AuthInteractor {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await authService.login(credentials);
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // 1. Register the user
    const registerResponse = await authService.register(userData);
    
    // 2. Login with the new credentials to get the token
    return await authService.login(userData);
  }

  async checkProfileExists(userId: number): Promise<boolean> {
    return await authService.checkProfileExists(userId);
  }

  async createPatientProfile(profileData: PatientProfileRequest): Promise<any> {
    return await authService.createPatientProfile(profileData);
  }

  async logout(): Promise<void> {
    await authService.logout();
  }
}

export default new AuthInteractor();