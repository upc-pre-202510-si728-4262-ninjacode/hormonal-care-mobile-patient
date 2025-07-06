import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Props } from 'react-native-paper';
import { Skeleton } from 'moti/skeleton';

interface PersonalInformationViewProps {
    data: { name: string; value: string }[];
    loading: boolean;
    error: string;
}

export const PersonalInformationView = ({ data, loading, error }: PersonalInformationViewProps) => {

    if (error) {
        return (
            <View style={styles.contentContainer}>
                <Text style={styles.subText}>Error loading data</Text>
            </View>
        );
    }

    return (
        <View style={styles.contentContainer}>
            {data && data.length > 0 ? (
                data.map((item, index) => (
                    <View key={index}>
                        <View style={styles.tag}>
                            <Text style={styles.topText}>{item.name}</Text>
                        </View>
                        {
                            loading ? (
                                <Skeleton height={16} width={90} radius="round" colorMode="light" />
                            ) : (
                                <Text style={styles.subText}>{item.value}</Text>
                            )
                        }
                    </View>
                ))
            ) : (
                <View style={styles.noDataContainer}>
                    <Text style={styles.subText}>No Data Available</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 5,
    },
    noDataContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        padding: 20,
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tag: {
        position: 'absolute',
        top: -20,
        backgroundColor: '#d0c4fb',
        paddingHorizontal: 8,
        borderRadius: 6,
        zIndex: 1,
    },
    subText: {
        color: '#4b5563',
        textAlign: 'center',
    },
    topText: {
        color: '#4b5563',
        fontSize: 11,
        fontWeight: 'bold',
    }
})