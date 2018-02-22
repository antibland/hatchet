import React from 'react';
import { NavLink } from 'react-router-dom'

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><NavLink exact to='/'>Home</NavLink></li>
        <li><NavLink exact to='/create'>Create a fight</NavLink></li>
        <li><NavLink exact to='/join'>Join</NavLink></li>
      </ul>
    </nav>
  </header>
)

export default Header;
