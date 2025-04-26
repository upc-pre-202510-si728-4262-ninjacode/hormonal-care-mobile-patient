import { useState } from 'react';
import { AuthInteractor } from '../interactors/authInteractor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  SignInRequest, 
  SignUpRequest, 
  PatientProfileRequest,
  SignInResponse
} from '../entities/authEntities';

export const useAuthPresenter = (authInteractor: AuthInteractor) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (data: SignInRequest): Promise<SignInResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authInteractor.signIn(data);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign in');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpRequest): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authInteractor.signUp(data);
      return response.id;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signUpAndSignIn = async (data: SignUpRequest): Promise<SignInResponse | null> => {
    const userId = await signUp(data);
    if (userId) {
      return await signIn({ username: data.username, password: data.password });
    }
    return null;
  };

  const checkProfileExists = async (userId: number): Promise<boolean> => {
    setLoading(true);
    try {
      return await authInteractor.checkProfileExists(userId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createPatientProfile = async (data: PatientProfileRequest) => {
    setLoading(true);
    setError(null);
    try {
      return await authInteractor.createPatientProfile(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    setLoading(true);
    try {
      await authInteractor.logout();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    signIn,
    signUp,
    signUpAndSignIn,
    checkProfileExists,
    createPatientProfile,
    logout
  };
};