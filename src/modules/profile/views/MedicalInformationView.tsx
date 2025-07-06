import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Skeleton } from 'moti/skeleton';

interface MedicalInformationViewProps {
    data: {
        typeOfBlood: string;
        personalHistory: string;
        familyHistory: string;
        doctorId: number | null;
    };
    loading: boolean;
    error: string;
    isBlurred?: boolean;
}

export const MedicalInformationView = ({ data, loading, error, isBlurred }: MedicalInformationViewProps) => {

    if (isBlurred) {
        return (
            <View>
                <View style={styles.noDataContainer}>
                    <Text style={styles.subText}>Medical Information Blocked</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.contentContainer}>
            {
                data ? (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
                                <Ionicons name="water-outline" size={20} style={styles.icon} />
                                <View style={styles.tag}>
                                    <Text style={styles.topText}>Type of Blood:</Text>
                                </View>
                                {
                                    loading ? (
                                        <Skeleton height={16} width={90} radius="round" colorMode="light" />
                                    ) : (
                                        <Text style={styles.subText}>{data.typeOfBlood}</Text>
                                    )
                                }
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
                                <FontAwesome name="user-md" size={20} color="black" style={styles.icon} />
                                <View style={styles.tag}>
                                    <Text style={styles.topText}>Current Doctor:</Text>
                                </View>
                                {
                                    loading ? (
                                        <Skeleton height={16} width={90} radius="round" colorMode="light" />
                                    ) : (
                                        <Text style={styles.subText}>{data.doctorId ? data.doctorId : 'No Specified'}</Text>
                                    )
                                }
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
                                <AntDesign name="filetext1" size={20} color="black" style={styles.icon} />
                                <View style={styles.tag}>
                                    <Text style={styles.topText}>Personal History:</Text>
                                </View>
                                {
                                    loading ? (
                                        <Skeleton height={16} width={90} radius="round" colorMode="light" />
                                    ) : (
                                        <Text style={styles.subText}>{data.personalHistory}</Text>
                                    )
                                }
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
                                <Feather name="users" size={20} color="black" style={styles.icon} />
                                <View style={styles.tag}>
                                    <Text style={styles.topText}>Family History:</Text>
                                </View>
                                {
                                    loading ? (
                                        <Skeleton height={16} width={90} radius="round" colorMode="light" />
                                    ) : (
                                        <Text style={styles.subText}>{data.familyHistory}</Text>
                                    )
                                }
                            </View>
                        </View>
                    </View>

                ) : (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.subText}>No Data Available</Text>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        borderRadius: 20,
        backgroundColor: '#f9f9f9',
        paddingVertical: 12,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 5,
        width: '100%',
    },
    noDataContainer: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: '#f9f9f9',
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignContent: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        marginTop: 5,
        width: '100%',
    },
    tag: {
        padding: 2,
        // backgroundColor: '#c8f1fa',
        paddingHorizontal: 8,
        borderRadius: 6,
        zIndex: 1,
        marginRight: 8,
    },
    subText: {
        color: '#4b5563',
        textAlign: 'center',
    },
    topText: {
        color: '#4b5563',
        fontSize: 11,
        fontWeight: 'bold',
    },
    icon: {
        width: 25,
        alignSelf: 'flex-start',
    },
})