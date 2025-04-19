import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthPresenter } from '../presenter/authPresenter';

interface ProfileCreationViewProps {
  userId: number;
  onProfileCreated: () => void;
}

const ProfileCreationView: React.FC<ProfileCreationViewProps> = ({ userId, onProfileCreated }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [typeOfBlood, setTypeOfBlood] = useState('');
  const [personalHistory, setPersonalHistory] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  
  const { createProfile, authState } = useAuthPresenter();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  const handleCreateProfile = async () => {
    if (!firstName || !lastName || !gender || !phoneNumber || !typeOfBlood) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const profileData = {
      firstName,
      lastName,
      gender,
      phoneNumber,
      image: 'default-image.jpg', // Default image
      birthday: birthDate.toISOString(),
      userId,
      typeOfBlood,
      personalHistory: personalHistory || 'N/A',
      familyHistory: familyHistory || 'N/A',
      doctorId: null
    };

    const result = await createProfile(profileData);
    
    if (result.success) {
      onProfileCreated();
    } else {
      Alert.alert('Error', result.error || 'Hubo un error al crear el perfil');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Crear Perfil de Paciente</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre(s) *"
          value={firstName}
          onChangeText={setFirstName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Apellido(s) *"
          value={lastName}
          onChangeText={setLastName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Género *"
          value={gender}
          onChangeText={setGender}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Número de teléfono *"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {`Fecha de nacimiento: ${birthDate.toLocaleDateString()}`}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Tipo de sangre *"
          value={typeOfBlood}
          onChangeText={setTypeOfBlood}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Historial personal médico"
          value={personalHistory}
          onChangeText={setPersonalHistory}
          multiline
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Historial familiar médico"
          value={familyHistory}
          onChangeText={setFamilyHistory}
          multiline
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleCreateProfile}
          disabled={authState.loading}
        >
          {authState.loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Crear Perfil</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dateButtonText: {
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileCreationView;