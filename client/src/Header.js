import React from 'react';
import { NavLink } from 'react-router-dom'
import { auth } from './Auth.js';
import Avatar from './shared/components/Avatar';

const Logo = () => (
  <h1><NavLink exact to='/'>Big Idea, Inc.</NavLink></h1>
);

const Header = (props) => (
  <header>
    <Logo />
    <nav role='main'>
      <ul>
        { props.isAuthenticated
          ? <React.Fragment>
              <li><NavLink className="nav-link" exact to='/create'>Start a Hatchet</NavLink></li>
              <li><NavLink className="nav-link avatar" exact to='/profile'>
                { auth.user.avatar !== null && auth.user.avatar !== ''
                  ? <Avatar
                      imgpath={auth.user.avatar}
                      width='40px'
                      height='40px'
                      styles={{ marginRight: '.4em' }} />
                  : <svg aria-hidden="true" className="user-icon">
                      <use xlinkHref="./symbols/svg-defs.svg#user-icon" />
                    </svg>
                }

                <span className="username">
                  {auth.user.username}
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
