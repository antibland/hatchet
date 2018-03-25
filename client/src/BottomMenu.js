import React from 'react';
import { NavLink } from 'react-router-dom';
import Avatar from './shared/components/Avatar';
import { auth } from './Auth.js';
import './css/BottomMenu.css';

const BottomMenu = () => (
  <ul className="bottomMenu">
    <li><NavLink className="nav-link" exact to='/create'>Start a Hatchet</NavLink></li>
    <li><NavLink className="nav-link avatar" exact to='/profile'>
      { auth.user.avatar !== null &&
        auth.user.avatar !== '' &&
        typeof auth.user.avatar !== 'undefined'
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
  </ul>
);

export default BottomMenu;
