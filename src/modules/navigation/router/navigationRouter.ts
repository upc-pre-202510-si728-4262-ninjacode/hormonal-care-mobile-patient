import { createRef } from 'react';
import { NavigationContainerRef, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '../entity/navigationEntities';

// Navigation reference
export const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>();

// Navigation actions
export const navigate = <T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T]
) => {
  if (navigationRef.current) {
    // Use CommonActions.navigate instead of direct navigate call
    navigationRef.current.dispatch(
      CommonActions.navigate({
        name: name.toString(),
        params
      })
    );
  }
};

export const resetToAuth = () => {
  if (navigationRef.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      })
    );
  }
};

export const resetToMain = () => {
  if (navigationRef.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      })
    );
  }
};