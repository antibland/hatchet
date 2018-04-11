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

const BottomMenuItem = props => (
  <li>
    <NavLink className="nav-link" exact to={props.to}>
      {props.children}
    </NavLink>
  </li>
);

const BottomMenu = () => (
  <nav className="bottomMenuContainer">
    {auth.hasValidToken()
      ? <ul className="bottomMenu">
          <BottomMenuItem to='/profile'><IconProfile /></BottomMenuItem>
          <BottomMenuItem to='/medals'><IconMedals /></BottomMenuItem>
          <li className="divider">
            <IconDivider />
          </li>
          <BottomMenuItem to='/create'><IconStartFight /></BottomMenuItem>
          <BottomMenuItem to='/watching'><IconWatching /></BottomMenuItem>
        </ul>
      : <ul className="bottomMenu loggedOut">
          <li>
            <NavLink className='nav-link signUp' exact to='/join'>
              Sign Up
            </NavLink>
          </li>
          <li>
            <NavLink className='nav-link logIn' exact to='/login'>
              Log In
            </NavLink>
          </li>
        </ul>
    }
  </nav>
);

export default BottomMenu;
