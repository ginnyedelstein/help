import styled, { css } from "styled-components";
import { View, Text } from "react-native";

export const Container = styled(View)`
  flex: 1;
  background-color: papayawhip;
  justify-content: center;
  align-items: center;
`;

export const Title = styled(Text)`
  font-size: 24px;
  font-weight: 500;
  color: ${(props) => props.color};
`;
