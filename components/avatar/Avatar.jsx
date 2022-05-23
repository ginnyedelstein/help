import React, { FC } from "react";

import { Initials } from "./Avatar.css";

const Avatar = ({ fullName = "Juan Hidalgo" }) => {
  const initials = fullName
    .trim()
    .split(" ")
    .reduce(
      (acc, cur, idx, arr) =>
        acc +
        (arr.length > 1
          ? idx == 0 || idx == arr.length - 1
            ? cur.substring(0, 1)
            : ""
          : cur.substring(0, 2)),
      ""
    )
    .toUpperCase();

  return <Initials>{initials}</Initials>;
};

export default Avatar;
