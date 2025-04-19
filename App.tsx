import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/modules/navigation/view/RootNavigator'; // Importación directa
import { AuthProvider } from './src/common/contexts/AuthContext';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <RootNavigator />
        <Toast />
      </SafeAreaProvider>
    </AuthProvider>
  );
}