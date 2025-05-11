import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { HomeRouter } from '../router/home.router';
import { useAuth } from '../../../common/contexts/AuthContext';

const HomeScreen = ({ navigation }: any) => {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>👋 ¡Bienvenido a HormoIA!</Text>
        <Text style={styles.subtitleText}>Tu asistente de salud hormonal</Text>
      </View>

      {/* Botón principal para Chat */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => HomeRouter.goToChat(navigation)}
      >
        <Text style={styles.chatButtonText}>🗣️ Iniciar Consulta con IA</Text>
      </TouchableOpacity>

      {/* Sección de Funciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Qué puedes hacer?</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Gestión de Registros Médicos</Text>
          <Text style={styles.cardDescription}>
            Guarda tu historial médico de forma segura y organizada.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧬 Monitoreo de Síntomas</Text>
          <Text style={styles.cardDescription}>
            Reporta y sigue tus síntomas hormonales y visuales fácilmente.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📸 Análisis Visual Inteligente</Text>
          <Text style={styles.cardDescription}>
            Detecta cambios en rostro, piel o cabello con IA avanzada.
          </Text>
        </View>
      </View>

      {/* Recordatorio de Citas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Próxima Cita</Text>

        <View style={styles.reminderCard}>
          <Text style={styles.reminderTitle}>Análisis hormonal sugerido</Text>
          <Text style={styles.reminderSubtitle}>15 de mayo de 2025</Text>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => HomeRouter.goToAppointments(navigation)}
          >
            <Text style={styles.detailsButtonText}>Ver detalles ➔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>HormoIA - Cuidando tu equilibrio hormonal 🌟</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logoutButton: { width: '50%' },
  container: { 
    padding: 20, 
    backgroundColor: 'white', 
    flexGrow: 1 
  },
  header: { 
    marginBottom: 24 
  },
  welcomeText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#4338CA', 
    textAlign: 'center' 
  },
  subtitleText: { 
    fontSize: 16, 
    color: '#6B7280', 
    textAlign: 'center', 
    marginTop: 4 
  },
  chatButton: { 
    backgroundColor: '#4338CA', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginVertical: 20 
  },
  chatButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  section: { 
    marginBottom: 24 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16,
     color: '#111827' 
    },
  card: { 
    backgroundColor: '#F9FAFB', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 6 
  },
  cardDescription: { 
    fontSize: 14, 
    color: '#6B7280'
  },
  reminderCard: { 
    backgroundColor: '#EEF2FF',
    padding: 16, 
    borderRadius: 12 
  },
  reminderTitle: { 
    fontSize: 16,
    fontWeight: '600' 
  },
  reminderSubtitle: { 
    fontSize: 14, 
    color: '#374151', 
    marginVertical: 6 
  },
  detailsButton: {
     marginTop: 8 
    },
  detailsButtonText: { 
    color: '#4338CA',
     fontWeight: '600' 
    },
  footer: { 
    marginTop: 40, 
    alignItems: 'center'
   },
  footerText: { 
    fontSize: 12, 
    color: '#9CA3AF' 
  },
});

export default HomeScreen;
