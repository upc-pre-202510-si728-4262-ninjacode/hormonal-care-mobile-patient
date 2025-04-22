import { NavigatorScreenParams } from '@react-navigation/native';

// Define the param list for the Auth stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  CreateProfile: { userId: number };
};

// Define the param list for the Bottom Tab navigator
export type TabStackParamList = {
  Home: undefined;
  Appointments: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainApp: NavigatorScreenParams<TabStackParamList>;
  Notifications: undefined;
};

export interface NavigationState {
  isAuthenticated: boolean;
  isLoading: boolean;
}