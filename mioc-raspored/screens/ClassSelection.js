import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClassSelection = ({ navigation }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  
  const years = [1, 2, 3, 4];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const handleConfirm = async () => {
    if (!selectedYear || !selectedLetter) {
      Alert.alert('Incomplete Selection', 'Please select both year and class letter');
      return;
    }

    try {
      await AsyncStorage.setItem('@user_class', `${selectedYear}${selectedLetter}`);
      navigation.replace('Main');
      // Add notification permission request here later
    } catch (e) {
      Alert.alert('Error', 'Failed to save selection');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select Your Class</Text>

      {/* Year Selection Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Year</Text>
        <View style={styles.yearContainer}>
          {years.map(year => (
            <TouchableOpacity
              key={year}
              style={[
                styles.yearButton,
                selectedYear === year && styles.selectedButton
              ]}
              onPress={() => setSelectedYear(year)}
            >
              <Text style={styles.buttonText}>{year}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Letter Selection Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Class Letter</Text>
        <View style={styles.letterContainer}>
          {letters.map(letter => (
            <TouchableOpacity
              key={letter}
              style={[
                styles.letterButton,
                selectedLetter === letter && styles.selectedButton
              ]}
              onPress={() => setSelectedLetter(letter)}
            >
              <Text style={styles.buttonText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={[
          styles.confirmButton,
          (!selectedYear || !selectedLetter) && styles.disabledButton
        ]}
        onPress={handleConfirm}
        disabled={!selectedYear || !selectedLetter}
      >
        <Text style={styles.confirmText}>Confirm Selection</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#34495e',
  },
  yearContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  letterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  yearButton: {
    backgroundColor: '#3498db',
    padding: 18, // Reduced to account for border
    borderRadius: 10,
    width: '23%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent', // Initial transparent border
  },
  letterButton: {
    backgroundColor: '#3498db',
    padding: 18, // Reduced to account for border
    borderRadius: 10,
    width: '22%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedButton: {
    backgroundColor: '#2980b9',
    borderColor: '#2c3e50', // Visible border
    padding: 18, // Maintain same padding
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  confirmButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ClassSelection;