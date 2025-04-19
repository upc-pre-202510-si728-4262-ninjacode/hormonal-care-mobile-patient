import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TOKEN: 'auth_token',
  USER_ID: 'user_id',
  USERNAME: 'username',
  ROLE: 'user_role',
};

const storageService = {
  // Token management
  saveToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(KEYS.TOKEN, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // User data management
  saveUserData: async (userData: { id: number; username: string; role: string }): Promise<void> => {
    try {
      const { id, username, role } = userData;
      const items: [string, string][] = [
        [KEYS.USER_ID, id.toString()],
        [KEYS.USERNAME, username],
        [KEYS.ROLE, role],
      ];
      
      await AsyncStorage.multiSet(items);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  getUserId: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(KEYS.USER_ID);
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  },

  getUsername: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(KEYS.USERNAME);
    } catch (error) {
      console.error('Error getting username:', error);
      return null;
    }
  },

  getRole: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(KEYS.ROLE);
    } catch (error) {
      console.error('Error getting role:', error);
      return null;
    }
  },

  // Clear auth data on logout
  clearAuthData: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        KEYS.TOKEN,
        KEYS.USER_ID,
        KEYS.USERNAME,
        KEYS.ROLE,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },
};

export default storageService;