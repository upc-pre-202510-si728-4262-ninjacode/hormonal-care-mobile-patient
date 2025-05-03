import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import Button from '../../../common/components/Button';
import { useAuth } from '../../../common/contexts/AuthContext';

const ProfilePlaceholder = () => {
  // Información del perfil (puedes reemplazar esto con datos dinámicos)
  const [profile, setProfile] = useState({
    firstName: 'FirstName',
    lastName: 'LastName',
    gender: 'male',
    phoneNumber: '999999999',
    image: '.jpg',
    birthday: '2025-04-26T01:58:33.331Z',
    userId: 1,
    typeOfBlood: 'O+',
    personalHistory: 'No known allergies',
    familyHistory: 'Diabetes',
    doctorId: 12345,
  });

  const { logout } = useAuth();
  
    const handleLogout = async () => {
      await logout();
      // No need for navigation - it will happen automatically when auth state changes
    };

  return (
<View style={styles.container}>
      {/* Avatar y Nombre */}
      <Avatar.Icon
        size={120}
        icon="account-circle"
        style={styles.avatar}
      />
      <Text style={styles.name}>
        {profile.firstName} {profile.lastName}
      </Text>

      {/* Botón de Editar */}
      <View style={styles.editButtonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => Alert.alert('Edit Profile', 'This feature is not implemented yet.')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Información del Perfil */}
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

      {/* Información Adicional */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.infoRow}>
            <Text style={styles.label}>🩸 Blood Type:</Text>
            <Text style={styles.value}>{profile.typeOfBlood}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📋 Personal History:</Text>
            <Text style={styles.value}>{profile.personalHistory}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>👨‍👩‍👧 Family History:</Text>
            <Text style={styles.value}>{profile.familyHistory}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>🩺 Doctor ID:</Text>
            <Text style={styles.value}>{profile.doctorId}</Text>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9', // Fondo claro para iOS
  },
  avatar: {
    backgroundColor: '#e5e7eb', // Fondo gris claro para el avatar
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', // Texto oscuro
    marginBottom: 24,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
    padding: 16,
    marginBottom: 16, // Espacio entre el Card y el botón
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555', // Texto gris oscuro
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333', // Texto oscuro
  },
  editButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 16,
    marginTop: 16,
  },
  editButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#007aff', // Azul estilo iOS
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    width: '50%',
  },
});

export default ProfilePlaceholder;