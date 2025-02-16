import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from '../../utils/axiosConfig.js';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../../context/ThemeContext.js';

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isDarkMode } = useTheme();

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSignup = async () => {
    if (!form.username || !form.password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post('/user/register', form);
      console.log(response.data);
      
      if (response.data) {
        Alert.alert('Success', 'Account created successfully!');
        navigation.replace('Login');
      }
    } catch (error) {
      console.log("Signup Error:", error.response?.data || error.message);
      setError(error.response?.data?.message || 'Something went wrong');
      Alert.alert('Signup Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#111' : '#f5f5f5' }]}>
      <Text style={[styles.title, { color: 'white' }]}>Sign Up</Text>
      
      <TextInput
        style={[styles.input, { backgroundColor: isDarkMode ? '#222' : '#ddd' }]}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={form.username}
        onChangeText={(text) => handleChange('username', text)}
      />
      
      <TextInput
        style={[styles.input, { backgroundColor: isDarkMode ? '#222' : '#ddd' }]}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
      />

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: isDarkMode ? '#28a745' : '#007bff' }, loading && styles.disabledButton]} 
        onPress={handleSignup} 
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.replace('Login')}>
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.linkHighlight}>Login</Text>
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  linkContainer: {
    marginTop: 15,
  },
  linkText: {
    color: '#bbb',
  },
  linkHighlight: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
