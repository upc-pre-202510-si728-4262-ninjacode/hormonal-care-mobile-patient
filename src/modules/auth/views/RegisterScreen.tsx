import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  TextInput,
  Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../modules/navigation/entity/navigationEntities';
import { AuthInteractor } from '../interactors/authInteractor';
import { useAuthPresenter } from '../presenters/authPresenter';
import Button from '../../../common/components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// Define the navigation prop type for this screen
type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const authInteractor = new AuthInteractor();
  const { signUpAndSignIn, loading, error } = useAuthPresenter(authInteractor);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim1 = useRef(new Animated.Value(0)).current;
  const moveAnim2 = useRef(new Animated.Value(0)).current;
  const moveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim1, {
          toValue: 1,
          duration: 8000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim1, {
          toValue: 0,
          duration: 8000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim2, {
          toValue: 1,
          duration: 12000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim2, {
          toValue: 0,
          duration: 12000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim3, {
          toValue: 1,
          duration: 15000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim3, {
          toValue: 0,
          duration: 15000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const translateX1 = moveAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.3]
  });
  
  const translateY1 = moveAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.1]
  });

  const translateX2 = moveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width * 0.2]
  });
  
  const translateY2 = moveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.15]
  });

  const translateX3 = moveAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.25]
  });
  
  const translateY3 = moveAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height * 0.12]
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async () => {
    setValidationError(null);
    
    if (!username || !password || !confirmPassword) {
      setValidationError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    const response = await signUpAndSignIn({ username, password });
    if (response) {
      navigation.navigate('CreateProfile', { userId: response.id });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      <LinearGradient
        colors={['#7e57c2', '#5e35b1', '#4527a0']}
        style={styles.backgroundGradient}
      >
        <Animated.View 
          style={[
            styles.lightCircle, 
            styles.lightCircle1,
            { 
              transform: [
                { translateX: translateX1 },
                { translateY: translateY1 }
              ],
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3]
              })
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.lightCircle, 
            styles.lightCircle2,
            { 
              transform: [
                { translateX: translateX2 },
                { translateY: translateY2 }
              ],
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2]
              })
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.lightCircle, 
            styles.lightCircle3,
            { 
              transform: [
                { translateX: translateX3 },
                { translateY: translateY3 }
              ],
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1]
              })
            }
          ]} 
        />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}
        >
          <Animated.View 
            style={[
              styles.formContainer,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up for Hormonal Care</Text>
            </View>
            
            {(validationError || error) && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {validationError || error}
                </Text>
              </View>
            )}
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#d1c4e9" style={styles.inputIcon} />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter your username"
                  placeholderTextColor="rgba(209, 196, 233, 0.5)"
                  style={styles.textInput}
                />
              </View>
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#d1c4e9" style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="rgba(209, 196, 233, 0.5)"
                  style={styles.textInput}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.visibilityIcon}>
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#d1c4e9" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#d1c4e9" style={styles.inputIcon} />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="rgba(209, 196, 233, 0.5)"
                  style={styles.textInput}
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.visibilityIcon}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#d1c4e9" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <Button
              title="Register"
              onPress={handleRegister}
              loading={loading}
              style={styles.button}
              variant="primary"
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  lightCircle: {
    position: 'absolute',
    borderRadius: 500,
  },
  lightCircle1: {
    backgroundColor: '#b39ddb',
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.2,
    left: -width * 0.1,
  },
  lightCircle2: {
    backgroundColor: '#9575cd',
    width: width * 0.7,
    height: width * 0.7,
    top: height * 0.2,
    right: -width * 0.3,
  },
  lightCircle3: {
    backgroundColor: '#7e57c2',
    width: width,
    height: width,
    bottom: -width * 0.4,
    left: -width * 0.2,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  formContainer: {
    padding: 32,
    borderRadius: 20,
    backgroundColor: 'rgba(69, 39, 160, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.7)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 24,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#d1c4e9',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(209, 196, 233, 0.5)',
    paddingBottom: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    padding: 0,
    height: 30,
  },
  visibilityIcon: {
    padding: 5,
  },
  button: {
    marginTop: 36,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#b39ddb',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#b39ddb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  footer: {
    marginTop: 36,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#e1e1e1',
  },
  footerLink: {
    color: '#d1c4e9',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;