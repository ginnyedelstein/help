import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Config from "../lib/Config";
import { useContext } from "react";
import { authContext } from "./AuthContext";

const Profile = () => {
  const { user, setIsNotSignedIn, setUser } = useContext(authContext);
  const [userData, setUserData] = useState({});
  const userName = user?.replace(/"/g, "");
  const lnk = `${Config.apiUrl}/users/${userName}`;

  const fetchUser = async () => {
    try {
      const res = await fetch(`${Config.apiUrl}/users/${userName}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const resJson = await res.json();
      if (res.status === 200) {
        let json_data = resJson.body;
        setUserData(json_data);
      } else {
        alert("not 200", res.status);
      }
    } catch (err) {
      alert("caught", err);
    }
  };

  useLayoutEffect(() => {
    fetchUser();
  }, []);

  const Logout = () => {
    setIsNotSignedIn(true);
    setUser(false);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="account-circle"
          color={"grey"}
          size={100}
        />
        {userData ? <Text>{userData.firstName}</Text> : <Text />}

        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons name="star" color={"grey"} size={30} />
          <MaterialCommunityIcons name="star" color={"grey"} size={30} />
          <MaterialCommunityIcons name="star" color={"grey"} size={30} />
        </View>
        <Text />

        <Text>{userData ? userData["helpsGiven"] : "0"} helps given</Text>
        <Text>{userData ? userData["helpsReceived"] : "0"} helps received</Text>
        <Text />
        <Text>{userData ? userData["gender"] : ""}</Text>
        <Text>{userData ? userData["address"] : ""}</Text>
        <Text>{userData ? userData["birthdate"] : ""}</Text>

        <TouchableOpacity onPress={() => Logout()} style={styles.buttonLogout}>
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
  buttonLogout: {
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: Dimensions.get("window").width - 200,
    height: 44,
    borderRadius: 5,
    backgroundColor: "red",
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
  },
});
