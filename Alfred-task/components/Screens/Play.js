import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import axios from '../../utils/axiosConfig.js';
import { useTheme } from '../../context/ThemeContext.js';

const PlayScreen = ({ navigation }) => {
    const [flashCards, setFlashCards] = useState([]);
    const [index, setIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const slideAnim = new Animated.Value(0);
    const {isDarkMode} = useTheme()

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#111' : '#f5f5f5',
            padding: 20
        },
        questionContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#222' : '#fff',  
            padding: 20,
            width: '90%',  
            borderWidth: 2,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 6,
        },
        boxNumber: {
            color: isDarkMode ? 'white' : 'black',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10
        },
        questionText: {
            color: isDarkMode ? '#fff' : '#000',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center'
        },
        option: {
            width: '100%',
            backgroundColor: 'green',
            paddingVertical: 12,
            borderRadius: 8,
            marginVertical: 10,
            alignItems: 'center'
        },
        optionText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold'
        },
        loadingOption: {
            backgroundColor: 'gray'
        },
        correctOption: {
            backgroundColor: 'blue'
        },
        showAnswerBtn: {
            marginTop: 20,
            backgroundColor: isDarkMode ? '#444' : '#ddd',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8
        },
        nextCardBtn: {
            marginTop: 10,
            backgroundColor: '#007AFF',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8
        },
        btnText: {
            color: isDarkMode ? 'white' : 'black',
            fontSize: 16,
            fontWeight: 'bold'
        },
        loadingText: {
            color: isDarkMode ? 'white' : 'black',
            fontSize: 24,
            fontWeight: 'bold'
        }
    });


    // Fetch flashcards
    const fetchFlashCards = async () => {
        try {
            const response = await axios.get('/flashcard/get');
            if (response.data.length > 0) {
                setFlashCards(response.data);
                setIndex(0);
                if(response.data.length > 0)
                    fetchOptions(response.data[0]);
                 // Fetch options for the first question
            }else{
                setLoading(false);
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
            setLoading(false);
        }
    };

    // Fetch incorrect options
    const fetchOptions = async (flashcard) => {
        if (!flashcard) return;
        try {
            const response = await axios.post(
                'https://pcte-synopsis-server.onrender.com/api/getcontent',
                {
                    prompt: `I am providing you a question and an answer. I want you to give three more options which will be wrong but I wanna show them in the UI. Question: ${flashcard.question}, Answer: ${flashcard.answer} . Give those incorrect answers in an array only. No any other text`
                }
            );

            const incorrectOptions = JSON.parse(response.data.data);
            const allOptions = [flashcard.answer, ...incorrectOptions].sort(() => Math.random() - 0.5);
            setOptions(allOptions);
        } catch (error) {
            console.log(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle option selection
    const handleOptionSelect = async(selected) => {
        setSelectedOption(selected);

            if (flashCards[index].answer === selected) {
                try {
                    const response = await axios.put(`/flashcard/${flashCards[index]._id}` , {
                        isCorrect: true
                    })
        
                    if(response.status === 201) {
                        Alert.alert('✅ Correct!', 'You chose the right answer.');
                    }
                } catch (error) {
                    Alert.alert('Error', 'Something went wrong');
                }finally{
                    
                    setSelectedOption(null);
                    handleNextCard()
                }

                
            } else {
                try {
                    const response = await axios.put(`/flashcard/${flashCards[index]._id}` , {
                        isCorrect: false
                    })
        
                    if(response.status === 201) {
                        Alert.alert('❌ Wrong!', 'Try again next time.');
                    }
                } catch (error) {
                    Alert.alert('Error', 'Something went wrong');
                }finally{
                    
                    setSelectedOption(null);
                    handleNextCard()
                }

            }

    };

    // Show the correct answer
    const handleShowAnswer = async() => {
        try {
            const response = await axios.put(`/flashcard/${flashCards[index]._id}` , {
                isCorrect: false
            })

            if(response.status === 201) {
                setShowAnswer(true);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        }
    };

    // Move to the next question with animation
    const handleNextCard = () => {
        if (index + 1 < flashCards.length) {
            Animated.timing(slideAnim, {
                toValue: -300,
                duration: 300,
                useNativeDriver: true
            }).start(() => {
                setIndex((prevIndex) => {
                    const newIndex = prevIndex + 1;
                    
                    if (newIndex < flashCards.length) {
                        fetchOptions(flashCards[newIndex]); 
                        setShowAnswer(false);
                    }
            
                    return newIndex;
                });
            
                // Reset position before starting new animation
                slideAnim.setValue(0);
            
                Animated.timing(slideAnim, {
                    toValue: -300,
                    duration: 300,
                    useNativeDriver: true
                }).start();
            });
            
        } else {
            Alert.alert('Game Over', 'You have completed all flashcards!');
            navigation.replace('Home');
        }
    };

    useEffect(() => {
        fetchFlashCards();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={  {color: isDarkMode ? 'white' : 'black' , marginBottom: 10 , fontSize: 20} }>Flash Cards remaining : {flashCards.length - index}</Text>
            {flashCards.length > 0 && (
                <Animated.View style={[styles.questionContainer, { transform: [{ translateX: slideAnim }] }]}>
                    {/* Box Number */}
                    <Text style={styles.boxNumber}>Stage : {flashCards[index].box}</Text>

                    {/* Question */}
                    <Text style={styles.questionText}>{flashCards[index].question}</Text>

                    {/* Options */}
                    {options.map((option, i) => (
                        <TouchableOpacity 
                            key={i} 
                            style={[
                                styles.option,
                                selectedOption === option && styles.loadingOption,
                                showAnswer && option === flashCards[index].answer && styles.correctOption
                            ]}
                            onPress={() => handleOptionSelect(option)}
                            disabled={selectedOption !== null} // Disable while loading
                        >
                            <Text style={styles.optionText}>
                                {selectedOption === option ? 'Loading...' : option}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    {/* Show Answer Button */}
                    <TouchableOpacity style={styles.showAnswerBtn} onPress={handleShowAnswer}>
                        <Text style={styles.btnText}>Show Answer</Text>
                    </TouchableOpacity>

                    {/* Next Card Button */}
                    <TouchableOpacity style={styles.nextCardBtn} onPress={handleNextCard}>
                        <Text style={styles.btnText}>Next Card</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

export default PlayScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#111',
//         padding: 20
//     },
//     questionContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#222',  
//         padding: 20,
//         width: '90%',  
//         borderWidth: 2,
//         borderColor: 'rgba(255, 255, 255, 0.2)',  
//         borderRadius: 12,  
//         shadowColor: '#000',  
//         shadowOffset: { width: 0, height: 5 },
//         shadowOpacity: 0.3,
//         shadowRadius: 10,
//         elevation: 6,  
//     },
//     boxNumber: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10
//     },
//     questionText: {
//         color: '#fff',
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         textAlign: 'center'
//     },
//     option: {
//         width: '100%',
//         backgroundColor: 'green',
//         paddingVertical: 12,
//         borderRadius: 8,
//         marginVertical: 10,
//         alignItems: 'center'
//     },
//     optionText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold'
//     },
//     loadingOption: {
//         backgroundColor: 'gray'
//     },
//     correctOption: {
//         backgroundColor: 'blue'
//     },
//     showAnswerBtn: {
//         marginTop: 20,
//         backgroundColor: '#444',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 8
//     },
//     nextCardBtn: {
//         marginTop: 10,
//         backgroundColor: '#007AFF',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 8
//     },
//     btnText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold'
//     },loadingText:{
//         color: 'white',
//         fontSize: 24,
//         fontWeight: 'bold'
//     }
// });
