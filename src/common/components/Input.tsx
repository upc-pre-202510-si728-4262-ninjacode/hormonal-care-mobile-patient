import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: any;
  error?: string;
}

const Input = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false,
  autoCapitalize = 'none',
  style,
  error,
  ...props 
}: InputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={[styles.inputContainer, error ? styles.inputError : styles.inputNormal]}>
        <TextInput
          style={[styles.input, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !passwordVisible}
          autoCapitalize={autoCapitalize}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons 
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={24} 
              color="#6200ee" 
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  inputNormal: {
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#b00020',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  iconButton: {
    padding: 10,
  },
  errorText: {
    color: '#b00020',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;