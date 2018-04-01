import React from 'react';
import { NavLink } from 'react-router-dom';
import Avatar from './shared/components/Avatar';
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

const links = {
  profile: auth.hasValidToken() === true
    ? '/profile'
    : '/join',
  medals: auth.hasValidToken() === true
    ? '/medals'
    : '/join',
  startFight: auth.hasValidToken() === true
    ? '/create'
    : '/join',
  watching: auth.hasValidToken() === true
    ? '/watching'
    : '/join'
}

const BottomMenu = () => (
  <nav role="secondary" className="bottomMenuContainer">
    <ul className="bottomMenu">
      <li>
        <NavLink className="nav-link" exact to={links.profile}>
          <IconProfile />
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" exact to={links.medals}>
          <IconMedals />
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" exact to={links.startFight}>
          <IconStartFight />
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" exact to={links.watching}>
          <IconWatching />
        </NavLink>
      </li>

      {/* <li><NavLink className="nav-link" exact to='/create'>Start a Hatchet</NavLink></li>
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
      <li><NavLink className="nav-link" exact to='/logout'>Logout</NavLink></li> */}
    </ul>
  </nav>
);

export default BottomMenu;
