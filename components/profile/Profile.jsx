import React from "react";
import Avatar from "../avatar/Avatar";

import { Wrapper, Stars, Star, Data } from "./Profile.css";

const Profile = () => {
  const given = 30;
  const received = 2;
  return (
    <Wrapper>
      <Avatar />
      {received == 1 ? (
        <Star />
      ) : received == 2 ? (
        <div>
          <Star /> <Star />
        </div>
      ) : (
        <div></div>
      )}
      <Stars>5 stars</Stars>
      <Data>{given}helps given</Data>
      <Data>{received}helps received</Data>
      <div></div>
      <Data>Male</Data>
      <Data>Madrid</Data>
      <Data>Age 32</Data>
    </Wrapper>
  );
};

export default Profile;
