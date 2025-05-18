import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import Button from '../../../common/components/Button';
import { useAuth } from '../../../common/contexts/AuthContext';
import { PatientEntity } from '../entities/patient.entity';
import { ProfileEntity } from '../entities/profile.entity';
import { ProfilePresenter } from '../presenters/profile.presenter';

export const ProfilePlaceholder = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileEntity | null>(null);
  const [patient, setPatient] = useState<PatientEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const presenter = new ProfilePresenter({
        displayProfile: (profileData, patientData) => {
          console.log('Profile data:', profileData); 
          setProfile(profileData);
          setPatient(patientData);
          setLoading(false);
        },
        displayError: (message: string) => {
          Alert.alert('Error', message);
          setLoading(false);
        }
      });
      presenter.loadProfile(user.id);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading || !profile || !patient) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading profile...</Text>
        <Button 
        title="Logout" 
        onPress={handleLogout} 
        variant="outline"
        style={styles.logoutButton}
      />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Avatar.Icon size={120} icon="account-circle" style={styles.avatar} />
      <View style={styles.infoRow}>
            <Text style={styles.name}>{profile.fullName}</Text>
      </View>

      <View style={styles.editButtonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => Alert.alert('Edit Profile', 'This feature is not implemented yet.')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>👤 Gender:</Text>
            <Text style={styles.value}>{profile.gender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📞 Phone:</Text>
            <Text style={styles.value}>{profile.phoneNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>🎂 Birthday:</Text>
            <Text style={styles.value}>
              {new Date(profile.birthday).toLocaleDateString()}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.infoRow}>
            <Text style={styles.label}>🩸 Blood Type:</Text>
            <Text style={styles.value}>{patient.typeOfBlood ?? 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📋 Personal History:</Text>
            <Text style={styles.value}>{patient.personalHistory ?? 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>👨‍👩‍👧 Family History:</Text>
            <Text style={styles.value}>{patient.familyHistory ?? 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>🩺 Doctor ID:</Text>
            <Text style={styles.value}>{patient.doctorId ?? 'N/A'}</Text>
          </View>
        </Card.Content>
      </Card>

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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f9f9f9' },
  avatar: { backgroundColor: '#e5e7eb', marginBottom: 16 },
  name: { fontSize: 28, fontWeight: 'bold', color: '#555', marginBottom: 24 , alignContent: 'center'},
  card: { width: '100%', borderRadius: 12, backgroundColor: 'white', padding: 16, marginBottom: 16, elevation: 3 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 16, fontWeight: '600', color: '#555' },
  value: { fontSize: 16, fontWeight: '400', color: '#333' },
  editButtonContainer: { width: '100%', alignItems: 'flex-end', marginBottom: 16, marginTop: 16 },
  editButton: { paddingVertical: 12, paddingHorizontal: 32, backgroundColor: '#007aff', borderRadius: 8 },
  editButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  logoutButton: { width: '50%' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
});

export default ProfilePlaceholder;
