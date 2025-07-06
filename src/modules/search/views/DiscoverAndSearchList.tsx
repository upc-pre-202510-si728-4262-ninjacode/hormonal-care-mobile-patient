import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AppointmentResponse } from '../../appointments/entities/appointmentEntitie'
import { DoctorResponse } from '../../appointments/entities/doctorEntitie'
import { Ionicons } from '@expo/vector-icons';
import { SearchAppointmentsListViewInterface, SearchDoctorsViewInterface, SearchListPresenter } from '../presenters/searchPresenter';
import { Skeleton } from 'moti/skeleton';
import { AppointmentsLongList } from '../../appointments/views/AppointmentsLongList';
import { DoctorsLongList } from '../../appointments/views/DoctorsLongList';

interface Props {
    presenter: SearchListPresenter;
}

export const DiscoverAndSearchList = ({ presenter }: Props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
    const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [tagSelected, setTagSelected] = useState('appointments');
    const [searchFilteredAppointments, setSearchFilteredAppointments] = useState<AppointmentResponse[]>([]);
    const [searchFilteredDoctors, setSearchFilteredDoctors] = useState<DoctorResponse[]>([]);

    const searchAppointmentsViewInterface: SearchAppointmentsListViewInterface = {
        showLoading: () => setLoading(true),
        hideLoading: () => setLoading(false),
        showError: (message: string) => console.error(message),
        showAppointments: (appointments: AppointmentResponse[]) => setAppointments(appointments),
    }

    const searchDoctorsViewInterface: SearchDoctorsViewInterface = {
        showLoading: () => setLoading(true),
        hideLoading: () => setLoading(false),
        showError: (message: string) => console.error(message),
        showCurrentDoctor: (doctors: DoctorResponse[]) => setDoctors(doctors),
    }

    useEffect(() => {
        presenter.attachAppointmentView(searchAppointmentsViewInterface);
        presenter.loadAppointments();
        presenter.attachDoctorView(searchDoctorsViewInterface);
        presenter.loadAllDoctors();
    }, [tagSelected]);

    useEffect(() => {
        const filteredAppointments = appointments.filter(item => {
            return (
                (item.doctorFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.startTime.includes(searchQuery) ||
                    item.endTime.includes(searchQuery)) || item.doctorSpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.state.toLowerCase().includes(searchQuery.toLowerCase()
                )
            );
        });

        const filteredDoctors = doctors.filter(item => {
            return (
                item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.subSpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.professionalIdentificationNumber.toString().includes(searchQuery)
            );
        });

        const orderedAppointments = filteredAppointments.sort((a, b) => {
            const dateTimeA = new Date(`${a.eventDate}T${a.startTime}`);
            const dateTimeB = new Date(`${b.eventDate}T${b.startTime}`);
            return dateTimeB.getTime() - dateTimeA.getTime();
        });

        const orderedDoctors = filteredDoctors.sort((a, b) => {
            const nameA = a.fullName.toLowerCase();
            const nameB = b.fullName.toLowerCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
        setSearchFilteredAppointments(orderedAppointments);
        setSearchFilteredDoctors(orderedDoctors);
    }, [searchQuery, appointments, doctors]);


    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder={'Search ' + tagSelected}
                        placeholderTextColor={'#b6b7b8'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
                    {searchQuery ? (
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color="#666"
                            style={styles.clearIcon}
                            onPress={() => setSearchQuery('')}
                        />
                    ) : null}
                </View>
                <TouchableOpacity>
                    <View style={styles.filterIcon}>
                        <Ionicons name="filter-outline" size={25} color="#666" />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.groupTags}>
                <View>
                    <TouchableOpacity onPress={() => setTagSelected('appointments')}>
                        <Text style={{ ...styles.tag, backgroundColor: tagSelected === 'appointments' ? '#d0c4fb' : '#f9f9f9' }}>Appointments</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => setTagSelected('doctors')}>
                        <Text style={{ ...styles.tag, backgroundColor: tagSelected === 'doctors' ? '#d0c4fb' : '#f9f9f9' }}>Doctors</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ ...styles.contentContainer, flex: loading ? 1 : 0 }}>
                {
                    loading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="small" color="#666" />
                        </View>
                    )

                        : (
                            tagSelected === 'appointments' ? (
                                <AppointmentsLongList data={searchFilteredAppointments} />
                            ) : (
                                <DoctorsLongList data={searchFilteredDoctors} />
                            )
                        )
                }
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    contentContainer: {
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 14,
    },
    query: {
        color: '#007AFF',
        fontWeight: '600',
    },
    groupTags: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    tag: {
        color: '#4b5563',
        fontSize: 12,
        borderRadius: 6,
        paddingHorizontal: 5,
        marginHorizontal: 5,
        paddingVertical: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    searchBar: {
        flex: 1,
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
    clearIcon: {
        marginLeft: 8,
    },
    filterIcon: {
        alignItems: 'center',
        paddingLeft: 8,
        paddingTop: 8,
    },
})
