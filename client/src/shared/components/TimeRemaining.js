import React from "react";
import PropTypes from "prop-types";
import utilities from "../utilities";

const TimeRemaining = props => {
  return formatTime(
    utilities.getTimeRemaining(props.activatedAt),
    props.isExpired
  );
};

function TimeWrapper(props) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<time class='${props.classes}'>${props.children}</time>`
      }}
    />
  );
}

function formatTime(unit, isExpired) {
  if (isExpired === true) {
    return "EXPIRED";
  }
  let u = unit;
  u = parseInt(utilities.stripNumbers(u), 10);

  if (unit === "1 day") {
    return <TimeWrapper>24:00</TimeWrapper>;
  } else if (isNaN(u)) {
    return "PENDING";
  } else if (u <= 200) {
    // 2 hours to go
    return <TimeWrapper classes="expiresSoon">{unit}</TimeWrapper>;
  } else {
    return <TimeWrapper>{unit}</TimeWrapper>;
  }
}

TimeRemaining.propTypes = {
  activatedAt: PropTypes.string,
  isExpired: PropTypes.bool
};

export default TimeRemaining;
