import React, { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { auth, database } from "../db/FirebaseConfig";
import { ref, set, push } from "firebase/database";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";

import * as Location from "expo-location";

export const CurrentActivityMap = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [isLocation, setIsLocation] = useState(false);
  const [activityName, setActivityName] = useState("Activity Name");
  const [locationRoute, setLocationRoute] = useState([]);
  const [isrouteTraceEnabled, setIsRouteTraceEnabled] = useState(false);
  const startTime = Date.now();
  //console.log(navigation)
  useEffect(() => {
    getCurrentLocation();
  }, [location]);

  console.log("Map started");
  /*
    const getLocationroute = async ()=>{

        //method to retrieve user activity's logs from firebase database
        return ""

    }
    const getLastKnownLocation = async ()=>{
        //Method to use firebase user's last know location
        
        return ""
    }
        */
  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log("Calling get Current Location");
    if (status !== "granted") {
      alert("Permission to access location was denied");
    } else {
      console.log("Permission Granted");
    }

    let location = await Location.getCurrentPositionAsync({});
    //console.log(location)
    setLocation(location);

    if (location) {
      console.log("Fetched latest location");
      createRoute = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      };
      route = locationRoute;
      route.push(createRoute);
      console.log("Setting location route", route);
      setLocationRoute(route);
      setIsLocation(true);
    }
  }

  const handleRouteTrace = () => {
    setIsRouteTraceEnabled(!isrouteTraceEnabled);
  };

  const handleStopActivity = async () => {
    const saveActivityData = async () => {
      try {
        console.log("Finishing Activity and storing data into Firebase");
        const activityRef = ref(
          database,
          "users/" + auth.currentUser.uid + "/activities"
        );
        const newActivityRef = push(activityRef);
        const locationData = {
          lastKnownLocation: locationRoute[locationRoute.length - 1],
          logs: locationRoute,
        };
        const activityData = {
          activityName: activityName,
          startTime: locationRoute[0].timestamp,
          endTime: locationRoute[locationRoute.length - 1].timestamp,
          locationData,
        };
        await set(newActivityRef, activityData);

        // Alert.alert("Activity ref");
        // const newActivityRef = activityRef.push()
        // const res = set(newActivityRef,{lastKnownLocation:locationRoute, activityLogs:locationRoute})
      } catch (e) {
        console.log("Failed to create a new activity");
        Alert.alert("Failed to add activity", e.message);
      }
    };

    function handleActivityNameAndStop() {}
    Alert.alert(
      "Stop tracking Activity?",
      "Do you want to stop the current activity and save the results?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel", // Optional style
        },
        {
          text: "OK",
          onPress: () => {
            Alert.prompt(
              "Enter Activity Name",
              "Please enter the name you want to store for your activity",
              (text) => setActivityName(text)
            );
            saveActivityData();
            navigation.pop();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.component}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.leftButton} onPress={handleRouteTrace}>
          <Text style={styles.buttonText}>Trace Activity Route</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.leftButton}
          onPress={handleStopActivity}
        >
          <Text style={styles.buttonText}>Stop Activity Track </Text>
        </TouchableOpacity>
      </View>

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
                  longitude: 70.835277,
                }
              : {
                  latitude: location["coords"]["latitude"],
                  longitude: location["coords"]["longitude"],
                }
          }
          title="Goregaon West"
        />
        {isrouteTraceEnabled && (
          <Polyline
            coordinates={locationRoute.map((p) => ({
              latitude: p.latitude,
              longitude: p.longitude,
            }))}
            strokeWidth={2}
            strokeColor={"red"}
            strokeColors={["#fff"]}
          />
        )}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 0,
    paddingVertical: 1,
    alignItems: "center",
    marginBottom: 15,
    marginTop: 15,
  },
  map: {
    width: "100%",
    aspectRatio: 0.6,
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
    paddingHorizontal: 10, // Reduced padding
    borderRadius: 8, // Slightly smaller border radius
    marginHorizontal: 20,
    marginBottom: 5,
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
});

export default CurrentActivityMap;
