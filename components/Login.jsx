import {
  View,
  ScrollView,
  TouchableHighlight,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import Config from "../lib/Config";

import React, { useState, useContext } from "react";
import jwt_decode from "jwt-decode";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Color from "../styles/Color";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label("Email")
    .email("Enter a valid email")
    .required("Please enter a registered email"),
  password: Yup.string()
    .label("Password")
    .required()
    .min(8, "Password must have at least 8 characters ")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must include uppercase, lowercase, number and special characters"
    ),
  // firstName: Yup.string().label("First Name").required(),
  // lastName: Yup.string()
  //   .label("Last Name")
  //   .required()
  //   .min(2, "Last Name must have at least 2 characters "),
  // gender: Yup.string().label("Gender").required(),
  // address: Yup.string().label("Address").required(),
  // birthdate: Yup.string().label("Birthdate").required(),
});

const ErrorMessage = ({ errorValue }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{errorValue}</Text>
  </View>
);

export default function Login({ user, setUser, setIsNotSignedIn }) {
  // const { signIn } = useContext(AuthContext);
  const [loginActive, setLoginActive] = useState(true);

  const callLogin = async (email, password) => {
    try {
      const res = await fetch(`${Config.apiUrl}/sign-in`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const resJson = await res.json();
      if (res.status === 200) {
        const userToken = jwt_decode(resJson.idToken).sub;
        // const stringified = JSON.stringify(Array(userToken)[0]);
        setUser(userToken);
        setIsNotSignedIn(false);
        return userToken;
      } else {
        // setResult("empty");
        alert(res.status);
      }
    } catch (err) {
      // setResult("error");
      alert(err);
    }
  };

  const callSignup = async (
    email,
    firstName,
    lastName,
    gender,
    address,
    birthdate,
    password
  ) => {
    try {
      const res = await fetch(`${Config.apiUrl}/users`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          address: address,
          birthdate: birthdate,
          password: password,
        }),
      });
      const resJson = await res.json();
      if (res.status === 200) {
        const cleanedRes = JSON.stringify(resJson);
        // const stringified = JSON.stringify(Array(cleanedRes)[0]);
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

  function onLoginHandler(values) {
    const { email, password } = values;
    callLogin(email, password);
    // alert(`Credentials entered. email: ${email}, password: ${password}`);
  }

  function onSignupHandler(values) {
    const { email, firstName, lastName, gender, address, birthdate, password } =
      values;
    // alert(
    //   `Credentials entered. email: ${email}, password: ${password}, b ${birthdate}, a ${address} f ${firstName} l ${lastName}`
    // );

    callSignup(
      email,
      firstName,
      lastName,
      gender,
      address,
      birthdate,
      password
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.button2Wrapper}>
        <TouchableHighlight
          activeOpacity={1}
          onHideUnderlay={() => setLoginActive(true)}
          onShowUnderlay={() => setLoginActive(false)}
          underlayColor={Color.GREEN2}
          onPress={() => setLoginActive(false)}
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
          onHideUnderlay={() => setLoginActive(false)}
          onShowUnderlay={() => setLoginActive(true)}
          underlayColor={Color.GREEN2}
          onPress={() => setLoginActive(true)}
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
            email: "",
            password: "",
          }}
          onSubmit={(values, actions) => {
            onLoginHandler(values, actions);
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
                numberOfLines={1}
                value={values.email}
                placeholder="Enter email"
                onChangeText={handleChange("email")}
                autoCapitalize="none"
                autoCompleteType="email"
                keyboardType="email-address"
                onBlur={handleBlur("email")}
              />
              <ErrorMessage errorValue={touched.email && errors.email} />
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.password}
                placeholder="Enter password"
                onChangeText={handleChange("password")}
                autoCapitalize="none"
                onBlur={handleBlur("password")}
                secureTextEntry={true}
              />
              <ErrorMessage errorValue={touched.password && errors.password} />
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.buttonContainer}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{
            email: "",
            firstName: "",
            lastName: "",
            gender: "",
            address: "",
            birthdate: "",
            password: "",
          }}
          onSubmit={(values, actions) => {
            onSignupHandler(values, actions);
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
                numberOfLines={1}
                value={values.email}
                placeholder="Enter email"
                onChangeText={handleChange("email")}
                autoCapitalize="none"
                autoCompleteType="email"
                keyboardType="email-address"
                onBlur={handleBlur("email")}
              />
              <ErrorMessage errorValue={touched.email && errors.email} />
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.password}
                placeholder="Enter password"
                onChangeText={handleChange("password")}
                autoCapitalize="none"
                onBlur={handleBlur("password")}
                secureTextEntry={true}
              />
              <ErrorMessage errorValue={touched.password && errors.password} />
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.firstName}
                placeholder="Enter first name"
                onChangeText={handleChange("firstName")}
                autoCapitalize="none"
                onBlur={handleBlur("firstName")}
              />
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.lastName}
                placeholder="Enter last name"
                onChangeText={handleChange("lastName")}
                autoCapitalize="none"
                onBlur={handleBlur("lastName")}
              />
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.gender}
                placeholder="Enter gender"
                onChangeText={handleChange("gender")}
                autoCapitalize="none"
                onBlur={handleBlur("gender")}
              />
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.address}
                placeholder="Enter address"
                onChangeText={handleChange("address")}
                autoCapitalize="none"
                onBlur={handleBlur("address")}
              />
              <TextInput
                style={styles.input}
                numberOfLines={1}
                value={values.birthdate}
                placeholder="Enter birthday"
                onChangeText={handleChange("birthdate")}
                autoCapitalize="none"
                onBlur={handleBlur("birthdate")}
              />

              {/* <DatePicker
                style={styles.input}
                selected={values.birthdate}
                value={values.birthdate}
                dateFormat="MMMM d, yyyy"
                className="form-control"
                name="birthdate"
                onChange={(date) => setFieldValue("birthdate", date)}
              /> */}

              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.buttonContainer}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    marginVertical: 5,
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
});
