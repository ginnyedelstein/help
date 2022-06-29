import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import sample from "./sample.json";

const Feed = ({}) => {
  const help = [1, 2, 3, 4];
  return (
    <View style={styles.container}>
      {help.map((request) => (
        <Text>{request}</Text>
      ))}
    </View>
  );
};
export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
});
