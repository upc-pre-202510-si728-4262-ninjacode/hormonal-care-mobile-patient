// AppointmentsStack.tsx
import React from 'react';
import AppointmentsPlaceholder from '../../appointments/views/AppointmentsPlaceholder';
import { AppointmentsListPresenter } from '../../appointments/presenters/appointmentsPresenter';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../entity/navigationEntities';
import { DiscoverAndSearchList } from '../../search/views/DiscoverAndSearchList';
import { SearchInteractor } from '../../search/interactors/searchInteractor';
import { SearchListPresenter } from '../../search/presenters/searchPresenter';

const Stack = createStackNavigator<RootStackParamList>();
const searchInteractor = new SearchInteractor();
const searchPresenter = new SearchListPresenter(searchInteractor);

const AppointmentsStack = ({ presenter }: { presenter: AppointmentsListPresenter }) => (
    <Stack.Navigator>
        <Stack.Screen
            name="AppointmentsHome"
            options={{ title: 'Appointments' }}
        >
            {() => <AppointmentsPlaceholder presenter={presenter} />}
        </Stack.Screen>
        <Stack.Screen
            name="AppointmentsSearch"
            options={{
                headerBackTitleVisible: false,
                title: 'Discover',
                headerStyle: {
                    backgroundColor: '#fff',
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
            }}
        >
            {() => <DiscoverAndSearchList presenter={searchPresenter} />}
        </Stack.Screen>
    </Stack.Navigator>
);

export default AppointmentsStack;