import React from "react";
import { NavLink } from "react-router-dom";
import NavList from "./NavList";
import commonData from "./shared/commonData";
import "./css/Header.css";

const HeaderActions = () => (
  <ul className="headerActions">
    <li>icon</li>
  </ul>
);

const Logo = () => (
  <h1 aria-labelledby="logoText">
    <NavLink exact to="/">
      <img
        className="logo"
        src="/logo.png"
        srcSet="/logo.png 1x, /logo@2x.png 2x, /logo@3x.png 3x"
        alt="Bury The Hatchet logo"
      />
    </NavLink>
    <span className="a11yText" id="logoText">
      Bury The Hatchet
    </span>
  </h1>
);

const Header = props => (
  <header>
    <div className="headerTop">
      <Logo />
      <HeaderActions />
    </div>
    <nav role="main">
      <NavList
        data={
          props.isAuthenticated
            ? commonData.mainTabs
            : commonData.restrictedTabs
        }
        {...props}
      />
    </nav>
  </header>
);

export default Header;
