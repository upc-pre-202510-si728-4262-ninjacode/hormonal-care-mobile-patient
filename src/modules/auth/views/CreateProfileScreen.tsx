import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList, RootStackParamList } from '../../../modules/navigation/entity/navigationEntities';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { AuthInteractor } from '../interactors/authInteractor';
import { useAuthPresenter } from '../presenters/authPresenter';
import Input from '../../../common/components/Input';
import Button from '../../../common/components/Button';
import { useAuth } from '../../../common/contexts/AuthContext';
import { getUserData } from '../../../common/storage/tokenStorage';

type CreateProfileScreenNavigationProp = StackNavigationProp<AuthStackParamList> & 
                                        StackNavigationProp<RootStackParamList>;
type CreateProfileScreenRouteProp = RouteProp<AuthStackParamList, 'CreateProfile'>;

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
  const [personalHistory, setPersonalHistory] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  
  const authInteractor = new AuthInteractor();
  const { createPatientProfile, loading, error } = useAuthPresenter(authInteractor);
  const { login } = useAuth();

  const handleCreateProfile = async () => {
    if (!firstName || !lastName || !gender || !phoneNumber) {
      console.error('Please fill all required fields');
      return;
    }

    const profileData = {
      firstName,
      lastName,
      gender,
      phoneNumber,
      image: "default.jpg",
      birthday: birthdate.toISOString(),
      userId,
      typeOfBlood,
      personalHistory,
      familyHistory,
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
            <Text style={styles.headerTitle}>Create Your Profile</Text>
            <Text style={styles.subtitle}>Please complete your profile information</Text>
          </View>

          <Input
            label="First Name *"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            autoCapitalize="words"
          />

          <Input
            label="Last Name *"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            autoCapitalize="words"
          />

          <Input
            label="Gender *"
            value={gender}
            onChangeText={setGender}
            placeholder="Enter your gender"
          />

          <Input
            label="Phone Number *"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
          />

          <View style={styles.dateContainer}>
            <Text style={styles.label}>Date of Birth *</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{birthdate.toLocaleDateString()}</Text>
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

          <Input
            label="Blood Type"
            value={typeOfBlood}
            onChangeText={setTypeOfBlood}
            placeholder="Enter your blood type"
          />

          <Input
            label="Personal Medical History"
            value={personalHistory}
            onChangeText={setPersonalHistory}
            placeholder="Enter your personal medical history"
          />

          <Input
            label="Family Medical History"
            value={familyHistory}
            onChangeText={setFamilyHistory}
            placeholder="Enter your family medical history"
          />

          <Button
            title="Create Profile"
            onPress={handleCreateProfile}
            loading={loading}
            style={styles.createButton}
          />
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  createButton: {
    marginTop: 24,
    marginBottom: 30,
  },
  dateContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  datePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
  },
  // Otros estilos específicos que puedas necesitar para el datepicker, etc.
});

export default CreateProfileScreen;