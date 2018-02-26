import React from 'react';
import { NavLink } from 'react-router-dom'
import { fakeAuth } from './Auth.js';

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><NavLink exact to='/'>Home</NavLink></li>

        { fakeAuth.isAuthenticated === true
          ? <React.Fragment>
              <li><NavLink exact to='/create'>Start a gripe</NavLink></li>
              <li><NavLink exact to='/logout'>Logout</NavLink></li>
            </React.Fragment>
          : <React.Fragment>
              <li><NavLink exact to='/join'>Join</NavLink></li>
              <li><NavLink exact to='/login'>Login</NavLink></li>
            </React.Fragment>
        }
      </ul>
    </nav>
  </header>
)

export default Header;
