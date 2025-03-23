import React, { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export const ActivityLogMap = ({ navigation, route }) => {
  const [logCoordinates, setLogCordinates] = useState([]);
  const [lastLocation, setLastLocation] = useState();
  const [isLastLocationEnabled, setIsLastLocationEnabled] = useState(false);
  const [isrouteTraceEnabled, setIsRouteTraceEnabled] = useState(false);

  useEffect(() => {
    console.log("Activity Log Map Mounted");
    console.log(route.params.data);
    setLastLocation(route.params.data.locationData.lastKnownLocation);
    setLogCordinates(route.params.data.locationData.logs);
  }, []);
  const handleRouteChange = () => {
    setIsRouteTraceEnabled(!isrouteTraceEnabled);
  };

  const handleLocationEnabled = () => {
    setIsLastLocationEnabled(!isLastLocationEnabled);
  };

  return (
    <SafeAreaView style={styles.component}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.leftButton} onPress={handleRouteChange}>
          <Text style={styles.buttonText}>Show activity route</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.leftButton}
          onPress={handleLocationEnabled}
        >
          <Text style={styles.buttonText}>Show Last Location</Text>
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
        {lastLocation && isLastLocationEnabled && (
          <Marker
            coordinate={{
              latitude: lastLocation.latitude,
              longitude: lastLocation.longitude,
            }}
          />
        )}
        {logCoordinates && isrouteTraceEnabled && (
          <Polyline
            coordinates={logCoordinates.map((p) => ({
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

export default ActivityLogMap;
