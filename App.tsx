import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, Image, StyleSheet, Animated } from 'react-native';
import { RootNavigator } from './src/modules/navigation/view/RootNavigator';
import { AuthProvider } from './src/common/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import AppBackground from './src/common/components/AppBackground';

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const fadeInApp = useRef(new Animated.Value(0)).current;
  const fadeOutSplash = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeOutSplash, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeInApp, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          delay: 200, 
        })
      ]).start(() => {
        setAppReady(true);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <AppBackground />

      <Animated.View 
        style={[
          styles.mainAppContainer, 
          { opacity: fadeInApp }
        ]}
        pointerEvents={appReady ? 'auto' : 'none'}
      >
        <AuthProvider>
          <SafeAreaProvider>
            <StatusBar translucent backgroundColor="transparent" />
            <RootNavigator />
            <Toast />
          </SafeAreaProvider>
        </AuthProvider>
      </Animated.View>

      {!appReady && (
        <Animated.View 
          style={[
            styles.splashContainer, 
            { opacity: fadeOutSplash }
          ]}
        >
          <Image 
            source={require('./assets/logohormonalcare.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainAppContainer: {
    flex: 1,
  },
  splashContainer: {
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: 200,
    height: 200,
  }
});