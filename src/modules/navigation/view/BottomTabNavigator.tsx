import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabStackParamList } from '../entity/navigationEntities';
import HomeScreen from '../../home/views/HomeScreen';
import ProfilePlaceholder from '../../profile/views/ProfilePlaceholder';
import AppointmentsPlaceholder from '../../appointments/views/AppointmentsPlaceholder';
import RecordsPlaceholder from '../../records/views/RecordsPlaceholder';

const Tab = createBottomTabNavigator<TabStackParamList>();

const getIconName = (routeName: string, focused: boolean): any => {
  switch (routeName) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Appointments':
      return focused ? 'calendar' : 'calendar-outline';
    case 'Records':
      return focused ? 'document-text' : 'document-text-outline';
    case 'Profile':
      return focused ? 'person' : 'person-outline';
    default:
      return 'help-outline';
  }
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name={getIconName(route.name, focused)} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsPlaceholder} />
      <Tab.Screen name="Records" component={RecordsPlaceholder} />
      <Tab.Screen name="Profile" component={ProfilePlaceholder} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;