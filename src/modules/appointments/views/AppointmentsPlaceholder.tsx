import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AppointmentsPlaceholder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search appointments"
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
      </View>
      
      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.subText}>
          Your upcoming appointments will appear here.
        </Text>
      </View>
    </View>
  );
};

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
  },
  clearIcon: {
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subText: {
    color: '#4b5563',
    textAlign: 'center',
  },
});

export default AppointmentsPlaceholder;