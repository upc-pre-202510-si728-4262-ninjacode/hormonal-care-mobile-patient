import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useProfilePresenter } from '../presenter/profilePresenter';

const ProfileView = ({ navigation }: any) => {
  const { profileState, refreshProfile, logout } = useProfilePresenter();

  const handleEditProfile = () => {
    // Navigation to edit profile screen
    navigation.navigate('EditProfile');
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sí, cerrar sesión", 
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  if (profileState.loading && !profileState.profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (profileState.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {profileState.error}</Text>
        <TouchableOpacity style={styles.button} onPress={refreshProfile}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profile = profileState.profile;
  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se ha encontrado el perfil</Text>
        <TouchableOpacity style={styles.button} onPress={refreshProfile}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: profile.image || 'https://via.placeholder.com/150' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.name}>{`${profile.firstName} ${profile.lastName}`}</Text>
        <Text style={styles.detail}>{profile.gender}</Text>
        <Text style={styles.detail}>Fecha de nacimiento: {new Date(profile.birthday).toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información médica</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo de sangre:</Text>
          <Text style={styles.infoValue}>{profile.typeOfBlood}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Historia personal:</Text>
          <Text style={styles.infoValue}>{profile.personalHistory}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Historia familiar:</Text>
          <Text style={styles.infoValue}>{profile.familyHistory}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Teléfono:</Text>
          <Text style={styles.infoValue}>{profile.phoneNumber}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  section: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    width: '35%',
    fontWeight: 'bold',
    color: '#555',
  },
  infoValue: {
    flex: 1,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    marginTop: 0,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileView;