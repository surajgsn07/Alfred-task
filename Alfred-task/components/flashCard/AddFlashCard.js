import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from '../../utils/axiosConfig.js';
import { useTheme } from '../../context/ThemeContext.js';

const AddFlashCard = ({ navigation }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
 
    const {isDarkMode} = useTheme()

    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#111' : '#f5f5f5',
            padding: 20,
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            color: isDarkMode ? '#fff' : '#111',
            marginBottom: 20,
        },
        input: {
            width: '100%',
            backgroundColor: isDarkMode ? '#222' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: isDarkMode ? '#444' : '#ccc',
        },
        button: {
            width: '100%',
            backgroundColor: isDarkMode ? 'green' : '#2ecc71',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });
    

    const handleAddFlashCard = async () => {
        if (!question.trim() || !answer.trim()) {
            Alert.alert('Error', 'Both fields are required');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/flashcard', {
                question,
                answer,
            });

            if (response.status === 201) {
                Alert.alert('Success', 'Flashcard added successfully');
                setQuestion('');
                setAnswer('');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add a Flash Card</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Question"
                placeholderTextColor="#999"
                value={question}
                onChangeText={setQuestion}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Answer"
                placeholderTextColor="#999"
                value={answer}
                onChangeText={setAnswer}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddFlashCard} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add Flash Card'}</Text>
            </TouchableOpacity>
        </View>
    );
};


export default AddFlashCard;
