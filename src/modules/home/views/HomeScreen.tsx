import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { HomeRouter } from '../router/home.router';
import { getUserData } from '../../../common/storage/tokenStorage';

const HomeScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);

  const symptomPrompts = [
    "I've been feeling tired lately",
    "Changes in my skin",
    "I've noticed hair loss",
    "Frequent headaches",
    "Mood swings"
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeText}>Welcome {user?.username}!</Text>

        <View style={styles.promptsSection}>
          <Text style={styles.promptTitle}>How are you feeling today?</Text>
          <Text style={styles.promptSubtitle}>Select an option to get started.</Text>
          {symptomPrompts.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.promptButton}
              onPress={() => HomeRouter.goToChat(navigation)}
            >
              <Text style={styles.promptText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => HomeRouter.goToChat(navigation)}
        >
          <Text style={styles.chatButtonText}>Iniciar Consulta con IA</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 24,
  },
  promptsSection: {
    marginBottom: 24,
  },
  promptTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  promptSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  promptButton: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  promptText: {
    fontSize: 14,
    color: '#4338CA',
    fontWeight: '500',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  chatButton: {
    backgroundColor: '#4338CA',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  chatButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;