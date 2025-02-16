import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const HomeScreen = ({ navigation }) => {
    const { isDarkMode } = useTheme();

    const buttons = [
        { title: 'Add Flash Card', screen: 'AddFlashCard' },
        { title: 'Play', screen: 'Play' },
        { title: 'How it works', screen: 'About' }
    ];

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#111' : '#f5f5f5' }]}>
            <View style={styles.wrapper}>
                {buttons.map(({ title, screen }) => (
                    <TouchableOpacity
                        key={screen}
                        style={[styles.button, { backgroundColor: isDarkMode ? 'green' : '#007bff' }]}
                        onPress={() => navigation.navigate(screen)}
                    >
                        <Text style={styles.buttonText}>{title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        width: '80%',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 30,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff', // Always white
    },
});

export default HomeScreen;
