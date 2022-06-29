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
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";

import { Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .label("GetHelp")
    .required("Enter a valid request")
    .min(10, "Min length: 3 chars")
    .max(10, "Max length: 50 chars"),
  description: Yup.string()
    .label("GetHelp")
    .required("Enter a valid request")
    .min(10, "Min length: 10 chars")
    .min(10, "Max length: 350 chars"),
});

const ErrorMessage = ({ errorValue }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{errorValue}</Text>
  </View>
);

export default function Form({}) {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [selectedDistance, setSelectedDistance] = useState("5");
  const [getHelpActive, setGetHelpActive] = useState(true);

  function onSubmitHandler(values) {
    const { title, description, category, distance } = values;

    alert(
      `Help entered. Help ${
        getHelpActive ? "requested" : "offered"
      }: ${title}, ${description}, ${selectedCategory} , ${selectedDistance}`
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.button2Wrapper}>
          <TouchableHighlight
            activeOpacity={1}
            onHideUnderlay={() => setGetHelpActive(true)}
            onShowUnderlay={() => setGetHelpActive(false)}
            underlayColor={"#296f2f"}
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
            underlayColor={"#296f2f"}
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
            category: "general",
            distance: "5",
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
              <Picker
                selectedValue={selectedCategory}
                value={values.category}
                onBlur={handleBlur("category")}
                onValueChange={(value, index) => {
                  setSelectedCategory(value);
                  handleChange("category");
                }}
                mode="dropdown" // Android only
                style={styles.picker}
              >
                <Picker.Item label="General" value="general" />
                <Picker.Item label="Technology" value="technology" />
              </Picker>
              <Text>select help radius</Text>
              <Picker
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
              </Picker>
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
    backgroundColor: "#69a96e",
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
    backgroundColor: "#296f2f",
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
