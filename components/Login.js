import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { auth } from "../db/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import { Image } from "react-native";

export const Login = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email && password) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);

        if (res) {
          console.log("Firebase operation succcessful");
          navigation.navigate("Home", { useRoute: true });
        } else {
          alert("Firebase operation failed");
        }
      } catch (e) {
        console.log("Exception", e);
      }
    } else {
      alert("Email or password not present");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.image}>
        <Image source={require("../assets/7171906.png")} />
      </View>

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
      <TouchableOpacity style={styles.registerButton} onPress={handleLogin}>
        <Text style={styles.registerButtonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.loginText}>
        So not have an account?{" "}
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.loginLink}>SignUp</Text>
        </TouchableOpacity>
      </Text>
    </SafeAreaView>
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
  image: {
    height: "70%",
    width: "100%",
    alignItems: "center",
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

export default Login;
