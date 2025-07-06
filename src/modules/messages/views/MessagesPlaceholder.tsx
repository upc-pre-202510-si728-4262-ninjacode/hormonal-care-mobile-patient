import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons';
import { MessagesList } from './MessagesList';


export const MessagesPlaceholder = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search messages"
              placeholderTextColor={'#b6b7b8'}
            />
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          </View>
        </View>
        <View style={styles.contentContainer}>

        </View>
      </ScrollView>
    </View>
  )
}

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
    contentContainer: {
    justifyContent: 'center',
    padding: 24,
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
  }
})