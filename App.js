import React from "react";
import { StyleSheet } from "react-native";
import { CurrentActivityMap } from "./components/CurrentActivityMap";
import Register from "./components/Register";
import Login from "./components/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./components/Home";
import MyActivities from "./components/MyActivities";
import ActivityLogMap from "./components/ActivityLogMap";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="CurrentActivityMap"
          component={CurrentActivityMap}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MyActivities" component={MyActivities} />
        <Stack.Screen name="ActivityLogMap" component={ActivityLogMap} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: "#fff",
    padding: "3%",
    width: "50%",
    marginStart: "auto",
    marginEnd: "auto",
    marginBottom: "5%",
    marginTop: "5%",
    borderRadius: 15,
  },
  map: {
    width: "100%",
    aspectRatio: 0.6,
  },
});
