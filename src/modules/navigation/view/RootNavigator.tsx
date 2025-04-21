import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from '../router/navigationRouter';
import { RootStackParamList } from '../entity/navigationEntities';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import { useAuth } from '../../../common/contexts/AuthContext';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  // Use the AuthContext directly instead of the navigation presenter
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};