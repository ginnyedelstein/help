import {
  View,
  Text,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';
import React, { useState, useCallback, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';

import * as Color from '../styles/Color';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { getDistance } from 'geolib';
import Config from '../lib/Config';

const Feed = ({ user }) => {
  const help = [1, 2, 3, 4];
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState([]);
  const [categoryItems, setCategoryItems] = useState([
    { label: 'General', value: 'general' },
    { label: 'Athletics', value: 'athletics' },
    { label: 'Children', value: 'children' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Home', value: 'home' },
    { label: 'Kitchen', value: 'kitchen' },
    { label: 'Pet', value: 'pet' },
    { label: 'Technology', value: 'technology' },
  ]);
  const [radiusOpen, setRadiusOpen] = useState(false);
  const [radiusValue, setRadiusValue] = useState([]);
  const [radiusItems, setRadiusItems] = useState([
    { label: '5km', value: '5' },
    { label: '15km', value: '15' },
    { label: 'unlimited', value: '0' },
  ]);
  const [feed, setFeed] = useState([]);
  const [feedDisplay, setFeedDisplay] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const navigation = useNavigation();

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${Config.apiUrl}/requests`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const resJson = await res.json();
      if (res.status === 200) {
        let result = [];
        let json_data = resJson.body;
        setFeed(json_data);
        setFeedDisplay(feed);
      } else {
        alert(resJson.message);
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
      const res = await fetch(`${Config.apiUrl}/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acceptedUserId: user,
        }),
      });
      const resJson = await res.json();
      if (res.status === 200) {
        const cleanedRes = JSON.stringify(resJson);
        // const stringified = JSON.stringify(Array(cleanedRes)[0]);
        alert(cleanedRes);
        return cleanedRes;
      } else {
        // setResult("empty");
        alert(resJson.message);
      }
    } catch (err) {
      // setResult("error");
      alert(err);
    }
  };

  const createConfirmationAlert = (requestId) =>
    Alert.alert(
      'Accept',
      'Please confirm that you would like to accept this request',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => acceptById(requestId) },
      ]
    );

  const onCategoryOpen = useCallback(() => {
    setRadiusOpen(false);
  }, []);

  const onRadiusOpen = useCallback(() => {
    setCategoryOpen(false);
  }, []);

  DropDownPicker.setMode('BADGE');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      > */}
      <View style={styles.filersContainer}>
        <DropDownPicker
          multiple={true}
          open={categoryOpen}
          value={categoryValue}
          items={categoryItems}
          setOpen={setCategoryOpen}
          setValue={setCategoryValue}
          setItems={setCategoryItems}
          showBadgeDot={false}
          style={{
            display: 'flex',
            flexDirection: 'row',
            margin: 5,
            backgroundColor: Color.GREEN3,
            borderColor: Color.GREEN3,
            width: Dimensions.get('window').width / 3,
            // zIndex: -1,
          }}
          onChangeValue={(value) => {
            console.log(categoryValue);
            // console.log(categoryValue);
            // for (const v of value) {
            //   console.log(v);
            // }
            if (categoryValue.length) {
              setFeedDisplay(
                feed.filter((item) => categoryValue.includes(item.category))
              );
            } else {
              setFeedDisplay(feed);
            }

            // console.log(feed.filter((i) => i.category === value));
          }}
          onOpen={onCategoryOpen}
          placeholder="Category"
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
            display: 'flex',
            flexDirection: 'row',
            margin: 5,
            backgroundColor: Color.GREEN3,
            borderColor: Color.GREEN3,
            width: Dimensions.get('window').width / 3,
          }}
          onChangeValue={(value) => {
            alert(value);
            console.log(radiusValue);
            const filteredFeed = feed;
            setFeedDisplay(
              feed.filter((item) => item.category === 'ELECTRONICS')
            );
          }}
          onOpen={onRadiusOpen}
          placeholder="Radius"
        />
      </View>
      {/* {feed.map((feedItem, index) => (
        <Text data={feed}>
          {index} : {feedItem.userId} NEEDS{" "}
          {feedItem.description || "no description"} ACCEPTED BY{" "}
          {feedItem.acceptedUserId || "no one"}
        </Text>
      ))} */}
      <Text>CURRENT USER: {user.userId}</Text>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={feedDisplay}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.request}>{item.request} </Text>
              <Text style={styles.distance}>
                {getDistance(
                  {
                    latitude: location.coords ? location.coords.latitude : 0,
                    longitude: location.coords ? location.coords.longitude : 0,
                  },
                  {
                    latitude: item.location
                      ? parseInt(item.location.split(', ')[0])
                      : 0,
                    longitude: item.location
                      ? parseInt(item.location.split(', ')[1])
                      : 0,
                  },
                  100
                ) / 1000}
                km
              </Text>
            </View>
            <Text style={styles.description}>{item.description} </Text>
            <View style={styles.imgContainer}>
              {index === 1 ? (
                <Image
                  style={styles.img}
                  source={{
                    uri: 'data:image/jpeg;base64,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',
                  }}
                />
              ) : (
                <></>
              )}
            </View>

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
                  onPress={() => createConfirmationAlert(item.requestId)}
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
                onPress={() =>
                  navigation.navigate('Chat', {
                    requestUserId: item.userId,
                    currentUserId: user.userId,
                  })
                }
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
    display: 'flex',
    alignItems: 'flex-end',
  },
  scrollContainer: {},
  filersContainer: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 90,
    zIndex: 2000,
  },
  card: {
    margin: 10,
    backgroundColor: Color.GREEN2,
    padding: 10,
    width: Dimensions.get('window').width - 20,
    borderRadius: 5,
  },
  request: {
    alignContent: 'flex-start',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distance: {
    alignContent: 'flex-end',
    fontWeight: '400',
  },
  description: {
    alignContent: 'flex-start',
    fontWeight: '300',
    marginTop: 5,
  },
  imgContainer: {
    alignItems: 'center',
  },
  img: {
    alignContent: 'flex-end',
    marginTop: 5,
    width: 70,
    height: 70,
  },
  chat: {
    margin: 5,
    height: 31,
  },
  buttons: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 2,
    width: Dimensions.get('window').width - 50,
    height: 31,
    borderRadius: 5,
  },
});
