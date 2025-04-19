import api from '../../../config/api';
import storageService from '../../../common/services/storageService';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RegisterResponse,
  PatientProfileRequest
} from '../entity/authEntity';

const AUTH_ENDPOINTS = {
  SIGN_IN: '/api/v1/authentication/sign-in',
  SIGN_UP: '/api/v1/authentication/sign-up',
  PROFILE_EXISTS: '/api/v1/profile/profile/userId/exists',
  CREATE_PATIENT: '/api/v1/medical-record/patient',
};

const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>(AUTH_ENDPOINTS.SIGN_IN, credentials);
      
      // Store token and user data
      await storageService.saveToken(data.token);
      await storageService.saveUserData({
        id: data.id,
        username: data.username,
        role: data.role,
      });
      
      return data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        throw new Error('Credenciales inválidas');
      }
      throw new Error('Error en el inicio de sesión');
    }
  },

  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const { data } = await api.post<RegisterResponse>(AUTH_ENDPOINTS.SIGN_UP, userData);
      return data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        throw new Error('Nombre de usuario ya existe');
      }
      throw new Error('Error en el registro');
    }
  },

  checkProfileExists: async (userId: number): Promise<boolean> => {
    try {
      const { data } = await api.get<boolean>(`${AUTH_ENDPOINTS.PROFILE_EXISTS}/${userId}`);
      return data;
    } catch (error) {
      throw new Error('Error verificando perfil');
    }
  },

  createPatientProfile: async (profileData: PatientProfileRequest): Promise<any> => {
    try {
      const { data } = await api.post(AUTH_ENDPOINTS.CREATE_PATIENT, profileData);
      return data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        throw new Error('El número telefónico ya existe');
      }
      throw new Error('Error creando perfil');
    }
  },

  logout: async (): Promise<void> => {
    await storageService.clearAuthData();
  },
};

export default authService;