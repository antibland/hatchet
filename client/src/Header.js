import React from "react";
import { NavLink, Link } from "react-router-dom";
import styled from "styled-components";
import NavList from "./NavList";
import commonData from "./shared/commonData";
import Symbol from "./shared/components/Symbol";
import Avatar from "./shared/components/Avatar";
import { auth } from "./Auth";
import utilities from "./shared/utilities";
import "./css/Header.css";

const iconObj = {
  loggedIn: {
    "search-icon": "/search",
    "challenger-hatchet-icon": "/create",
    "notification-icon": "/notifications"
  }
};

const MobileMenu = styled.button`
  width: 30px;
  height: 18px;
  color: white;
  margin-right: 1.5em !important;
  display: inline-block;
  display: none;

  ${utilities.media.tablet`
    display: block;
  `};

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;

const LoginButton = styled(Link)`
  color: black;
  margin: 0 0 0 15px !important;
`;

const LoggedOutButtons = () => (
  <div>
    <LoginButton className="primary button" to="/login">
      Log In
    </LoginButton>
    <LoginButton className="primary button" to="/join">
      Join
    </LoginButton>
  </div>
);

const HeaderIcons = () => {
  let obj = iconObj.loggedIn;

  return Object.keys(obj).map(key => {
    return (
      <li key={key}>
        <NavLink className={`link-${key}`} exact to={obj[key]}>
          <Symbol name={key} />
        </NavLink>
      </li>
    );
  });
};

const UserIcon = () => {
  const imgpath = !auth.user.avatar
    ? "/user.png"
    : `/svg/avatars/${auth.user.avatar}`;
  return (
    <li>
      <a href="/profile">
        <Avatar imgpath={imgpath} width="32px" height="32px" />
      </a>
    </li>
  );
};

const HeaderActions = props => {
  return props.isAuthenticated ? (
    <ul className="headerActions">
      <HeaderIcons />
      <UserIcon />
    </ul>
  ) : (
    <LoggedOutButtons />
  );
};

const Logo = () => (
  <h1 aria-labelledby="logoText">
    <NavLink exact to="/">
      <picture>
        <source srcSet="/svg/logo-mobile.svg" media="(max-width: 768px)" />
        <source srcSet="/logo.png 1x, /logo@2x.png 2x, /logo@3x.png 3x" />
        <img className="logo" srcSet="/logo.png" alt="Bury The Hatchet logo" />
      </picture>
    </NavLink>
    <span className="a11yText" id="logoText">
      Bury The Hatchet
    </span>
  </h1>
);

const handleClick = () => {
  document.body.classList.toggle("toggleMenuShow");
};

const MobileMenuContainer = () => (
  <MobileMenu
    onClick={handleClick}
    className="mobileToggle removeDefaultButtonStyles"
  >
    <Symbol name="hamburger" />
  </MobileMenu>
);

const Header = props => (
  <header>
    <div className="headerTop">
      <MobileMenuContainer />
      <Logo />
      <HeaderActions isAuthenticated={props.isAuthenticated} />
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
