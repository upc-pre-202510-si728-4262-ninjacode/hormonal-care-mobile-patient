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
    console.log('AuthContext: Starting auth check...');
    try {
      const userData = await getUserData();
      console.log('AuthContext: User data from storage:', userData ? 'Found' : 'Not found');
      
      if (userData && userData.token) {
        // For now, skip profile check to avoid network issues blocking the app
        console.log('AuthContext: Setting user as authenticated without profile check');
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.log('AuthContext: No user data found');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('AuthContext: Error during auth check:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      console.log('AuthContext: Auth check completed, setting loading to false');
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