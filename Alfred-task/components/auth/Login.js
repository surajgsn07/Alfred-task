import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from '../../utils/axiosConfig.js';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../../context/ThemeContext.js';

const LoginScreen = ({ navigation, checkAuth }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/user/login', form);
      if (response.data) {
        await SecureStore.setItemAsync('authToken', response.data.token);
        Alert.alert('Success', 'Login successful!');
        await checkAuth();
      }
    } catch (error) {
      console.log("error:", error.response?.data || error.message);
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#111' : '#f5f5f5' }]}>
      <Text style={styles.title}>Login</Text>

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
        onPress={handleLogin} 
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.replace('Signup')}>
        <Text style={styles.linkText}>
          Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
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
});
