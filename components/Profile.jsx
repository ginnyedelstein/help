import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useState, useLayoutEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Login from "./Login";
import Config from "../lib/Config";

const Profile = ({ user }) => {
  const [userData, setUserData] = useState({});
  const userName = user.replace(/"/g, "");
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
  console.log(userData.firstName);
  return (
    <View style={styles.container}>
      <Text>CURRENT USER: {userData.userId}</Text>
      <Text />
      <Text />

      <Text />

      <MaterialCommunityIcons name="account-circle" color={"grey"} size={100} />
      {userData ? <Text>{userData.firstName}</Text> : <Text />}

      <View style={{ flexDirection: "row" }}>
        <MaterialCommunityIcons name="star" color={"grey"} size={30} />
        <MaterialCommunityIcons name="star" color={"grey"} size={30} />
        <MaterialCommunityIcons name="star" color={"grey"} size={30} />
      </View>
      <Text />

      <Text>{userData ? userData["helpsGiven"] : "0"} helps given</Text>
      <Text>
        {userData ? userData["helpsReceived"] : "0"} helps received
      </Text>
      <Text />
      <Text>{userData ? userData["gender"] : ""}</Text>
      <Text>{userData ? userData["address"] : ""}</Text>
      <Text>{userData ? userData["birthdate"] : ""}</Text>
    </View>
  );
};
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
});
