import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  TextInput,
  Easing,
  Modal,
  FlatList
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList, RootStackParamList } from '../../../modules/navigation/entity/navigationEntities';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { AuthInteractor } from '../interactors/authInteractor';
import { useAuthPresenter } from '../presenters/authPresenter';
import Button from '../../../common/components/Button';
import { useAuth } from '../../../common/contexts/AuthContext';
import { getUserData } from '../../../common/storage/tokenStorage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type CreateProfileScreenNavigationProp = StackNavigationProp<AuthStackParamList> & 
                                        StackNavigationProp<RootStackParamList>;
type CreateProfileScreenRouteProp = RouteProp<AuthStackParamList, 'CreateProfile'>;

const { width, height } = Dimensions.get('window');

const genderOptions = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'not-specified' }
];

const bloodTypeOptions = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' }
];

const CreateProfileScreen = () => {
  const navigation = useNavigation<CreateProfileScreenNavigationProp>();
  const route = useRoute<CreateProfileScreenRouteProp>();
  const { userId } = route.params;
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [typeOfBlood, setTypeOfBlood] = useState('');
  
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showBloodTypeDropdown, setShowBloodTypeDropdown] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const authInteractor = new AuthInteractor();
  const { createPatientProfile, loading, error } = useAuthPresenter(authInteractor);
  const { login } = useAuth();

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

  const handleCreateProfile = async () => {
    setValidationError(null);
    
    if (!firstName || !lastName || !gender || !phoneNumber) {
      setValidationError('Please fill in all required fields');
      return;
    }
    
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[-()\s]/g, ''))) {
      setValidationError('Please enter a valid phone number');
      return;
    }

    const profileData = {
      firstName,
      lastName,
      gender,
      phoneNumber,
      image: "",
      birthday: birthdate.toISOString(),
      userId,
      typeOfBlood,
      personalHistory: "",
      familyHistory: "",
      doctorId: null
    };

    const response = await createPatientProfile(profileData);
    if (response) {
      const userData = await getUserData();
      if (userData) {
        await login(userData);
      }
    }
  };

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthdate(selectedDate);
    }
  };

  const handleGenderSelect = (value: string, label: string) => {
    setGender(value);
    setShowGenderDropdown(false);
  };

  const handleBloodTypeSelect = (value: string) => {
    setTypeOfBlood(value);
    setShowBloodTypeDropdown(false);
  };

  const handlePhoneNumberChange = (text: string) => {
    // Replace all non-numeric characters with empty string
    const numericValue = text.replace(/[^0-9]/g, '');
    setPhoneNumber(numericValue);
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
              <Text style={styles.headerTitle}>Create Your Profile</Text>
              <Text style={styles.subtitle}>Please complete your profile information</Text>
            </View>

            {(validationError || error) && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {validationError || error}
                </Text>
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>First Name *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#d1c4e9" style={styles.inputIcon} />
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter your first name"
                  placeholderTextColor="rgba(209, 196, 233, 0.5)"
                  style={styles.textInput}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Last Name *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#d1c4e9" style={styles.inputIcon} />
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter your last name"
                  placeholderTextColor="rgba(209, 196, 233, 0.5)"
                  style={styles.textInput}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Gender *</Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setShowGenderDropdown(true)}
              >
                <Ionicons name="male-female-outline" size={20} color="#d1c4e9" style={styles.inputIcon} />
                <Text style={[styles.dropdownButtonText, !gender && styles.placeholderText]}>
                  {gender ? genderOptions.find(option => option.value === gender)?.label : "Select gender"}
                </Text>
                <Ionicons name="chevron-down-outline" size={20} color="#d1c4e9" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#d1c4e9" style={styles.inputIcon} />
                <TextInput
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  placeholder="Enter your phone number"
                  placeholderTextColor="rgba(209, 196, 233, 0.5)"
                  style={styles.textInput}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Date of Birth *</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#d1c4e9" style={styles.inputIcon} />
                <Text style={styles.dateText}>{birthdate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={birthdate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Blood Type</Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setShowBloodTypeDropdown(true)}
              >
                <Ionicons name="water-outline" size={20} color="#d1c4e9" style={styles.inputIcon} />
                <Text style={[styles.dropdownButtonText, !typeOfBlood && styles.placeholderText]}>
                  {typeOfBlood || "Select blood type"}
                </Text>
                <Ionicons name="chevron-down-outline" size={20} color="#d1c4e9" />
              </TouchableOpacity>
            </View>

            <Button
              title="Create Profile"
              onPress={handleCreateProfile}
              loading={loading}
              style={styles.createButton}
              variant="primary"
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>

      <Modal
        visible={showGenderDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenderDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowGenderDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>Select Gender</Text>
              <TouchableOpacity onPress={() => setShowGenderDropdown(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={genderOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.dropdownItem, 
                    gender === item.value && styles.dropdownItemSelected
                  ]}
                  onPress={() => handleGenderSelect(item.value, item.label)}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    gender === item.value && styles.dropdownItemTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {gender === item.value && (
                    <Ionicons name="checkmark" size={20} color="#6200ee" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showBloodTypeDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBloodTypeDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowBloodTypeDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>Select Blood Type</Text>
              <TouchableOpacity onPress={() => setShowBloodTypeDropdown(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={bloodTypeOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.dropdownItem, 
                    typeOfBlood === item.value && styles.dropdownItemSelected
                  ]}
                  onPress={() => handleBloodTypeSelect(item.value)}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    typeOfBlood === item.value && styles.dropdownItemTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {typeOfBlood === item.value && (
                    <Ionicons name="checkmark" size={20} color="#6200ee" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(209, 196, 233, 0.5)',
    paddingBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#ffffff',
  },
  createButton: {
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(209, 196, 233, 0.5)',
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
  },
  placeholderText: {
    color: 'rgba(209, 196, 233, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    width: width * 0.8,
    maxHeight: height * 0.7,
    backgroundColor: '#5e35b1',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  dropdownHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  dropdownItemTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default CreateProfileScreen;