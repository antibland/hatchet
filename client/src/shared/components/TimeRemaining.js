import React from "react";
import PropTypes from "prop-types";
import utilities from "../utilities";

const TimeRemaining = props => {
  return formatTime(
    utilities.getTimeRemaining(props.activatedAt),
    props.isExpired,
    props.fromFightPage
  );
};

function TimeWrapper(props) {
  let outerClass =
    props.fromFightPage && props.fromFightPage === true
      ? "fightTimeRemaining"
      : "";

  let timeClass = props.classes ? props.classes : "";

  return (
    <div
      className={outerClass}
      dangerouslySetInnerHTML={{
        __html: `<time class='${timeClass}'>${props.children}</time>`
      }}
    />
  );
}

function formatTime(unit, isExpired, fromFightPage) {
  if (isExpired === true || unit === "00:00") {
    if (fromFightPage === true) {
      return (
        <div
          className="fightTimeRemaining"
          dangerouslySetInnerHTML={{
            __html: `<time>00:00</time><span>EXPIRED!</span>`
          }}
        />
      );
    }
    return "EXPIRED";
  }
  let u = unit;
  u = parseInt(utilities.stripNumbers(u), 10);

  if (unit === "1 day") {
    return <TimeWrapper>24:00</TimeWrapper>;
  } else if (isNaN(u)) {
    return "PENDING";
  } else if (u <= 200 && u > 0) {
    // 2 hours to go
    return <TimeWrapper classes="expiresSoon">{unit}</TimeWrapper>;
  } else {
    return <TimeWrapper fromFightPage={fromFightPage}>{unit}</TimeWrapper>;
  }
}

TimeRemaining.propTypes = {
  activatedAt: PropTypes.string,
  isExpired: PropTypes.bool,
  fromFightPage: PropTypes.bool
};

TimeRemaining.defaultProps = {
  fromFightPage: false
};

export default TimeRemaining;
