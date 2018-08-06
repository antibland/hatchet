import { PropTypes } from "prop-types";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./css/BottomMenu.css";

class BottomMenu extends Component {
  closeSplash(e, history) {
    e.preventDefault();
    localStorage.setItem("showSplash", "hide");
    let href = e.target.href;
    history.push(href.substr(href.lastIndexOf("/")));
  }

  static propTypes = {
    history: PropTypes.object.isRequired
  };

  render() {
    const { history } = this.props;

    return (
      <nav className="bottomMenuContainer">
        <ul className="bottomMenu loggedOut">
          <li>
            <NavLink
              onClick={e => {
                this.closeSplash(e, history);
              }}
              className="nav-link signUp"
              exact
              to="/join"
            >
              Sign Up
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={e => {
                this.closeSplash(e, history);
              }}
              className="nav-link logIn"
              exact
              to="/login"
            >
              Log In
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}

export default BottomMenu;
