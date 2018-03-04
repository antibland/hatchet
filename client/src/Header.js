import React from 'react';
import { NavLink } from 'react-router-dom'
import { fakeAuth } from './Auth.js';

const Logo = () => (
  <h1><NavLink exact to='/'>Big Idea, Inc.</NavLink></h1>
);

const Header = () => (
  <header>
    <Logo />
    <nav role='main'>
      <ul>
        { fakeAuth.isAuthenticated === true
          ? <React.Fragment>
              <li><NavLink className="nav-link" exact to='/create'>Start a gripe</NavLink></li>
              <li><NavLink className="nav-link avatar" exact to='/profile'>
                <svg aria-hidden="true" class="message-sent">
                  <use xlinkHref="./symbols/svg-defs.svg#user-icon" />
                </svg>
                <span className="username">
                  {fakeAuth.user.username}
                </span>
              </NavLink>
              </li>
              <li><NavLink className="nav-link" exact to='/logout'>Logout</NavLink></li>
            </React.Fragment>
          : <React.Fragment>
              <li><NavLink className="nav-link" exact to='/join'>Join</NavLink></li>
              <li><NavLink className="nav-link" exact to='/login'>Login</NavLink></li>
            </React.Fragment>
        }
      </ul>
    </nav>
  </header>
)

export default Header;
