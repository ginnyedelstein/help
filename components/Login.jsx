import {
  View,
  ScrollView,
  TouchableHighlight,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";

import React, { useState, useContext } from "react";
import jwt_decode from "jwt-decode";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Color from "../styles/Color";
import Config from "../lib/Config";
import DateTimePicker from "@react-native-community/datetimepicker";

const validationSchemaLogin = Yup.object().shape({
  emailLogin: Yup.string()
    .label("Email")
    .email("Please enter a valid email address")
    .required("Email address is a required field"),
  passwordLogin: Yup.string()
    .label("Password")
    .required("Password is a required field"),
});

const validationSchemaRegister = Yup.object().shape({
  emailRegister: Yup.string()
    .label("Email")
    .email("Please enter a valid email address")
    .required("Email address is a required field"),
  passwordRegister: Yup.string()
    .label("Password")
    .required("Password is a required field")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must have at least 8 characters and must include uppercase, lowercase, number and special character."
    ),
  firstName: Yup.string()
    .label("First Name")
    .required("First Name is a required field"),
  lastName: Yup.string()
    .label("Last Name")
    .required("Last Name is a required field"),
  gender: Yup.string().label("Gender").required("Gender is a required field"),
  address: Yup.string()
    .label("Address")
    .required("Address is a required field"),
  //birthdate: Yup.string().label("Birthdate").required(),
});

const ErrorMessage = ({ errorValue }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{errorValue}</Text>
  </View>
);

export default function Login({ setUser, setIsNotSignedIn }) {
  // const { signIn } = useContext(AuthContext);
  const [loginActive, setLoginActive] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dob, setDob] = useState(new Date());
  const [hasDobEntered, setHasDobEntered] = useState(false);
  const [dobError, setDobError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const callLogin = async (emailLogin, passwordLogin) => {
    setIsLoading(true);

    try {
      const res = await fetch(`${Config.apiUrl}/sign-in`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailLogin,
          password: passwordLogin,
        }),
      });
      const resJson = await res.json();

      if (res.status === 200) {
        const userToken = jwt_decode(resJson.idToken).sub;
        setUser(userToken);
        setIsNotSignedIn(false);
        setIsLoading(false);
        return userToken;
      } else {
        Alert.alert("Error", resJson.error);
        setIsLoading(false);
      }
    } catch (err) {
      Alert.alert("Error", err);
      setIsLoading(false);
    }
  };

  const callSignup = async (
    emailRegister,
    firstName,
    lastName,
    gender,
    address,
    birthdate,
    passwordRegister,
    actions
  ) => {
    try {
      setIsLoading(true);

      const res = await fetch(`${Config.apiUrl}/users`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailRegister,
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          address: address,
          birthdate: dob.toISOString().slice(0, 10),
          password: passwordRegister,
        }),
      });
      const resJson = await res.json();

      if (res.status === 200) {
        const cleanedRes = JSON.stringify(resJson);
        actions.resetForm();
        setHasDobEntered(false);
        callLogin(emailRegister, passwordRegister);
      } else {
        Alert.alert("Error", resJson.error);
        setIsLoading(false);
      }
    } catch (err) {
      Alert.alert("Error", err);
      setIsLoading(false);
    }
  };

  function onLoginHandler(values) {
    const { emailLogin, passwordLogin } = values;

    callLogin(emailLogin, passwordLogin);
  }

  function onSignupHandler(values, actions) {
    const {
      emailRegister,
      firstName,
      lastName,
      gender,
      address,
      birthdate,
      passwordRegister,
    } = values;

    if (!hasDobEntered) return;

    callSignup(
      emailRegister,
      firstName,
      lastName,
      gender,
      address,
      birthdate,
      passwordRegister,
      actions
    );
  }

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS == "android") setShowDatePicker(false);
    const currentDate = selectedDate;
    setHasDobEntered(true);
    setDob(currentDate);
    setDobError(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.button2Wrapper}>
        <TouchableHighlight
          activeOpacity={1}
          underlayColor={Color.GREEN2}
          onPress={() => {
            setLoginActive(true);
            setDobError(false);
          }}
          style={
            loginActive
              ? styles.button2ContainerActive
              : styles.button2Container
          }
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
        <TouchableHighlight
          activeOpacity={1}
          underlayColor={Color.GREEN2}
          onPress={() => {
            setLoginActive(false);
            setDobError(false);
          }}
          style={
            loginActive
              ? styles.button2Container
              : styles.button2ContainerActive
          }
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableHighlight>
      </View>
      {loginActive ? (
        <Formik
          initialValues={{
            emailLogin: "",
            passwordLogin: "",
          }}
          onSubmit={(values, actions) => {
            onLoginHandler(values, actions);
          }}
          key="login"
          validationSchema={validationSchemaLogin}
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
                numberOfLines={1}
                value={values.emailLogin}
                placeholder="Enter email"
                onChangeText={handleChange("emailLogin")}
                autoCapitalize="none"
                autoCompleteType="email"
                keyboardType="email-address"
                onBlur={handleBlur("emailLogin")}
              />
              {touched.emailLogin && errors.emailLogin && (
                <ErrorMessage
                  errorValue={touched.emailLogin && errors.emailLogin}
                />
              )}
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.passwordLogin}
                placeholder="Enter password"
                onChangeText={handleChange("passwordLogin")}
                autoCapitalize="none"
                onBlur={handleBlur("passwordLogin")}
                secureTextEntry={true}
              />
              {touched.passwordLogin && errors.passwordLogin && (
                <ErrorMessage
                  errorValue={touched.passwordLogin && errors.passwordLogin}
                />
              )}
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.buttonContainer}
              >
                <Text style={styles.buttonText}>Login</Text>
                {isLoading && (
                  <ActivityIndicator
                    style={{
                      marginLeft: 20,
                    }}
                  />
                )}
              </TouchableOpacity>
            </>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{
            emailRegister: "",
            passwordRegister: "",
            firstName: "",
            lastName: "",
            gender: "",
            address: "",
            birthdate: new Date(),
          }}
          key="signup"
          onSubmit={(values, actions) => {
            onSignupHandler(values, actions);
          }}
          validationSchema={validationSchemaRegister}
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
                numberOfLines={1}
                value={values.emailRegister}
                placeholder="Enter email"
                onChangeText={handleChange("emailRegister")}
                autoCapitalize="none"
                autoCompleteType="email"
                keyboardType="email-address"
                onBlur={handleBlur("emailRegister")}
              />
              {touched.emailRegister && errors.emailRegister && (
                <ErrorMessage
                  errorValue={touched.emailRegister && errors.emailRegister}
                />
              )}
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.passwordRegister}
                placeholder="Enter password"
                onChangeText={handleChange("passwordRegister")}
                autoCapitalize="none"
                onBlur={handleBlur("passwordRegister")}
                secureTextEntry={true}
              />
              {touched.passwordRegister && errors.passwordRegister && (
                <ErrorMessage
                  errorValue={
                    touched.passwordRegister && errors.passwordRegister
                  }
                />
              )}
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.firstName}
                placeholder="Enter first name"
                onChangeText={handleChange("firstName")}
                autoCapitalize="none"
                onBlur={handleBlur("firstName")}
              />
              {touched.firstName && errors.firstName && (
                <ErrorMessage
                  errorValue={touched.firstName && errors.firstName}
                />
              )}
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.lastName}
                placeholder="Enter last name"
                onChangeText={handleChange("lastName")}
                autoCapitalize="none"
                onBlur={handleBlur("lastName")}
              />
              {touched.lastName && errors.lastName && (
                <ErrorMessage
                  errorValue={touched.lastName && errors.lastName}
                />
              )}
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.gender}
                placeholder="Enter gender"
                onChangeText={handleChange("gender")}
                autoCapitalize="none"
                onBlur={handleBlur("gender")}
              />
              {touched.gender && errors.gender && (
                <ErrorMessage errorValue={touched.gender && errors.gender} />
              )}
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.address}
                placeholder="Enter address"
                onChangeText={handleChange("address")}
                autoCapitalize="none"
                onBlur={handleBlur("address")}
              />
              {touched.address && errors.address && (
                <ErrorMessage errorValue={touched.address && errors.address} />
              )}
              <TouchableOpacity
                onPress={() => setShowDatePicker(!showDatePicker)}
              >
                <TextInput
                  style={styles.input}
                  editable={false}
                  numberOfLines={1}
                  value={hasDobEntered ? dob.toDateString() : null}
                  placeholder="Select birthday"
                  autoCapitalize="none"
                  onBlur={handleBlur("birthdate")}
                  onPressIn={() => setShowDatePicker(!showDatePicker)}
                />
                {dobError && (
                  <ErrorMessage
                    errorValue={"Date of birth is a required field"}
                  />
                )}
                {showDatePicker && (
                  <View>
                    <DateTimePicker
                      testID="datePicker"
                      value={dob}
                      display={Platform.OS == "ios" ? "spinner" : "default"}
                      mode={"date"}
                      onChange={onDateChange}
                      maximumDate={new Date(2022, 0, 1)}
                      minimumDate={new Date(1930, 0, 1)}
                    />

                    {Platform.OS == "ios" && (
                      <TouchableOpacity
                        onPress={() => {
                          setShowDatePicker(false);
                        }}
                        style={{
                          alignSelf: "center",
                          width: 80,
                          height: 30,
                          borderRadius: 10,
                          backgroundColor: "#e2e2e2",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text>Done</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </TouchableOpacity>

              {!showDatePicker && (
                <TouchableOpacity
                  onPress={() => {
                    if (!hasDobEntered) setDobError(true);
                    handleSubmit();
                  }}
                  style={styles.buttonContainer}
                >
                  <Text style={styles.buttonText}>Sign Up</Text>
                  {isLoading && (
                    <ActivityIndicator
                      style={{
                        marginLeft: 20,
                      }}
                    />
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </Formik>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    marginVertical: 5,
    width: "75%",
  },
  errorText: {
    color: "red",
  },
  container: {
    //flex: 1,
    alignItems: "center",
    marginTop: 50,
    paddingBottom: 100,
  },
  input: {
    marginVertical: 10,
    width: Dimensions.get("window").width - 100,
    color: "#000",
    height: 40,
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
    flexDirection: "row",
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
});
