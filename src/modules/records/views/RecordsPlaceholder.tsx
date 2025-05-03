import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getMedicalRecordById } from '../interactors/record.interactor'; // Debes crearlo
import { MedicalRecord } from '../entity/record.entity'; // Asegúrate de tener este modelo definido


const RecordPlaceholder = () => {
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await getMedicalRecordById(1); // ID fijo por ahora
        setRecord(response);
      } catch (err) {
        setError('Error fetching medical record');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.text}>Loading record...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.text, { color: 'red' }]}>{error}</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>No record found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medical Record</Text>
      <Text style={styles.label}>ID: <Text style={styles.value}>{record.id}</Text></Text>
      <Text style={styles.label}>Patient ID: <Text style={styles.value}>{record.patientId}</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  value: {
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
  },
});

export default RecordPlaceholder;