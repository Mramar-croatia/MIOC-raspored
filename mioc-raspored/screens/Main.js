import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Alert } from 'react-native';

const firebaseConfig = {
    apiKey: "AIzaSyBUmBLaNXzPLimuuFifWzNO0fFH1q89AKI",
    authDomain: "mioc-raspored.firebaseapp.com",
    databaseURL: "https://mioc-raspored-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mioc-raspored",
    storageBucket: "mioc-raspored.firebasestorage.app",
    messagingSenderId: "574339371089",
    appId: "1:574339371089:web:98211af2c6bb5ecc15a870",
    measurementId: "G-C5Z8T0355P"
};

let db;

try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase failed to initialize:", error);
  Alert.alert("Database error", "Failed to initialize schedule data");
}

const Main = ({ navigation }) => {
  const [userClass, setUserClass] = useState('');
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const checkClass = async () => {
      try {
        const storedClass = await AsyncStorage.getItem('@user_class');
        if (!storedClass && isMounted) {
          navigation.replace('ClassSelection');
        } else if (isMounted) {
          setUserClass(storedClass);
        }
      } catch (error) {
        console.error("AsyncStorage error:", error);
      }
    };
  
    checkClass();
    
    return () => {
      isMounted = false; // Cleanup mounted flag
    };
  }, [navigation]);

  useEffect(() => {
    const weekday = ["Ned", "Pon", "Uto", "Sri", "Cet", "Pet", "Sub"];
    const d = new Date();
    const day = weekday[d.getDay()];
    setCurrentDay(day);

    if (userClass && db) { // Check if db exists
      const dbRef = ref(db, `classes/${userClass}/scheduleA/${day}`);
      onValue(dbRef, (snapshot) => {
        console.log('User data: ', snapshot.val());
      });
    }
  }, [userClass]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Schedule for {userClass}</Text>
      {(currentDay === "Sub" || currentDay === "Ned") ? (
        <Text style={styles.normalText}>Uživajte u vikendu (dok možete).</Text>
      ) : (
        <Text style={styles.normalText}>Trenutni sat: </Text>
      )}
      <TouchableOpacity style={styles.changeClassButton} onPress={() => navigation.navigate("ClassSelection")}>
        <Text style={styles.buttonText}>Switch class</Text>
      </TouchableOpacity>
    </View>
  );
};

// Keep your styles unchanged

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    color: '#2c3e50',
  },
  normalText: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 20,
    color: '#2c3e50',
  },
  changeClassButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  }
});

export default Main;