import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Appointment } from '../entity/appointment.entity';
import { AppointmentsPresenter } from '../presenter/appointment.presenter';

const AppointmentsScreen = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    const data = await AppointmentsPresenter.loadAppointments();
    setAppointments(data);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    await AppointmentsPresenter.bookAppointment({
      eventDate: selectedDate,
      startTime: selectedTime,
      endTime: selectedTime,
      title: 'Consulta médica',
      description: 'Consulta de síntomas hormonales',
      doctorId: 1, // Ejemplo fijo
      patientId: 123, // Ejemplo fijo
      color: '#5A67D8',
    });

    loadAppointments();
    setSelectedTime('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Calendar
        onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#4338CA' },
        }}
        style={styles.calendar}
      />

      <View style={styles.timesContainer}>
        <Text style={styles.sectionTitle}>Selecciona un horario</Text>

        <View style={styles.timesGrid}>
          {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'].map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeCard,
                selectedTime === time && styles.selectedTimeCard,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={styles.timeText}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          (!selectedDate || !selectedTime) && styles.disabledButton,
        ]}
        onPress={handleBooking}
        disabled={!selectedDate || !selectedTime}
      >
        <Text style={styles.confirmButtonText}>Confirmar Cita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: 'white', flexGrow: 1 },
  calendar: { marginBottom: 20, borderRadius: 12, elevation: 2 },
  timesContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#111827', textAlign: 'center' },
  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  timeCard: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, margin: 6, backgroundColor: 'white' },
  selectedTimeCard: { borderColor: '#4338CA', backgroundColor: '#EEF2FF' },
  timeText: { fontSize: 16, color: '#374151' },
  confirmButton: { backgroundColor: '#4338CA', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  disabledButton: { backgroundColor: '#9CA3AF' },
  confirmButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default AppointmentsScreen;
