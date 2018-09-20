import React from "react";
import PropTypes from "prop-types";
import utilities from "../utilities";

const TimeRemaining = props => {
  return formatTime(utilities.getTimeRemaining(props.remaining));
};

function formatTime(unit) {
  let u = unit;
  u = parseInt(utilities.stripNumbers(u), 10);

  if (unit === "1 day") {
    return <div dangerouslySetInnerHTML={{ __html: `<time>24:00</time>` }} />;
  } else if (isNaN(u)) {
    return "PENDING";
  } else if (u === 0) {
    return "EXPIRED";
  } else if (u <= 200) {
    // 2 hours to go
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: `<time class='expiresSoon'>${unit}</time>`
        }}
      />
    );
  } else {
    return <div dangerouslySetInnerHTML={{ __html: `<time>${unit}</time>` }} />;
  }
}

TimeRemaining.propTypes = {
  remaining: PropTypes.string.isRequired
};

export default TimeRemaining;
