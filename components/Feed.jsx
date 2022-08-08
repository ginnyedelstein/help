import {
  View,
  Text,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import React, { useState, useCallback, useEffect } from "react";
// import DropDownPicker from "react-native-dropdown-picker";

import * as Color from "../styles/Color";
import { Colors } from "react-native/Libraries/NewAppScreen";

const Feed = ({ user }) => {
  const help = [1, 2, 3, 4];
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState([]);
  const [categoryItems, setCategoryItems] = useState([
    { label: "General", value: "general" },
    { label: "Athletics", value: "athletics" },
    { label: "Children", value: "children" },
    { label: "Clothing", value: "clothing" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Home", value: "home" },
    { label: "Kitchen", value: "kitchen" },
    { label: "Pet", value: "pet" },
    { label: "Technology", value: "technology" },
  ]);
  const [radiusOpen, setRadiusOpen] = useState(false);
  const [radiusValue, setRadiusValue] = useState([]);
  const [radiusItems, setRadiusItems] = useState([
    { label: "5km", value: "5" },
    { label: "15km", value: "15" },
    { label: "unlimited", value: "0" },
  ]);
  const [feed, setFeed] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://yl2dnogf69.execute-api.us-east-1.amazonaws.com/requests`,
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
        let result = [];
        let json_data = resJson.body;
        setFeed(json_data);
      } else {
        alert(res.status);
      }
    } catch (err) {
      alert(err);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      fetchData();
      setRefreshing(false);
    });
  }, []);

  // const currentUserId = "4c6cab21-29cf-4977-a3e8-2beb008c3441";

  const acceptById = async (requestId) => {
    alert(requestId);
    alert(user);
    try {
      const res = await fetch(
        `https://yl2dnogf69.execute-api.us-east-1.amazonaws.com/requests/${requestId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            acceptedUserId: user,
          }),
        }
      );
      const resJson = await res.json();
      if (res.status === 200) {
        const cleanedRes = JSON.stringify(resJson);
        // const stringified = JSON.stringify(Array(cleanedRes)[0]);
        alert(cleanedRes);
        return cleanedRes;
      } else {
        // setResult("empty");
        alert(res.status);
      }
    } catch (err) {
      // setResult("error");
      alert(err);
    }
  };

  const onCategoryOpen = useCallback(() => {
    setRadiusOpen(false);
  }, []);

  const onRadiusOpen = useCallback(() => {
    setCategoryOpen(false);
  }, []);

  // DropDownPicker.setMode("BADGE");

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      > */}
      <View contentContainerStyle={styles.filersContainer}>
        {/* <DropDownPicker
          multiple={true}
          open={categoryOpen}
          value={categoryValue}
          items={categoryItems}
          setOpen={setCategoryOpen}
          setValue={setCategoryValue}
          setItems={setCategoryItems}
          showBadgeDot={false}
          style={{
            backgroundColor: Color.GREEN3,
            borderColor: Color.GREEN3,
            width: Dimensions.get("window").width / 3,
          }}
          onChangeValue={(value) => {
            alert(value);
          }}
          onOpen={onCategoryOpen}
          placeholder="Filter by Category"
        />
        <DropDownPicker
          multiple={false}
          open={radiusOpen}
          value={radiusValue}
          items={radiusItems}
          setOpen={setRadiusOpen}
          setValue={setRadiusValue}
          setItems={setRadiusItems}
          showBadgeDot={false}
          style={{
            backgroundColor: Color.GREEN2,
            borderColor: Color.GREEN2,
            width: Dimensions.get("window").width / 3,
          }}
          onChangeValue={(value) => {
            alert(value);
          }}
          onOpen={onRadiusOpen}
          placeholder="Filter by Radius"
        /> */}
      </View>
      {/* {feed.map((feedItem, index) => (
        <Text data={feed}>
          {index} : {feedItem.userId} NEEDS{" "}
          {feedItem.description || "no description"} ACCEPTED BY{" "}
          {feedItem.acceptedUserId || "no one"}
        </Text>
      ))} */}
      <Text>CURRENT USER: {user}</Text>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={feed}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.request}>{item.request} </Text>
            <Text style={styles.description}>{item.description} </Text>

            {/* <Text>
              {index}: {item.userId}{" "}
              {item.give == "true" ? "IS GIVING HELP FOR" : "NEEDS"}{" "}
              {item.description || "no description"} ACCEPTED BY{" "}
              {item.acceptedUserId || "no one"}
            </Text> */}
            <View style={styles.buttons}>
              {item.completed === false ? (
                <TouchableOpacity
                  style={styles.chat}
                  title="accept"
                  onPress={() => acceptById(item.requestId)}
                >
                  <MaterialCommunityIcons
                    name="text-box-check-outline"
                    color={Color.GREEN4}
                    size={30}
                  />
                </TouchableOpacity>
              ) : (
                <></>
              )}
              <TouchableOpacity
                style={styles.chat}
                title="chat"
                onPress={() => console.log(item.requestId)}
              >
                <MaterialCommunityIcons
                  name="forum-outline"
                  color={Color.GREEN4}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {/* </ScrollView> */}

      {/* expanded: location, photos3Url, userId */}
    </SafeAreaView>
  );
};
export default Feed;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
  },
  scrollContainer: {},
  filersContainer: {
    flex: 1,
    // alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 60,
    marginTop: 40,
  },
  card: {
    display: "flex",
    margin: 10,
    backgroundColor: Color.GREEN2,
    justifyContent: "center",
    padding: 10,
    width: Dimensions.get("window").width - 20,
    borderRadius: 5,
  },
  request: {
    display: "flex",
    alignContent: "flex-start",
    fontWeight: "400",
  },
  description: {
    display: "flex",
    alignContent: "flex-start",
    fontWeight: "300",
  },
  chat: {
    margin: 5,
    height: 31,
  },
  buttons: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 2,
    width: Dimensions.get("window").width - 50,
    height: 31,
    borderRadius: 5,
  },
});
