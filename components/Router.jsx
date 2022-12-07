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
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Form from "./components/Form";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Feed from "./components/Feed";
import * as Color from "./styles/Color";
import ChatList from "./components/ChatList";
import Chat from "./components/Chat";

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

export default function Router() {
  const authContext = createContext(undefined);
  // const authenticated = useContext(authContext);
  // const username = useContext(authContext);
  const [user, setUser] = useState("");

  const [isNotSignedIn, setIsNotSignedIn] = useState(true);

  const Tab = createMaterialBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  function FeedScreen() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Feed user={user} />
      </View>
    );
  }

  function ChatListScreen() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ChatList user={user} />
      </View>
    );
  }

  const ChatStackNavigator = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Chats" component={ChatListScreen} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    );
  };

  const FeedChatNavigator = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={"FeedNav"}
      >
        <Stack.Screen name="FeedNav" component={FeedScreen} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    );
  };

  function LoginScreen() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Login
          setUser={setUser}
          user={user}
          setIsNotSignedIn={setIsNotSignedIn}
        />
      </View>
    );
  }

  function ProfileScreen() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Profile user={user} />
      </View>
    );
  }

  function FormScreen() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Form user={user} />
      </View>
    );
  }

  return !isNotSignedIn ? (
    <Login setUser={setUser} user={user} setIsNotSignedIn={setIsNotSignedIn} />
  ) : (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Chat" component={Chat} />
      <Tab.Navigator
        initialRouteName="Feed"
        labeled="false"
        activeColor={Color.GREEN1}
        inactiveColor={Color.GREEN2}
        barStyle={{ backgroundColor: Color.GREEN3 }}
      >
        <Tab.Screen
          name="Feed"
          component={FeedChatNavigator}
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
          component={FormScreen}
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
          name="Chat List"
          component={ChatStackNavigator}
          options={{
            title: "User Chats",
            tabBarLabel: "Chat list",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="forum" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
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
      </Stack.Navigator>
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
