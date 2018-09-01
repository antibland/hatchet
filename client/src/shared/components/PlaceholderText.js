import React from "react";

const PlaceholderText = () => {
  const placeholderText =
    "Lorem, ipsum dolor sit amet consect adipisicing elit. Facilis fugiat in impedit maxime adipisicing elit";

  return (
    <React.Fragment>
      <p className="fightText blurred">{placeholderText}</p>
      <p className="fightText blurred">{placeholderText}</p>
      <p className="fightText blurred">{placeholderText}</p>
    </React.Fragment>
  );
};

export default PlaceholderText;
