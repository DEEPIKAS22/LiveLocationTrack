import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { database, auth } from "../db/FirebaseConfig";
import { signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";

const HomeScreen = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [isLocation, setIsLocation] = useState(false);
  const [userName, setUserName] = useState("User");
  const [deviceDetails, setDeviceDetails] = useState({});

  useEffect(() => {
    getUserName();
    getCurrentLocation();
  }, []);

  async function getUserName() {
    try {
      const uid = auth.currentUser.uid;
      const userRef = ref(database, "users/" + uid);
      onValue(userRef, (snapshot) => {
        setUserName(snapshot.val().name);
        setDeviceDetails({
          name: snapshot.val().device_registration.device_name,
          code: snapshot.val().device_registration.device_code,
          time: snapshot.val().device_registration.registration_timestamp,
        });
      });
    } catch (e) {
      navigation.navigate(Login);
    }
  }
  async function handleLogout() {
    signOut(auth)
      .then(() => {
        Alert.alert("Signing Out", "Do you want to Sign out?", [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel", // Optional style
          },
          {
            text: "OK",
            onPress: () => navigation.pop(),
            style: "cancel", // Optional style
          },
        ]);
      })
      .catch((error) => {
        alert("Something went wrong");
      });
  }
  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
    } else {
      console.log("Permission Granted");
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    setLocation(location);

    if (location) {
      console.log("Fetched latest location");
      setIsLocation(true);
    }
  }

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <Text style={styles.greetingText}>Welcome {userName}</Text>
      <Text style={styles.subText}>Your current location</Text>
      <Text style={styles.subText}>Device Name : {deviceDetails.name}</Text>
      <Text style={styles.subText}>Device Code : {deviceDetails.code}</Text>
      <Text style={styles.subText}>
        Registration Time : {new Date(deviceDetails.time * 1000).toDateString()}
      </Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 19.1615734,
          longitude: 72.835277, // Goregaon West longitude
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={
            !isLocation
              ? {
                  latitude: 19.1615734,
                  longitude: 72.835277,
                }
              : {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }
          }
          title="Goregaon West"
        />
      </MapView>

      <View style={styles.buttonContainer}>
        {/* Left Button */}
        <TouchableOpacity
          style={styles.leftButton}
          onPress={() =>
            Alert.alert(
              "New Tracking Activity",
              "Do you want to start a new activity?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel", // Optional style
                },
                {
                  text: "Yes",
                  onPress: () => {
                    navigation.navigate("CurrentActivityMap");
                  },
                },
              ]
            )
          }
        >
          <Text style={styles.buttonText}>Start new activity</Text>
        </TouchableOpacity>

        {/* Right Button */}
        <TouchableOpacity
          style={styles.rightButton}
          onPress={() => navigation.navigate("MyActivities")}
        >
          <Text style={styles.buttonText}>My Activity</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => alert("Bottom Button Pressed")}
      >
        <Text style={styles.buttonText} onPress={handleLogout}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Center everything vertically
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  greetingText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2C6B2F",
    textAlign: "center",
  },
  subText: {
    fontSize: 18,
    color: "#388E3C",
    textAlign: "center",
    marginTop: 10,
  },
  map: {
    marginTop: 20,
    width: "100%",
    aspectRatio: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Space buttons evenly
    width: "100%",
    marginTop: 20,
    flexWrap: "wrap", // Allow buttons to wrap if space is tight
  },
  leftButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 20, // Reduced padding
    borderRadius: 8, // Slightly smaller border radius
    marginHorizontal: 10,
    marginBottom: 10,
  },
  rightButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12, // Reduced padding
    paddingHorizontal: 22, // Reduced padding
    borderRadius: 8, // Slightly smaller border radius
    marginHorizontal: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16, // Reduced font size
    textAlign: "center",
  },
  bottomButton: {
    marginTop: 30,
    backgroundColor: "#32CD32",
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 30, // Reduced padding
    borderRadius: 20, // Slightly smaller border radius
    width: "80%",
  },
});

export default HomeScreen;
