import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { DoctorsCard } from './DoctorsShortList';
import { AppointmentsRowCalendar } from './AppointmentsRowCalendar';
import { AppointmentsListPresenter, AppointmentsListViewInterface } from '../presenters/appointmentsPresenter';
import { AppointmentResponse, AppointmentState } from '../entities/appointmentEntitie';
import { DoctorResponse } from '../entities/doctorEntitie';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/entity/navigationEntities';
import { AppointmentShortList } from './AppointmentsShortList';

interface Props {
  presenter: AppointmentsListPresenter;
}

const AppointmentsPlaceholder = ({ presenter }: Props) => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [dateFilteredAppointments, setDateFilteredAppointments] = useState<AppointmentResponse[]>([]);
  const [doctor, setDoctor] = useState<DoctorResponse>({} as DoctorResponse);
  const [appointmentLoading, setAppointmentLoading] = useState<boolean>(true);
  const [appointmentError, setAppointmentError] = useState<string>('');
  const [doctorLoading, setDoctorLoading] = useState<boolean>(true);
  const [doctorError, setDoctorError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());


  const appointmentViewInterface: AppointmentsListViewInterface = {
    showLoading: () => setAppointmentLoading(true),
    hideLoading: () => setAppointmentLoading(false),
    showError: (message: string) => setAppointmentError(message),
    showAppointments: (appointments: AppointmentResponse[]) => setAppointments(appointments),
  }

  const doctorViewInterface = {
    showLoading: () => setDoctorLoading(true),
    hideLoading: () => setDoctorLoading(false),
    showError: (message: string) => setDoctorError(message),
    showCurrentDoctor: (doctor: DoctorResponse) => setDoctor(doctor),
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        presenter.loadAppointments(),
        presenter.loadCurrentDoctor()
      ]);
    } catch (error) {
      console.error("Error al recargar:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredData = appointments.filter(item => new Date(`${item.eventDate}T${item.endTime}`) > new Date());
  const sortedData = filteredData.sort((a, b) => {
    const dateA = new Date(`${a.eventDate}T${a.startTime}`);
    const dateB = new Date(`${b.eventDate}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  }
  );
  const onlyDataToDisplay = sortedData[0] ? [sortedData[0]] : [];
  const firstItem = onlyDataToDisplay[0];
  const appointmentsDates = appointments.map(item => item.eventDate);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const dataAppointments = appointments.filter(item => {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const selectedDateString = `${year}-${month}-${day}`;
      return item.eventDate === selectedDateString;
    });
    dataAppointments.sort((a, b) => {
      const dateA = new Date(`${a.eventDate}T${a.startTime}`);
      const dateB = new Date(`${b.eventDate}T${b.startTime}`);
      return dateB.getTime() - dateA.getTime();
    }
    );
    setDateFilteredAppointments(dataAppointments);
  }, [selectedDate, appointments]);

  useEffect(() => {
    presenter.attachAppointmentView(appointmentViewInterface);
    presenter.loadAppointments();
    presenter.attachDoctorView(doctorViewInterface);
    presenter.loadCurrentDoctor();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="AI doctor and appointment search"
              placeholderTextColor={'#b6b7b8'}
              onTouchStart={() =>
                navigation.navigate('AppointmentsSearch')
              }
            />
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          </View>
        </View>
        {

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{firstItem
              ? firstItem.state === AppointmentState.ONGOING
                ? "Current Appointment"
                : "Next Appointment"
              : "No Appointment"}</Text>
            <AppointmentShortList data={onlyDataToDisplay} loading={appointmentLoading} error={appointmentError} />
            <Text style={styles.subText}>Appointments Timeline</Text>
            <AppointmentsRowCalendar selectedDate={selectedDate} appointmentsDates={appointmentsDates} setSelectedDate={setSelectedDate} />
            <AppointmentShortList data={dateFilteredAppointments} loading={appointmentLoading} error={appointmentError} />
            <Text style={styles.secondTitle}>Current Doctor</Text>
            <DoctorsCard data={doctor} loading={doctorLoading} error={doctorError} />
          </View>

        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 40,
  },
  contentContainer: {
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  secondTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 16,
  },
  subText: {
    color: '#4b5563',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default AppointmentsPlaceholder;
