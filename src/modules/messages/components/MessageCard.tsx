import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MessageResponse } from '../entities/messageEntitie'

export const MessageCard = ( {item} : { item : MessageResponse } ) => {
  return (
    <View key={item.id} style={styles.contentContainer}>
        <View>
            <Text>Hola</Text>
        </View>
    </View>
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
})