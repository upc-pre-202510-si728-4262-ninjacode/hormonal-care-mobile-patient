import React from 'react'
import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppointmentResponse, AppointmentState } from '../entities/appointmentEntitie';
import { Skeleton } from 'moti/skeleton';


interface AppointmentsCardProps {
    data: AppointmentResponse[];
    loading: boolean;
    error: string;
}

export const AppointmentsCard = ({ data, loading, error }: AppointmentsCardProps) => {
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
                        <View key={item.id} style={styles.contentContainer}>
                            <View style={{ ...styles.tag, backgroundColor: item.stateColor }}>
                                <Text style={styles.tagText}>{item.state}</Text>
                            </View>
                            <View style={styles.nameBox}>
                                <View style={styles.iconRow}>
                                    <FontAwesome name="user-md" size={20} color="#000" style={styles.icon} />
                                    <View>
                                        <Text style={{ paddingLeft: 10 }}>{item.doctorFullName}</Text>
                                        <Text style={{ paddingVertical: 2, paddingLeft: 10, fontSize: 12 }}>{item.doctorSpecialty}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.dateBox}>
                                <View>
                                    <MaterialIcons name="access-time" size={20} color="#000" />
                                    <MaterialIcons name="date-range" size={20} color="#000" />
                                </View>
                                <View style={{ paddingLeft: 10 }}>
                                    <Text style={{ paddingVertical: 2, color:'#4B5563', fontSize: 12 }}>{`${item.startTime} - ${item.endTime}`}</Text>
                                    <Text style={{ paddingVertical: 2, color:'#4B5563', fontSize: 12 }}>{item.eventDate}</Text>
                                </View>
                            </View>
                        </View>
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
    tag: {
        position: 'absolute',
        top: -10,
        right: 10,
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        zIndex: 1,
    },
    tagText: {
        color: '#4e4d4d',
        fontSize: 10,
        fontWeight: 'bold',
    },
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
    dateBox: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        alignSelf: 'center'
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        width: 20,
        alignSelf: 'flex-start',
    },
    subText: {
        color: '#4b5563',
        textAlign: 'center',
    },
})