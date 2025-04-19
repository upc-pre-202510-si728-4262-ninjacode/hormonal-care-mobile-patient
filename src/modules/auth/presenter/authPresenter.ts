import { useState } from 'react';
import authInteractor from '../interactor/authInteractor';
import authService from '../service/authService';
import { LoginRequest, RegisterRequest, PatientProfileRequest, AuthState } from '../entity/authEntity';

export const useAuthPresenter = () => {
  const initialState: AuthState = {
    isAuthenticated: false,
    user: {
      id: null,
      username: null,
      role: null,
    },
    loading: false,
    error: null,
    needsProfile: false,
  };

  const [authState, setAuthState] = useState<AuthState>(initialState);

  const login = async (credentials: LoginRequest) => {
    try {
      setAuthState({ ...authState, loading: true, error: null });
      
      const response = await authInteractor.login(credentials);
      
      // Check if user has a profile
      const hasProfile = await authInteractor.checkProfileExists(response.id);
      
      setAuthState({
        isAuthenticated: true,
        user: {
          id: response.id,
          username: response.username,
          role: response.role,
        },
        loading: false,
        error: null,
        needsProfile: !hasProfile,
      });
      
      return { success: true, needsProfile: !hasProfile };
    } catch (error: any) {
      setAuthState({
        ...authState,
        loading: false,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setAuthState({ ...authState, loading: true, error: null });
      
      const response = await authInteractor.register(userData);
      
      setAuthState({
        isAuthenticated: true,
        user: {
          id: response.id,
          username: response.username,
          role: response.role,
        },
        loading: false,
        error: null,
        needsProfile: true, // New users always need to create a profile
      });
      
      return { success: true };
    } catch (error: any) {
      setAuthState({
        ...authState,
        loading: false,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  const createProfile = async (profileData: PatientProfileRequest) => {
    try {
      setAuthState({ ...authState, loading: true, error: null });
      
      await authInteractor.createPatientProfile(profileData);
      
      setAuthState({
        ...authState,
        loading: false,
        needsProfile: false,
      });
      
      return { success: true };
    } catch (error: any) {
      setAuthState({
        ...authState,
        loading: false,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authInteractor.logout();
      setAuthState(initialState);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    authState,
    setAuthState, // Agregar esta línea para exportar setAuthState
    login,
    register,
    createProfile,
    logout,
  };
};