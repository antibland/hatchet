import React from 'react';
import { NavLink } from 'react-router-dom';
import { auth } from './Auth.js';
import './css/BottomMenu.css';

const IconProfile = () => (
  <React.Fragment>
    <img
      className='icon'
      aria-hidden='true'
      src='/icons/icon-profile.png'
      srcSet='/icons/icon-profile.png 1x, /icons/icon-profile@2x.png 2x'
      alt='Profile icon' />
    <span>Profile</span>
  </React.Fragment>
);

const IconMedals = () => (
  <React.Fragment>
    <img
      className='icon'
      aria-hidden='true'
      src='/icons/icon-medals.png'
      srcSet='/icons/icon-medals.png 1x, /icons/icon-medals@2x.png 2x'
      alt='Medals icon' />
    <span>Medals</span>
  </React.Fragment>
);

const IconStartFight = () => (
  <React.Fragment>
    <img
      className='icon'
      aria-hidden='true'
      src='/icons/icon-start-fight.png'
      srcSet='/icons/icon-start-fight.png 1x, /icons/icon-start-fight@2x.png 2x'
      alt='Start fight icon' />
    <span>Start Fight</span>
  </React.Fragment>
);

const IconWatching = () => (
  <React.Fragment>
    <img
      className='icon'
      aria-hidden='true'
      src='/icons/icon-watching.png'
      srcSet='/icons/icon-watching.png 1x, /icons/icon-watching@2x.png 2x'
      alt='Watched fights icon' />
    <span>Watching</span>
  </React.Fragment>
);

const IconDivider = () => (
  <img
    className='iconDivider'
    aria-hidden='true'
    src='/icons/icon-watching.png'
    srcSet='/icons/icon-divider.png 1x, /icons/icon-divider@2x.png 2x'
    alt='Icon divider' />
);

const BottomMenu = () => (
  <nav className="bottomMenuContainer">
    <ul className="bottomMenu">
      <li>
        <NavLink className="nav-link" exact to={auth.hasValidToken() ? '/profile' : 'join'}>
          <IconProfile />
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" exact to={auth.hasValidToken() ? '/medals' : 'join'}>
          <IconMedals />
        </NavLink>
      </li>
      <li className="divider">
        <IconDivider />
      </li>
      <li>
        <NavLink className="nav-link" exact to={auth.hasValidToken() ? '/create' : 'join'}>
          <IconStartFight />
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" exact to={auth.hasValidToken() ? '/watching' : 'join'}>
          <IconWatching />
        </NavLink>
      </li>
    </ul>
  </nav>
);

export default BottomMenu;
