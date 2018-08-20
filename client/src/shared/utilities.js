import React from "react";
import moment from "moment";
import { css } from "styled-components";

const sizes = {
  desktop: 992,
  tablet: 768,
  phone: 576
};

const utilities = {
  media: Object.keys(sizes).reduce((acc, label) => {
    acc[label] = (...args) => css`
      @media (max-width: ${sizes[label] / 16}em) {
        ${css(...args)};
      }
    `;

    return acc;
  }, {}),
  truncate: (str, len = 75) =>
    str.length > len ? str.substr(0, len - 1) + "…" : str,
  getCategoryImage: word => {
    let prefix = "/svg/category-";
    let img = "";
    let w = word.replace("'", "").toLowerCase();

    switch (w) {
      case "lovers":
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}lovers-quarrel.svg`}
            alt="Lover's Quarrel"
          />
        );
        break;
      case "workplace":
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}workplace-squabble.svg`}
            alt="Workplace Squabble"
          />
        );
        break;
      case "friend":
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}friend-fight.svg`}
            alt="Friend Fight"
          />
        );
        break;
      case "roommate":
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}roommate-rumble.svg`}
            alt="Roommate Rumble"
          />
        );
        break;
      case "family":
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}family-feud.svg`}
            alt="Family Feud"
          />
        );
        break;
      default:
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}family-feud.svg`}
            alt="Family Feud"
          />
        );
        break;
    }
    return img;
  },
  validateEmail: email => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  },
  getTimeRemaining(activatedAt) {
    if (!activatedAt) {
      return "PENDING";
    }
    const startDate = new Date(activatedAt);
    const ms = moment(new Date(), "DD/MM/YYYY HH:mm:ss").diff(
      moment(startDate, "DD/MM/YYYY HH:mm:ss")
    );
    const d = moment.duration(ms);
    let minutes = 60 - (Math.floor(d.asMinutes()) % 60);
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    const hours = 23 - Math.floor(d.asHours());
    let time = `${hours}:${minutes}`;

    if (hours < 0) {
      return "00:00";
    }

    // TODO: Fix time return
    return time === "23:56" ? "1 day" : time;
  }
};

export default utilities;
