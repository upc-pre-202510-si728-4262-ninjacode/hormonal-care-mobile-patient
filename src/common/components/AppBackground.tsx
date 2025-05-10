import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AppBackgroundProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

const AppBackground = ({ style, children }: AppBackgroundProps) => {
  return (
    <LinearGradient
      colors={['#7e57c2', '#5e35b1', '#4527a0']}
      style={[styles.background, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});

export default AppBackground;