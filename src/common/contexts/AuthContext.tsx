import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserData, saveUserData, clearUserData } from '../storage/tokenStorage';
import { AuthInteractor } from '../../modules/auth/interactors/authInteractor';

// Define types for the auth context
type User = {
  id: number;
  username: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add this function to improve error handling in checkAuth
  const checkAuth = async () => {
    try {
      const userData = await getUserData();
      if (userData && userData.token) {
        try {
          const authInteractor = new AuthInteractor();
          const hasProfile = await authInteractor.checkProfileExists(userData.id);
          
          if (hasProfile) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // User is authenticated but doesn't have a profile
            setUser(userData);
            setIsAuthenticated(false);
          }
        } catch (networkError) {
          console.error('Network error during profile check:', networkError);
          // Assume user is authenticated if we have token but can't check profile due to network
          setUser(userData);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error('Auth check failed:', e);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing user session on app load
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function with default ROLE_PATIENT
  const login = async (userData: User) => {
    try {
      // Create a new object with the user data and add the ROLE_PATIENT role
      const userDataWithRole = {
        ...userData,
        role: 'ROLE_PATIENT'  // Add the default role here
      };
      
      await saveUserData(userDataWithRole);
      setUser(userData);  // We keep the original user data in state
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await clearUserData();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};