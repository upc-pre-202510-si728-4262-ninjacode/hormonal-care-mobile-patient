import 'react-native-gesture-handler'; // Añade esta línea al principio
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthRouter from './src/modules/auth/router/authRouter';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthRouter />
    </SafeAreaProvider>
  );
}
