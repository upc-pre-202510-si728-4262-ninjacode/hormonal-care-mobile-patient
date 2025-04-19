import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileView from '../view/ProfileView';
// Aquí importarías el componente EditProfileView cuando lo crees
// import EditProfileView from '../view/EditProfileView';

const Stack = createStackNavigator();

const ProfileRouter = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileView} />
      {/* <Stack.Screen name="EditProfile" component={EditProfileView} /> */}
    </Stack.Navigator>
  );
};

export default ProfileRouter;