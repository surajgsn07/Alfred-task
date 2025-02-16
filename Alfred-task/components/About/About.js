import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const AboutScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const [stage, setStage] = useState(1);
  const [isWrong, setIsWrong] = useState(false);
  const {isDarkMode} = useTheme()

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#111" : "#f5f5f5",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDarkMode ? "#ffa500" : "#ff8c00",
      marginBottom: 10,
      textAlign: "center",
    },
    description: {
      fontSize: 16,
      color: isDarkMode ? "#ccc" : "#333",
      textAlign: "center",
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#111",
      marginTop: 10,
    },
    flashcardContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },
    card: {
      backgroundColor: isDarkMode ? "#222" : "#fff",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      shadowColor: isDarkMode ? "#000" : "#ccc",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
    },
    cardText: {
      fontSize: 16,
      color: isDarkMode ? "#fff" : "#000",
      fontWeight: "bold",
    },
    arrow: {
      fontSize: 24,
      color: isDarkMode ? "#ffa500" : "#ff8c00",
      marginHorizontal: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      marginTop: 20,
    },
    correctButton: {
      backgroundColor: isDarkMode ? "#28a745" : "#2ecc71",
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    wrongButton: {
      backgroundColor: isDarkMode ? "#dc3545" : "#e74c3c",
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    stageText: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#111",
      marginTop: 20,
    },
    progressContainer: {
      flexDirection: "row",
      marginTop: 10,
    },
    progressBox: {
      width: 40,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 2,
      backgroundColor: isDarkMode ? "#666" : "#ddd",
    },
    warningText: {
      fontSize: 16,
      color: isDarkMode ? "#ff4444" : "#d63031",
      marginTop: 10,
      fontWeight: "bold",
    },
  });

  

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: stage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [stage]);

  const handleAnswer = (correct) => {
    if (correct) {
      if (stage < 5) {
        setStage(stage + 1);
        setIsWrong(false);
      }
    } else {
      setIsWrong(true);
      setStage(1);
      Animated.sequence([
        Animated.timing(cardAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(cardAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
        Animated.timing(cardAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 How Leitner
      System Works</Text>

      <Animated.Text style={[styles.description, { opacity: fadeAnim }]}>
        <Text style={{ fontWeight: "bold" }}>✅ Correct Answer:</Text> Move to the next stage.{"\n"}
        <Text style={{ fontWeight: "bold" }}>❌ Wrong Answer:</Text> Restart from <Text style={{ fontWeight: "bold" }}>Stage 1</Text>.{"\n"}
        <Text style={{ fontWeight: "bold" }}>👀 Show Answer:</Text> Resets to <Text style={{ fontWeight: "bold" }}>Stage 1</Text>.
    </Animated.Text>


      <Text style={styles.subtitle}>Example:</Text>

      <Animated.View style={[styles.flashcardContainer, { transform: [{ translateX: cardAnim }] }]}>
        <View style={styles.card}>
          <Text style={styles.cardText}>Q: What is 3 + 3?</Text>
        </View>
        <Text style={styles.arrow}>➡️</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>A: 6</Text>
        </View>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.correctButton} onPress={() => handleAnswer(true)}>
          <Text style={styles.buttonText}>✅ Correct</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.wrongButton} onPress={() => handleAnswer(false)}>
          <Text style={styles.buttonText}>❌ Wrong</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.stageText}>Current Stage: {stage}</Text>

      <View style={styles.progressContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.progressBox,
              {
                backgroundColor: index < stage ? "#ffa500" : "#444",
                opacity: progressAnim.interpolate({
                  inputRange: [index, index + 1],
                  outputRange: [1, 0.5],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
        ))}
      </View>

      {isWrong && <Text style={styles.warningText}>⚠️ Oops! Wrong answer. Back to Stage 1.</Text>}
    </View>
  );
};

export default AboutScreen;
