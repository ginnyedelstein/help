import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Profile = ({}) => {

  return (
    <View style={styles.container}>
      <Text />
      <Text />

      <Text>USERNAME</Text>
      <Text />

      <MaterialCommunityIcons name="account-circle" color={"grey"} size={100} />
      <Text />

      <View style={{ flexDirection: "row" }}>
        <MaterialCommunityIcons name="star" color={"grey"} size={30} />
        <MaterialCommunityIcons name="star" color={"grey"} size={30} />
        <MaterialCommunityIcons name="star" color={"grey"} size={30} />
      </View>
      <Text />

      <Text>12 helps given</Text>
      <Text>2 helps received</Text>
      <Text />
      <Text>Male</Text>
      <Text>Madrid</Text>
      <Text>Age 32</Text>
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
