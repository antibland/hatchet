import React from "react";
import moment from "moment";

const utilities = {
  truncate: (str, len = 75) =>
    str.length > len ? str.substr(0, len - 1) + "…" : str,
  getCategoryImage: word => {
    let prefix = "/categories/category-";
    let img = "";
    let w = word.replace("'", "").toLowerCase();

    switch (w) {
      case "lovers":
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}lover.png`}
            srcSet={`${prefix}lover.png 1x, ${prefix}lover@2x.png 2x`}
            alt="Lover's Quarrel"
          />
        );
        break;
      case "workplace":
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}coworker.png`}
            srcSet={`${prefix}coworker.png 1x, ${prefix}coworker@2x.png 2x`}
            alt="Workplace Squabble"
          />
        );
        break;
      case "friend":
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}friend.png`}
            srcSet={`${prefix}friend.png 1x, ${prefix}friend@2x.png 2x`}
            alt="Friend Fight"
          />
        );
        break;
      case "roommate":
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}roommate.png`}
            srcSet={`${prefix}roommate.png 1x, ${prefix}roommate@2x.png 2x`}
            alt="Roommate Rumble"
          />
        );
        break;
      case "family":
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}family.png`}
            srcSet={`${prefix}family.png 1x, ${prefix}family@2x.png 2x`}
            alt="Family Feud"
          />
        );
        break;
      case "world":
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}everyone.png`}
            alt="World War"
          />
        );
        break;
      default:
        img = (
          <img
            className="categoriesImg"
            src={`${prefix}everyone.png`}
            alt="World War"
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

    if (hours) {
      return time === "23:56" ? "1 day" : time;
    }

    return "00:00";
  }
};

export default utilities;
