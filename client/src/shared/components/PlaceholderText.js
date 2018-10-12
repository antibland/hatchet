import React from "react";

const PlaceholderText = () => {
  const placeholderText =
    "Lorem, ipsum dolor sit amet consect adipisicing elit. Facilis fugiat in impedit maxime adipisicing elit";

  return (
    <>
      <p className="fightText blurred">{placeholderText}</p>
      <p className="fightText blurred">{placeholderText}</p>
      <p className="fightText blurred">{placeholderText}</p>
    </>
  );
};

export default PlaceholderText;
