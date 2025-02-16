import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator, Button , TouchableOpacity, Alert } from 'react-native';
import SignupScreen from './components/auth/Signup.js';
import LoginScreen from './components/auth/Login.js';
import HomeScreen from './components/Screens/Home.js';
import AddFlashCard from './components/flashCard/AddFlashCard.js';
import PlayScreen from './components/Screens/Play.js';
import { ThemeProvider, useTheme } from './context/ThemeContext.js';
import Icon from 'react-native-vector-icons/Feather'; 
import AboutScreen from './components/About/About.js';
const Stack = createNativeStackNavigator();


const HeaderRight = ({ isDarkMode, toggleTheme }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 10 }} pointerEvents="box-none">
      <TouchableOpacity 
        onPress={() => toggleTheme()} // ✅ Check if this logs in console
        style={{ padding: 10 }} 
        activeOpacity={0.7} // ✅ Correct placement inside TouchableOpacity
      >
        <Icon name={isDarkMode ? "sun" : "moon"} size={24} color="#ffa500" />
      </TouchableOpacity>
    </View>
  );
};


const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme(); // Get theme state from context

  const checkAuth = async () => {
    const token = await SecureStore.getItemAsync('authToken');
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('authToken');
    setIsAuthenticated(false);
    checkAuth();
  };

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: isDarkMode ? '#111' : '#fff' },
          headerTintColor: isDarkMode ? '#fff' : '#000',
          headerRight: () => (
            <HeaderRight isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            ) 
        }}
       >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddFlashCard" component={AddFlashCard} />
            <Stack.Screen name="Play" component={PlayScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} checkAuth={checkAuth} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
