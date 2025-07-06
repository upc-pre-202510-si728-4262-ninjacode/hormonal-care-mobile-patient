import React, { useEffect, useState } from 'react'
import { Button, Dimensions, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Octicons from 'react-native-vector-icons/Octicons';
import { useProfile } from '../../../common/contexts/ProfileContext';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export const ProfileSettings = () => {
  const { profile, setProfile } = useProfile();
  const [activate, setActivate] = useState(true);
  const [fullName, setFullName] = useState(profile?.fullName);
  const [bloodType, setBloodType] = useState(profile?.typeOfBlood ?? '');
  const [personalHistory, setPersonalHistory] = useState(profile?.personalHistory ?? '');
  const [familyHistory, setFamilyHistory] = useState(profile?.familyHistory ?? '');
  const [birthdate, setBirthdate] = useState(
    profile?.birthday ? new Date(profile.birthday) : new Date()
  );
  const [gender, setGender] = useState(profile?.gender);
  const [showPicker, setShowPicker] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  useEffect(() => {
    if (profile?.fullName !== fullName) {
      setActivate(false);
    } else {
      setActivate(true);
    }
  }, [fullName, profile?.fullName]);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setBirthdate(selectedDate);
    }
  };

  const formattedDate = `${birthdate.getFullYear()}-${String(birthdate.getMonth() + 1).padStart(2, '0')}-${String(birthdate.getDate()).padStart(2, '0')}`;

  const handleGenderSelect = (value: string, label: string) => {
    setGender(value);
    setShowGenderDropdown(false);
  };

  const genderOptions = [
    { label: 'Female', value: 'Female' },
    { label: 'Male', value: 'Male' },
    { label: 'Non-binary', value: 'Non-binary' },
    { label: 'Prefer not to say', value: 'Not-specified' }
  ];


  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={styles.secondTitle}>Profile Details</Text>
            <Octicons name='info' size={15} />
          </View>
          <View style={styles.itemContainer}>
            <Text>Full Name</Text>
            <View style={styles.inputContent}>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor={'#b6b7b8'}
                placeholder="Enter your full name"
              />
            </View>
          </View>
          <View style={styles.itemContainer}>
            <Text>Birthdate</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.inputContent}>
              <Text style={styles.dropdownButtonText}>
                {formattedDate}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#d1c4e9" />
            </TouchableOpacity>
          </View>
          <View style={styles.itemContainer}>
            <Text>Gender</Text>
            <TouchableOpacity
              style={styles.inputContent}
              onPress={() => setShowGenderDropdown(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {gender}
              </Text>
              <Ionicons name="chevron-down-outline" size={20} color="#d1c4e9" />
            </TouchableOpacity>
          </View>
          <View style={styles.itemContainer}>
            <Text>Phone Number</Text>
            <View style={styles.inputContent}>
              <TextInput
                defaultValue={profile?.phoneNumber}
                placeholderTextColor={'#b6b7b8'}
                placeholder="Enter your phone number"
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 10 }}>
            <Text style={styles.thirdTitle}>Medical Information</Text>
            <Octicons name='info' size={15} />
          </View>
          <View style={styles.itemContainer}>
            <Text>Blood Type</Text>
            <View style={styles.inputContent}>
              <TextInput
                value={bloodType}
                onChangeText={setBloodType}
                placeholderTextColor={'#b6b7b8'}
                placeholder="Enter your blood type"
              />
            </View>
          </View>
          <View style={styles.itemContainer}>
            <Text>Personal History</Text>
            <View style={styles.inputContent}>
              <TextInput
                value={personalHistory}
                onChangeText={setPersonalHistory}
                placeholderTextColor={'#b6b7b8'}
                placeholder="Enter your personal history"
              />
            </View>
          </View>
          <View style={styles.itemContainer}>
            <Text>Family History</Text>
            <View style={styles.inputContent}>
              <TextInput
                value={familyHistory}
                onChangeText={setFamilyHistory}
                placeholderTextColor={'#b6b7b8'}
                placeholder="Enter your family history"
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 10 }}>
            <Text style={styles.thirdTitle}>Credentials Management</Text>
            <Octicons name='info' size={15} />
          </View>
          <View style={styles.itemContainer}>
            <Text>Username</Text>
            <View style={styles.inputContent}>
              <TextInput
                placeholderTextColor={'#b6b7b8'}
                placeholder="Enter your username"
              />
            </View>
          </View>
          <View style={styles.itemContainer}>
            <Text>Password</Text>
            <View style={styles.inputContent}>
              <TextInput
                placeholderTextColor={'#b6b7b8'}
                placeholder="Enter your phone number"
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View>
        <TouchableOpacity
          style={[
            styles.updateButton,
            activate && { opacity: 0.3 }
          ]}
          disabled={activate}
        >
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showGenderDropdown} transparent>
        <TouchableOpacity style={styles.modalBackground} onPress={() => setShowGenderDropdown(false)}>
          <View style={styles.dropdown}>
            {genderOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => handleGenderSelect(option.value, option.label)}
              >
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    width: '60%',
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  secondTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  thirdTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  buttonContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'flex-end'
  },
  updateButton: {
    // backgroundColor: '#d0c4fb',
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
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
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    width: 90,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  dropdown: {
    marginHorizontal: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 5
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalBackgroundY: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
})