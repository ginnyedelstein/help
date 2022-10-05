import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useState, useLayoutEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Login from "./Login";

const Profile = ({ user }) => {
  const [userData, setUserData] = useState({});
  const userName = user.replace(/"/g, "");
  const lnk = `https://yl2dnogf69.execute-api.us-east-1.amazonaws.com/users/83a6b4bd-9975-42ba-987d-e12d031a80b0`;
  const fetchUser = async () => {
    try {
      const res = await fetch(
        `https://yl2dnogf69.execute-api.us-east-1.amazonaws.com/users/83a6b4bd-9975-42ba-987d-e12d031a80b0`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
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
  console.log(userData);
  return (
    <View style={styles.container}>
      <Text>CURRENT USER: {user}</Text>
      <Text />
      <Text />

      <Text />

      <MaterialCommunityIcons name="account-circle" color={"grey"} size={100} />
      {userData[0] ? <Text>{userData[0]["firstName"]}</Text> : <Text />}

      <View style={{ flexDirection: "row" }}>
        <MaterialCommunityIcons name="star" color={"grey"} size={30} />
        <MaterialCommunityIcons name="star" color={"grey"} size={30} />
        <MaterialCommunityIcons name="star" color={"grey"} size={30} />
      </View>
      <Text />

      <Text>{userData[0] ? userData[0]["helpsGiven"] : "0"} helps given</Text>
      <Text>
        {userData[0] ? userData[0]["helpsReceived"] : "0"} helps received
      </Text>
      <Text />
      <Text>{userData[0] ? userData[0]["gender"] : ""}</Text>
      <Text>{userData[0] ? userData[0]["address"] : ""}</Text>
      <Text>{userData[0] ? userData[0]["birthdate"] : ""}</Text>
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
