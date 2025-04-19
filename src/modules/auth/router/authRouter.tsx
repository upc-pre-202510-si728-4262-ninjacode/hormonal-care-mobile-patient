import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import LoginView from '../view/LoginView';
import RegisterView from '../view/RegisterView';
import ProfileCreationView from '../view/ProfileCreationView';
import MainRouter from '../../../router/MainRouter';
import { useAuthPresenter } from '../presenter/authPresenter';
import storageService from '../../../common/services/storageService';
import authService from '../service/authService';

const Stack = createStackNavigator();

const AuthRouter = () => {
  const [initializing, setInitializing] = useState(true);
  const { authState, setAuthState } = useAuthPresenter();
  const navigationRef = useRef(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userId = await storageService.getUserId();
        if (userId) {
          const token = await storageService.getToken();
          const username = await storageService.getUsername();
          const role = await storageService.getRole();
          
          if (token && username && role) {
            // Restore auth state
            const hasProfile = await authService.checkProfileExists(parseInt(userId));
            
            setAuthState({
              isAuthenticated: true,
              user: {
                id: parseInt(userId),
                username,
                role,
              },
              loading: false,
              error: null,
              needsProfile: !hasProfile,
            });
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setInitializing(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Force re-render when authentication state changes
  useEffect(() => {
    console.log("Auth state changed:", authState.isAuthenticated, "Needs profile:", authState.needsProfile);
  }, [authState.isAuthenticated, authState.needsProfile]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const handleLoginSuccess = (needsProfile: boolean) => {
    console.log("Login successful, needs profile:", needsProfile);
    // Force update of state to ensure re-render
    setAuthState(prevState => ({
      ...prevState,
      // No need to change values as the login function already updated them
    }));
  };

  const handleRegisterSuccess = () => {
    console.log("Registration successful");
  };

  const handleProfileCreated = () => {
    console.log("Profile created successfully");
    setAuthState(prevState => ({
      ...prevState,
      needsProfile: false
    }));
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!authState.isAuthenticated ? (
          // Auth Flow
          <>
            <Stack.Screen name="Login">
              {props => (
                <LoginView 
                  {...props} 
                  onLoginSuccess={handleLoginSuccess}
                  onRegisterPress={() => props.navigation.navigate('Register')}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {props => (
                <RegisterView 
                  {...props} 
                  onRegisterSuccess={handleRegisterSuccess}
                  onLoginPress={() => props.navigation.navigate('Login')}
                />
              )}
            </Stack.Screen>
          </>
        ) : authState.needsProfile ? (
          // Profile Creation Flow
          <Stack.Screen name="CreateProfile">
            {props => (
              <ProfileCreationView 
                {...props} 
                userId={authState.user.id!}
                onProfileCreated={handleProfileCreated}
              />
            )}
          </Stack.Screen>
        ) : (
          // Main App Flow
          <Stack.Screen name="MainApp" component={MainRouter} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthRouter;