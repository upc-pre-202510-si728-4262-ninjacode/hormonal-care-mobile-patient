import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react'
import { RootStackParamList } from '../entity/navigationEntities';
import ProfilePlaceholder from '../../profile/views/ProfilePlaceholder';
import { ProfilePresenter } from '../../profile/presenters/profile.presenter';
import { ProfileInteractor } from '../../profile/interactors/profile.interactor';
import SettingsScreen from '../../settings/views/SettingsPlaceholder';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { PopUpMenu } from '../../../common/components/PopUpMenu';
import { ProfileSettings } from '../../settings/views/ProfileSettings';
import { NotificationSettings } from '../../settings/views/NotificationSettings';
import { PrivacySeettings } from '../../settings/views/PrivacySeettings';
import { QrCode } from '../../settings/views/QrCode';
import { LanguageSettings } from '../../settings/views/LanguageSettings';
import { ProfileProvider } from '../../../common/contexts/ProfileContext';

const Stack = createStackNavigator<RootStackParamList>();
const profileInteractor = new ProfileInteractor();
const profilePresenter = new ProfilePresenter(profileInteractor);

const SettingsStack = () => (
    <ProfileProvider>
        <Stack.Navigator>
            <Stack.Screen
                name="ProfileHome"
                options={({ navigation }) => ({
                    title: 'Profile',
                    headerRight: () => {
                        const [menuVisible, setMenuVisible] = useState(false);
                        return (
                            <>
                                <TouchableOpacity
                                    onPress={() => setMenuVisible(true)}
                                    style={{ marginRight: 15 }}
                                >
                                    <Ionicons name="menu" size={24} color="#6200ee" />
                                </TouchableOpacity>
                                <PopUpMenu
                                    menuVisible={menuVisible}
                                    setMenuVisible={setMenuVisible}
                                    navigation={() => navigation.navigate('Settings')}
                                />
                            </>
                        );
                    },
                })}
            >
                {() => <ProfilePlaceholder presenter={profilePresenter} />}
            </Stack.Screen>
            <Stack.Screen
                name="Settings"
                options={{
                    headerShown: true,
                    headerBackTitleVisible: false,
                    title: 'Settings',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                }}
            >
                {() => <SettingsScreen />}
            </Stack.Screen>
            <Stack.Screen
                name="ProfileSettings"
                options={{
                    headerShown: true,
                    headerBackTitleVisible: false,
                    title: 'Profile Settings',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                }}
            >
                {() => <ProfileSettings />}
            </Stack.Screen>
            <Stack.Screen
                name="NotificationSettings"
                options={{
                    headerShown: true,
                    headerBackTitleVisible: false,
                    title: 'Notification Settings',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                }}
            >
                {() => <NotificationSettings />}
            </Stack.Screen>
            <Stack.Screen
                name="PrivacySettings"
                options={{
                    headerShown: true,
                    headerBackTitleVisible: false,
                    title: 'Privacy Settings',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                }}
            >
                {() => <PrivacySeettings />}
            </Stack.Screen>
            <Stack.Screen
                name="QrCode"
                options={{
                    headerShown: true,
                    headerBackTitleVisible: false,
                    title: 'QR Code',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                }}
            >
                {() => <QrCode />}
            </Stack.Screen>
            <Stack.Screen
                name="LanguageSettings"
                options={{
                    headerShown: true,
                    headerBackTitleVisible: false,
                    title: 'Language Settings',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                }}
            >
                {() => <LanguageSettings />}
            </Stack.Screen>
        </Stack.Navigator>
    </ProfileProvider>
);

export default SettingsStack;