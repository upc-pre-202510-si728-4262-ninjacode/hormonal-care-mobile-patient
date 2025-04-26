import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthInteractor } from '../interactors/authInteractor';
import { useAuthPresenter } from '../presenters/authPresenter';
import Input from '../../../common/components/Input';
import Button from '../../../common/components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../modules/navigation/entity/navigationEntities';



// Define the navigation prop type for this screen
type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Use the typed navigation
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const authInteractor = new AuthInteractor();
  const { signUpAndSignIn, loading, error } = useAuthPresenter(authInteractor);

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      console.error('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    } else {
      setPasswordError('');
    }

    const response = await signUpAndSignIn({ username, password });
    if (response) {
      // Navigate to create profile screen - now TypeScript knows this is valid
      navigation.navigate('CreateProfile', { userId: response.id });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up for Hormonal Care</Text>
          </View>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {passwordError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{passwordError}</Text>
            </View>
          )}
          
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
          />
          
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />
          
          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
          />
          
          <Button
            title="Register"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          />
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 24,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: '#B00020',
  },
  button: {
    marginTop: 16,
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#666',
  },
  footerLink: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;