import { useState, useEffect } from 'react';
import { NavigationInteractor } from '../interactor/navigationInteractor';
import { NavigationState } from '../entity/navigationEntities';

export const useNavigationPresenter = (navigationInteractor: NavigationInteractor) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await navigationInteractor.checkAuthState();
        setNavigationState({
          isAuthenticated,
          isLoading: false
        });
      } catch (error) {
        console.error('Navigation error:', error);
        setNavigationState({
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  return navigationState;
};