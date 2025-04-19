import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from '../router/navigationRouter';
import { RootStackParamList } from '../entity/navigationEntities';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import { NavigationInteractor } from '../interactor/navigationInteractor';
import { useNavigationPresenter } from '../presenter/navigationPresenter';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  // Usando el presenter de navegación en vez de useAuth directamente
  const navigationInteractor = new NavigationInteractor();
  const { isAuthenticated, isLoading } = useNavigationPresenter(navigationInteractor);

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