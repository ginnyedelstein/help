import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView
} from "react-native";


import * as Color from "../styles/Color";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import React, { useState, useEffect } from "react";

import Config from "../lib/Config";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { authContext } from "./AuthContext";


const ChatList = () => {
  const {user} = useContext(authContext);
  const [refresh, setRefresh] = useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const [chats, setChats] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const navigation = useNavigation();

  console.log(chats)

  const fetchChats = async () => {
    try {
      const res = await fetch(`${Config.apiUrl}/chats/${user}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      let resJson = await res.json();
      let messages = resJson?.body

      await Promise.all(messages.map(async (element,index) => {
        let value =  await fetchUser(element.userId1)
        messages[index]["name"] = value
      }));

      setChats(messages);
      setRefresh((val)=>setRefresh(!val))
    } catch (err) {
      alert(err);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      fetchChats();
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    fetchChats();
  }, []);


  const fetchUser = async (id) => {
    try {
      const res = await fetch(`${Config.apiUrl}/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resJson = await res.json();
      if (res.status === 200) {
        let name = resJson?.body?.firstName +" "+ resJson?.body?.lastName
        return(name)
      } 
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList

        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={chats.map((chat) => {
          return { ...chat, key: chat.id };
        })}
        renderItem={({ item, index }) => {
          console.log(item)
          return (
            <View style={styles.card} key={index}>
              <Text style={styles.request}>{`Chat ${index + 1}`} </Text>
              <Text style={styles.request}>{item.name}</Text>
              <Text style={styles.message}>
                {typeof item.messages === "string" && item.messages.length > 4
                  ? JSON.parse(item.messages)[0].text
                  : ""}{" "}
              </Text>

              <TouchableOpacity
                style={styles.chat}
                title="chat"
                onPress={() =>
                  navigation.navigate("Chat", {
                    requestUserId:
                      item.userId1 === user ? item.userId2 : item.userId1,
                    currentUserId: user,
                  })
                }
              >
                <View style={styles.buttons}>
                  <MaterialCommunityIcons
                    name="forum-outline"
                    color={Color.GREEN4}
                    size={30}
                  />
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};
export default ChatList;

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
  message: {
    display: "flex",
    margin: 5,
    marginBottom: 0,
    backgroundColor: Color.GREEN2,
    justifyContent: "center",
    color: "grey",
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
  buttonsBack: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 2,
    width: Dimensions.get("window").width - 50,
    height: 31,
    borderRadius: 5,
  },
});
