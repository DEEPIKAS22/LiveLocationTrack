import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
//import { firebase, auth, database } from '../db/Firebase';
import { auth, database } from "../db/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import Icon from "react-native-vector-icons/FontAwesome";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [deviceCode, setDeviceCode] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [error, setError] = useState("");
  const handleRegister = async () => {
    try {
      //Checking if all fields are filled
      if (!email || !password || !deviceCode || !confirmPassword) {
        Alert.alert("Error", "Please enter all the mandatory fields!");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords don't match!");
        return;
      }
      //Creating user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential) {
        console.log("User successfully registered");
        Alert.alert("User has registered");
      }
      console.log(userCredential);

      //Get the user id from Firebase Authentication
      const uid = userCredential.user.uid;

      console.log(uid);
      //Get the current timestamp
      const registrationTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds

      //Saving user information to Firebase Realtime Database
      const userRef = ref(database, "users/" + uid);
      const res = set(userRef, {
        email: email,
        name: name,
        device_registration: {
          device_code: deviceCode,
          device_name: deviceName,
          registration_timestamp: registrationTimestamp,
        },
        activities: { demo: "" }, // Empty activity initialized
      });

      if (res) {
        console.log("Firebase Database stored something");
        Alert.alert("Success", "User registered successfully");
      }

      //Optionally, navigate to the login screen
      navigation.navigate("Login");
    } catch (error) {
      console.error("Registration error", error);
      Alert.alert("Registration Error", error.message);
    }
  };
  return (
    // ScrollView is used to make the screen scrollable in case of keyboard visibility
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Email Input Field */}
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#bbb" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Password Input Field */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#bbb" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Confirm Password Input Field */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#bbb" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm password *"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#bbb" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#bbb" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Device code *"
          value={deviceCode}
          onChangeText={setDeviceCode}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#bbb" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Device name"
          value={deviceName}
          onChangeText={setDeviceName}
        />
      </View>

      <Text style={styles.mandatoryNote}>* Fields are mandatory.</Text>

      {/* Display error message if any */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Link to Login screen */}
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Main container styling
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },

  // Title styling
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },

  // Input container to position the icon inside the input field
  inputContainer: {
    position: "relative",
    marginBottom: 15,
  },

  // Input field styling
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 40, // Space for the icon inside the input
    fontSize: 16,
    backgroundColor: "#fff",
  },

  // Positioning the icon inside the input field
  icon: {
    position: "absolute",
    top: 15,
    left: 10,
  },

  // Error message styling
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },

  // Register button styling
  registerButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 15,
    marginTop: 15,
  },

  // Register button text styling
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Text styling for the login link
  loginText: {
    textAlign: "center",
    fontSize: 17,
  },

  // Styling for the login link
  loginLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  mandatoryNote: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginTop: 0,
  },
});

export default Register;
