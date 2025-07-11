import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { HomeRouter } from '../router/home.router';
import { getUserData } from '../../../common/storage/tokenStorage';
import { useProfile } from '../../../common/contexts/ProfileContext';

const HomeScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const { profile, loading, error, refreshProfile } = useProfile();

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

  const handleChatPress = () => {
    if (!profile) {
      console.log('HomeScreen: Profile not loaded, cannot start chat');
      return;
    }
    console.log('HomeScreen: Starting chat with profile:', profile);
    HomeRouter.goToChat(navigation);
  };

  const handleRetryProfile = () => {
    console.log('HomeScreen: Retrying profile load...');
    refreshProfile();
  };

  const getChatButtonText = () => {
    if (loading) return 'Cargando perfil...';
    if (error) return 'Reintentar cargar perfil';
    if (!profile) return 'Perfil requerido para chat';
    return 'Iniciar CareChat';
  };

  const isChatButtonDisabled = loading || (!profile && !error);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeText}>Welcome {user?.username}!</Text>
        
        {loading && (
          <Text style={styles.statusText}>🔄 Cargando perfil...</Text>
        )}
        {error && (
          <Text style={styles.errorText}>⚠️ Error al cargar perfil</Text>
        )}

        <View style={styles.promptsSection}>
          <Text style={styles.promptTitle}>How are you feeling today?</Text>
          <Text style={styles.promptSubtitle}>Select an option to get started.</Text>
          {symptomPrompts.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.promptButton, isChatButtonDisabled && styles.disabledButton]}
              onPress={error ? handleRetryProfile : handleChatPress}
              disabled={!!isChatButtonDisabled}
            >
              <Text style={[styles.promptText, isChatButtonDisabled && styles.disabledText]}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={[styles.chatButton, isChatButtonDisabled && styles.disabledChatButton]}
          onPress={error ? handleRetryProfile : handleChatPress}
          disabled={!!isChatButtonDisabled}
        >
          <View style={styles.chatButtonContent}>
            <Text style={styles.chatButtonIcon}>💬</Text>
            <Text style={[styles.chatButtonText, isChatButtonDisabled && styles.disabledChatButtonText]}>
              {getChatButtonText()}
            </Text>
          </View>
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
  chatButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
    opacity: 0.6,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  disabledChatButton: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  disabledChatButtonText: {
    color: '#E5E7EB',
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;