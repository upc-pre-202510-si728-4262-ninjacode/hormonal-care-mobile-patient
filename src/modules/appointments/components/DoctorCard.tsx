import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DoctorResponse } from '../entities/doctorEntitie';

interface DoctorCardProps {
    data : DoctorResponse;
    size?: string;
}

export const DoctorCard = ( {data, size} : DoctorCardProps ) => {
    const imageSize = size === 'large' ? 80 : 60;
    const padding = size === 'large' ? 12 : 0;
    const fontSize = size === 'large' ? 15 : 13;

    return (
        <View style={{...styles.contentContainer, paddingVertical: padding}}>
            <View style={{...styles.imageBox, width: imageSize, height: imageSize}}>
                <Image source={{ uri: `${data.image}` }} resizeMode='cover' style={styles.image} />
            </View>
            <View style={styles.descriptionBox}>
                <View style={styles.iconRow}>
                    <Text style={{ fontWeight: 'bold', fontSize: fontSize }}>{data.fullName}</Text>
                </View>
                <View style={styles.iconRow}>
                    <FontAwesome name="stethoscope" size={16} style={{ marginRight: 5 }} />
                    <Text style={{ fontSize: 12 }}>{data.subSpecialty}</Text>
                </View>
                <View style={styles.iconRow}>
                    <FontAwesome name="id-card" size={16} style={{ marginRight: 5 }} />
                    <Text style={{ fontSize: 12 }}>{data.professionalIdentificationNumber}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    imageBox: {
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
})
