import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { auth, database } from "../db/FirebaseConfig";
import { ref, onValue } from "firebase/database";

const MyActivities = ({ navigation, route }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const userId = "xyHETuvee3dH8r2o5EIYiikkRiq1"; //user.uid;  // Get current logged-in user's ID
        const activityRef = ref(
          database,
          "users/" + auth.currentUser.uid + "/activities"
        ); //auth.currentUser.uid
        console.log("Acitivity ref =>     " + activityRef);
        onValue(activityRef, (snapShot) => {
          const activitiesData = snapShot.val();
          console.log(activitiesData);
          if (activitiesData) {
            const activitiesArray = Object.entries(activitiesData).map(
              ([key, value]) => ({
                key,
                ...value,
              })
            );
            setActivities(activitiesArray);
          } else {
            console.log("No activities found.");
          }
        });
      } catch (error) {
        console.error("Error fetching activities: ", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.activityName}>{item.activityName}</Text>
            <Text style={styles.activityName}>{item.key}</Text>
            <Text style={styles.activityDetails}>
              Start Time: {new Date(item.startTime).toLocaleString()}
            </Text>
            <Text style={styles.activityDetails}>
              End Time: {new Date(item.endTime).toLocaleString()}
            </Text>
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() =>
                navigation.navigate("ActivityLogMap", { data: item })
              }
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f4f8",
    padding: 15,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 18,
    marginVertical: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "100%",
    alignSelf: "center",
  },
  activityName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 10,
  },
  activityDetails: {
    fontSize: 14,
    color: "#333333",
    marginTop: 5,
  },
  loadingText: {
    fontSize: 18,
    color: "#2A9D8F",
    textAlign: "center",
    marginTop: 20,
  },
  viewDetailsButton: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  viewDetailsText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default MyActivities;
