import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../../common/components/Button';
import { useAuth } from '../../../common/contexts/AuthContext';

const HomeScreen = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // No need for navigation - it will happen automatically when auth state changes
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Hormonal Care</Text>
      <Text style={styles.description}>
        This is your home screen. Your appointments and medical information will appear here.
      </Text>
      <Button 
        title="Logout" 
        onPress={handleLogout} 
        variant="outline"
        style={styles.logoutButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  description: {
    color: '#4b5563', // gray-600
    textAlign: 'center',
    marginBottom: 32,
  },
  logoutButton: {
    width: '50%',
  },
});

export default HomeScreen;