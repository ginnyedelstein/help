import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";
import * as Location from "expo-location";

import { Formik } from "formik";
import * as Yup from "yup";
import * as Color from "../styles/Color";
import Config from "../lib/Config";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .label("GetHelp")
    .required("Enter a valid request")
    .min(3, "Min length: 3 chars")
    .max(50, "Max length: 50 chars"),
  description: Yup.string()
    .label("GetHelp")
    .required("Enter a valid request")
    .min(10, "Min length: 10 chars")
    .max(350, "Max length: 350 chars"),
});

const ErrorMessage = ({ errorValue }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{errorValue}</Text>
  </View>
);

export default function Form({ user }) {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [selectedDistance, setSelectedDistance] = useState("5");
  const [getHelpActive, setGetHelpActive] = useState(true);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // function onSubmitHandler(values) {
  //   const { title, description, category, distance } = values;

  //   alert(
  //     `Help entered. Help ${
  //       getHelpActive ? "requested" : "offered"
  //     }: ${title}, ${description}, ${selectedCategory} , ${selectedDistance}`
  //   );
  // }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const onSubmitHandler = async ({
    title,
    description,
    category,
    distance,
  }) => {
    try {
      const res = await fetch(`${Config.apiUrl}/requests`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user,
          request: title,
          description: description,
          give: getHelpActive,
          category: category,
          location: `${location.coords.latitude}, ${location.coords.longitude}`,
          photoS3Url: "",
        }),
        // body: JSON.stringify({
        //   email: email1,
        //   password: password1,
        // }),
      });
      const resJson = await res.json();
      if (res.status === 200) {
        const cleanedRes = JSON.stringify(resJson);
        // const stringified = JSON.stringify(Array(cleanedRes)[0]);
        alert(cleanedRes);
        return cleanedRes;
      } else {
        // setResult("empty");
        alert(res.message);
      }
    } catch (err) {
      // setResult("error");
      alert(err);
    }
  };

  console.log(text);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.button2Wrapper}>
          <TouchableHighlight
            activeOpacity={1}
            onHideUnderlay={() => setGetHelpActive(true)}
            onShowUnderlay={() => setGetHelpActive(false)}
            underlayColor={Color.GREEN2}
            onPress={() => setGetHelpActive(false)}
            style={
              getHelpActive
                ? styles.button2ContainerActive
                : styles.button2Container
            }
          >
            <Text style={styles.buttonText}>Get Help</Text>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={1}
            onHideUnderlay={() => setGetHelpActive(false)}
            onShowUnderlay={() => setGetHelpActive(true)}
            underlayColor={Color.GREEN2}
            onPress={() => setGetHelpActive(true)}
            style={
              getHelpActive
                ? styles.button2Container
                : styles.button2ContainerActive
            }
          >
            <Text style={styles.buttonText}>Give Help</Text>
          </TouchableHighlight>
        </View>
        {getHelpActive ? <Text>get help</Text> : <Text>give help</Text>}
        <Formik
          initialValues={{
            title: "",
            description: "",
            category: selectedCategory,
            distance: selectedDistance,
          }}
          onSubmit={(values, actions) => {
            onSubmitHandler(values, actions);
          }}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            values,
            errors,
            touched,
            handleSubmit,
            handleBlur,
          }) => (
            <>
              <TextInput
                style={styles.input}
                numberOfLines={2}
                value={values.title}
                placeholder="Enter post title"
                onChangeText={handleChange("title")}
                autoCapitalize="none"
                onBlur={handleBlur("title")}
              />
              <ErrorMessage errorValue={touched.title && errors.title} />
              <TextInput
                style={styles.largeInput}
                multiline={true}
                numberOfLines={1}
                value={values.description}
                placeholder="Enter description"
                onChangeText={handleChange("description")}
                autoCapitalize="none"
                onBlur={handleBlur("description")}
              />
              <ErrorMessage
                errorValue={touched.description && errors.description}
              />
              <Text>select category</Text>
              {/* <Picker
                selectedValue={selectedCategory}
                value={values.category}
                onBlur={handleBlur("category")}
                onValueChange={(value, index) => {
                  setSelectedCategory(value);
                  console.log(value);
                  handleChange("category");
                }}
                mode="dropdown" // Android only
                style={styles.picker}
              >
                <Picker.Item label="General" value="general" />
                <Picker.Item label="Athletics" value="athletics" />
                <Picker.Item label="Children" value="children" />
                <Picker.Item label="Clothing" value="clothing" />
                <Picker.Item label="Entertainment" value="entertainment" />
                <Picker.Item label="Home" value="home" />
                <Picker.Item label="Kitchen" value="kitchen" />
                <Picker.Item label="Pet" value="pet" />
                <Picker.Item label="Technology" value="technology" />
              </Picker> */}
              <RNPickerSelect
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  console.log(selectedCategory);
                }}
                selectedValue={values.category}
                items={[
                  { label: "General", value: "general" },
                  { label: "Athletics", value: "athletics" },
                  { label: "Children", value: "children" },
                ]}
              />
              {/* <Text>select help radius</Text> */}
              {/* <Picker
                value={values.distance}
                selectedValue={selectedDistance}
                onBlur={handleBlur("distance")}
                onValueChange={(value, index) => {
                  setSelectedDistance(value);
                  handleChange("distance");
                }}
                mode="dropdown" // Android only
                style={styles.picker}
              >
                <Picker.Item label="5km" value="15" />
                <Picker.Item label="50km" value="50" />
                <Picker.Item label="unlimited" value="ulimited" />
              </Picker> */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.buttonContainer}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    marginVertical: 3,
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
  largeInput: {
    marginVertical: 10,
    width: Dimensions.get("window").width - 100,
    height: 80,
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
  button2Container: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: Dimensions.get("window").width / 3,
    height: 44,
    borderRadius: 5,
    backgroundColor: Color.GREEN3,
    flexDirection: "row",
  },
  button2ContainerActive: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: Dimensions.get("window").width / 3,
    height: 44,
    borderRadius: 5,
    backgroundColor: Color.GREEN4,
    flexDirection: "row",
  },
  button2Wrapper: {
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: Dimensions.get("window").width / 3,
    height: 44,
    borderRadius: 5,
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
  },
  picker: {
    marginVertical: 5,
    width: Dimensions.get("window").width - 100,
    padding: 0,
    borderWidth: 1,
    borderRadius: 5,
  },
});
