import React, { Component } from 'react';
import { Link } from 'react-router-dom'

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/create'>Create a fight</Link></li>
      </ul>
    </nav>
  </header>
)

export default Header;
