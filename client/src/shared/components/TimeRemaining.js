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

const TimeHTML = props => {
  const { unit, fromFightPage, lbl, expiresSoon } = props;
  let timeClass = expiresSoon === true ? "expiresSoon" : "";
  if (fromFightPage === true) {
    return (
      <div
        className="fightTimeRemaining"
        dangerouslySetInnerHTML={{
          __html: `<time class=${timeClass}>${unit}</time><span>${lbl}</span>`
        }}
      />
    );
  } else {
    let html =
      lbl === "PENDING"
        ? `<span>${lbl}</span>`
        : unit !== "00:00"
          ? `<time class=${timeClass}>${unit}</time>`
          : `<span>${lbl}</span>`;
    return (
      <div
        className="fightTimeRemaining"
        dangerouslySetInnerHTML={{
          __html: html
        }}
      />
    );
  }
};

function formatTime(unit, isExpired, fromFightPage) {
  if (isExpired === true || unit === "00:00") {
    return (
      <TimeHTML unit="00:00" fromFightPage={fromFightPage} lbl="EXPIRED" />
    );
  }
  let u = unit;
  u = parseInt(utilities.stripNumbers(u), 10);

  if (unit === "1 day") {
    return (
      <TimeHTML
        unit="24:00"
        fromFightPage={fromFightPage}
        lbl="TIME REMAINING"
      />
    );
  } else if (isNaN(u)) {
    return (
      <TimeHTML unit="24:00" fromFightPage={fromFightPage} lbl="PENDING" />
    );
  } else if (u <= 200 && u > 0) {
    // 2 hours to go
    return (
      <TimeHTML
        expiresSoon={true}
        unit={unit}
        fromFightPage={fromFightPage}
        lbl="TIME REMAINING"
      />
    );
  } else {
    return (
      <TimeHTML
        unit={unit}
        fromFightPage={fromFightPage}
        lbl="TIME REMAINING"
      />
    );
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
