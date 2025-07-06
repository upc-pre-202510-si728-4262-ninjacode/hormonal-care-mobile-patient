import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { TabStackParamList, RootStackParamList } from '../entity/navigationEntities';
import HomeScreen from '../../home/views/HomeScreen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AppointmentsInteractor } from '../../appointments/interactors/appointmentsInteractor';
import { AppointmentsListPresenter } from '../../appointments/presenters/appointmentsPresenter';
import { ProfileInteractor } from '../../profile/interactors/profile.interactor';
import { ProfilePresenter } from '../../profile/presenters/profile.presenter';
import AppointmentsStack from '../stacks/appointmentStack';
import { MessagesPlaceholder } from '../../messages/views/MessagesPlaceholder';
import SettingsStack from '../stacks/settingsStack';

const Tab = createBottomTabNavigator<TabStackParamList>();

const appointmentsInteractor = new AppointmentsInteractor();
const appointmentsPresenter = new AppointmentsListPresenter(appointmentsInteractor);
const profileInteractor = new ProfileInteractor();
const profilePresenter = new ProfilePresenter(profileInteractor);

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
        name="Appointments" options={{ headerShown: false }}>
        {() => <AppointmentsStack presenter={appointmentsPresenter} />}
      </Tab.Screen>
      <Tab.Screen name="Messages" component={MessagesPlaceholder} />
      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
        }}
      >
        {() => <SettingsStack />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;