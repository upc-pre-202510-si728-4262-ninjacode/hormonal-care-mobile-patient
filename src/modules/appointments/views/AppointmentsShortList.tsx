import React from 'react'
import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import { AppointmentResponse } from '../entities/appointmentEntitie';
import { Skeleton } from 'moti/skeleton';
import { AppointmentCard } from '../components/AppointmentCard';


interface AppointmentsCardProps {
    data: AppointmentResponse[];
    loading?: boolean;
    error: string;
}

export const AppointmentShortList = ({ data, loading, error }: AppointmentsCardProps) => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'dark' ? 'dark' : 'light';

    if (loading) {
        return (
            <View style={styles.contentContainer}>
                <View style={styles.nameBox}>
                    <View style={{ marginLeft: 10 }}>
                        <Skeleton height={16} width={160} radius="round" colorMode={color} />
                    </View>
                    <View style={{ marginLeft: 10, paddingVertical: 5 }}>
                        <Skeleton height={12} width={140} radius="round" colorMode={color} />
                    </View>
                </View>

                <View style={styles.nameBox}>
                    <View style={{ marginLeft: 10 }}>
                        <Skeleton height={14} width={100} radius="round" colorMode={color} />
                    </View>
                    <View style={{ marginLeft: 10, paddingVertical: 5 }}>
                        <Skeleton height={14} width={100} radius="round" colorMode={color} />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <>
            {
                data.length > 0 ? (
                    data.map((item, index) => (
                        <AppointmentCard key={index} item={item} />
                    ))
                ) : (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.subText}>No Data Available</Text>
                    </View>
                )
            }
        </>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        paddingVertical: 5,
        paddingHorizontal: 12,
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    noDataContainer: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    nameBox: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
    },
    subText: {
        color: '#4b5563',
        textAlign: 'center',
    },
})