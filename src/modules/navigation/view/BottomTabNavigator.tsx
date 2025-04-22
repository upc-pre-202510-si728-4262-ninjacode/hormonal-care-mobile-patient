import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { TabStackParamList, RootStackParamList } from '../entity/navigationEntities';
import HomeScreen from '../../home/views/HomeScreen';
import ProfilePlaceholder from '../../profile/views/ProfilePlaceholder';
import AppointmentsPlaceholder from '../../appointments/views/AppointmentsPlaceholder';
import MessagesPlaceholder from '../../messages/views/MessagesPlaceholder';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const Tab = createBottomTabNavigator<TabStackParamList>();

const getIconName = (routeName: string, focused: boolean): any => {
  switch (routeName) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Appointments':
      return focused ? 'calendar' : 'calendar-outline';
    case 'Messages':
      return focused ? 'chatbubbles' : 'chatbubbles-outline';
    case 'Profile':
      return focused ? 'person' : 'person-outline';
    default: 
      return 'help-outline';
  }
};

const BottomTabNavigator = () => {
  // Use the correct navigation type that includes the root navigation options
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
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
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('Notifications')} 
              style={{ marginRight: 15 }}
            >
              <Ionicons name="notifications-outline" size={24} color="#6200ee" />
            </TouchableOpacity>
          )
        }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsPlaceholder} 
      />
      <Tab.Screen name="Messages" component={MessagesPlaceholder} />
      <Tab.Screen name="Profile" component={ProfilePlaceholder} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;