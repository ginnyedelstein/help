import styled from "styled-components/native";
import { View, Text } from "react-native";
import { Title, Container } from "./App.css";
import Menu from "./components/menu/Menu";
import Avatar from "./components/avatar/Avatar";
import Profile from "./components/profile/Profile";

export default function App() {
  return (
    <Container>
      {/* <Title color="palevioletred">Expo with 💅 Styled Components</Title>
      <Title color="chocolate">iOS • Android • web</Title>
      <Menu></Menu>
      <Avatar></Avatar> */}
      <Profile></Profile>
    </Container>
  );
}
