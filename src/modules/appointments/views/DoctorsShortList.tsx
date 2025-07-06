import React from 'react'
import { Text, View, StyleSheet, Image, useColorScheme } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DoctorResponse } from '../entities/doctorEntitie';
import { Skeleton } from 'moti/skeleton';
import { DoctorCard } from '../components/DoctorCard';

interface DoctorsCardProps {
    data: DoctorResponse;
    loading: boolean;
    error: string;
}

export const DoctorsCard = ({ data, loading, error }: DoctorsCardProps) => {
    const isEmptyData = !data ||
        (!data.fullName && !data.subSpecialty && !data.professionalIdentificationNumber);
    const colorScheme = useColorScheme();
    const color = colorScheme === 'dark' ? 'dark' : 'light';
    if (loading) {
        return (
            <View style={styles.contentContainer}>
                <View>
                    <Skeleton
                        radius="round"
                        width={80}
                        height={80}
                        colorMode= {color}
                    />
                </View>
                <View style={styles.descriptionBox}>
                    <Skeleton
                        width={'80%'}
                        height={20}
                        radius="round"
                        colorMode= {color}
                    />
                    <View style={{ height: 10 }} />
                    <Skeleton
                        width={'60%'}
                        height={14}
                        radius="round"
                        colorMode= {color}
                    />
                    <View style={{ height: 10 }} />
                    <Skeleton
                        width={'70%'}
                        height={14}
                        radius="round"
                        colorMode= {color}
                    />
                </View>
            </View>
        );
    }

    return (
        <>
            {
                !isEmptyData ? (
                    <DoctorCard
                        data={data}
                        size='large'
                    />
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
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    imageBox: {
        width: 80,
        height: 80,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: '#d0c4fb',
        backgroundColor: '#F5F5FF',
        marginRight: 12,
    },
    descriptionBox: {
        flex: 1,
        padding: 12,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '70%',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        width: 20,
    },
    noDataContainer: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subText: {
        color: '#4b5563',
        textAlign: 'center',
    },
})