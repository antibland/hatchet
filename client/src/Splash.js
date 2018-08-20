import React, { Component } from "react";
import Logo from "./Logo";
import IntroSlides from "./IntroSlides";
import styled from "styled-components";
import utilities from "./shared/utilities";
import "./css/Splash/Splash.css";
import "./css/Splash/Slides.css";

function closeSplash() {
  localStorage.setItem("showSplash", "hide");
  window.location = "/";
}

const SkipIt = styled.button`
  width: auto !important;
  position: absolute !important;
  font-size: 18px !important;
  top: 1em;
  right: 1em;

  ${utilities.media.tablet`font-size: 16px !important`};
  ${utilities.media.phone`font-size: 13px !important`};
`;

class Splash extends Component {
  render() {
    return (
      <div className="splash modal">
        <div className="logoContainer">
          <Logo direction="vertical" />
        </div>
        <IntroSlides />
        <SkipIt className="primary button" onClick={closeSplash} type="button">
          Skip
        </SkipIt>
      </div>
    );
  }
}

export default Splash;
