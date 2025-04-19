import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeView from '../view/HomeView';

const Stack = createStackNavigator();

const HomeRouter = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeView} />
    </Stack.Navigator>
  );
};

export default HomeRouter;