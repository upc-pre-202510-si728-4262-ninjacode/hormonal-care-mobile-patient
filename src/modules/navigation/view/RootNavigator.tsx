import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { navigationRef } from '../router/navigationRouter';
import { RootStackParamList } from '../entity/navigationEntities';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import NotificationsScreen from '../../notifications/views/NotificationsScreen';
import { useAuth } from '../../../common/contexts/AuthContext';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
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
          <>
            <Stack.Screen name="MainApp" component={BottomTabNavigator} />
            <Stack.Screen 
              name="Notifications" 
              component={NotificationsScreen}
              options={{
                headerShown: true,
                title: 'Notifications',
                headerStyle: {
                  backgroundColor: '#fff',
                },
                headerTintColor: '#6200ee',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                // Add horizontal sliding transition
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                // Add gesture support for swiping back
                gestureEnabled: true,
                gestureDirection: 'horizontal',
              }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};