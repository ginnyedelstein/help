import React, { createContext, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Form from "./components/Form";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Feed from "./components/Feed";
import * as Color from "./styles/Color";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label("Email")
    .email("Enter a valid email")
    .required("Please enter a registered email"),
  password: Yup.string()
    .label("Password")
    .required()
    .min(6, "Password must have at least 6 characters "),
});

const ErrorMessage = ({ errorValue }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{errorValue}</Text>
  </View>
);

export default function App() {
  const authContext = createContext(undefined);
  // const authenticated = useContext(authContext);
  // const username = useContext(authContext);
  const [user, setUser] = useState("");

  const [isNotSignedIn, setIsNotSignedIn] = useState(false);

  const Tab = createMaterialBottomTabNavigator();

  function FeedScreen() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Feed user={user} />
      </View>
    );
  }

  function ChatScreen() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Chat Screen</Text>
      </View>
    );
  }

  function LoginScreen() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Login setUser={setUser} user={user} />
      </View>
    );
  }

  return isNotSignedIn ? (
    <Login />
  ) : (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Feed"
        labeled="false"
        activeColor={Color.GREEN1}
        inactiveColor={Color.GREEN2}
        barStyle={{ backgroundColor: Color.GREEN3 }}
      >
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            title: "The Feed",
            tabBarLabel: "Feed",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="rss-box" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Help"
          component={Form}
          options={{
            title: "Get/Give Help",
            tabBarLabel: "Get/Give Help",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="help-circle"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Chat"
          component={LoginScreen}
          options={{
            title: "Chat",
            tabBarLabel: "Chat",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="forum" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            title: "Profile",
            tabBarLabel: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account-box"
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: "red",
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
  input: {
    marginVertical: 10,
    width: Dimensions.get("window").width - 100,

    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: Dimensions.get("window").width - 200,
    height: 44,
    borderRadius: 5,
    backgroundColor: "#343434",
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
  },
});
