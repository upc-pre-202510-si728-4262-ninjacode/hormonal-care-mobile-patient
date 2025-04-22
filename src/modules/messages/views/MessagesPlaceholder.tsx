import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessagesPlaceholder = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.subText}>
        Your conversations with healthcare providers will appear here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    color: '#4b5563', // gray-600
    textAlign: 'center',
  },
});

export default MessagesPlaceholder;