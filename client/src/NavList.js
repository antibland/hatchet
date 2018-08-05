import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class NavList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let navItems = this.props.data.map((el, index) => {
      return <NavItem key={index} content={el.name} url={el.url} />;
    });

    return <ul className="navList">{navItems}</ul>;
  }
}

const NavItem = props => (
  <li onClick={props.onActiveNavItem}>
    <NavLink
      exact
      activeClassName="navItemActive"
      to={props.url}
      className="navItem"
    >
      {props.content}
    </NavLink>
  </li>
);

export default NavList;
