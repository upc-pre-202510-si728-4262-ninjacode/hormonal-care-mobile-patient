import { useState, useEffect } from 'react';
import homeInteractor from '../interactor/homeInteractor';
import { HomeState } from '../entity/homeEntity';

export const useHomePresenter = () => {
  const initialState: HomeState = {
    loading: false,
    error: null,
    data: [],
  };

  const [homeState, setHomeState] = useState<HomeState>(initialState);

  const fetchHomeData = async () => {
    try {
      setHomeState({ ...homeState, loading: true, error: null });
      
      const data = await homeInteractor.getHomeData();
      
      setHomeState({
        loading: false,
        error: null,
        data,
      });
    } catch (error: any) {
      setHomeState({
        ...homeState,
        loading: false,
        error: error.message,
      });
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchHomeData();
  }, []);

  return {
    homeState,
    refreshData: fetchHomeData,
  };
};