import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AppointmentResponse } from '../entities/appointmentEntitie'
import { AppointmentsCard } from './AppointmentsCard'

interface Props {
    searchQuery: string
    searchFilteredAppointments: AppointmentResponse[]
    appointmentLoading: boolean
    appointmentError: string
}

export const AppointmentsSearchList = ({ searchQuery, searchFilteredAppointments, appointmentLoading, appointmentError }: Props) => {
    return (
        <View style={styles.contentContainer}>
            <Text style={styles.title}>
                Results for <Text style={styles.query}>{`"${searchQuery}"`}</Text>
            </Text>
            <AppointmentsCard data={searchFilteredAppointments} loading={appointmentLoading} error={appointmentError} />
        </View>
    )
}

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
    }
})
