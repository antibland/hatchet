import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { auth } from './Auth.js';
import { PropTypes } from 'prop-types';
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
  <li className="divider">
    <img
      className='iconDivider'
      aria-hidden='true'
      src='/icons/icon-watching.png'
      srcSet='/icons/icon-divider.png 1x, /icons/icon-divider@2x.png 2x'
      alt='Icon divider' />
  </li>
);

const BottomMenuItem = props => (
  <li>
    <NavLink className="nav-link" exact to={props.to}>
      {props.children}
    </NavLink>
  </li>
);

class BottomMenu extends Component {

  closeSplash(e, history) {
    e.preventDefault();
    localStorage.setItem('showSplash', 'hide');
    let href = e.target.href;
    history.push(
      href.substr(href.lastIndexOf('/'))
    );
  }

  static propTypes = {
    history: PropTypes.object.isRequired
  }

  render() {
    const { history } = this.props;

    return (
      <nav className="bottomMenuContainer">
      {auth.hasValidToken()
        ? <ul className="bottomMenu">
            <BottomMenuItem to='/profile'><IconProfile /></BottomMenuItem>
            <BottomMenuItem to='/medals'><IconMedals /></BottomMenuItem>
            <IconDivider />
            <BottomMenuItem to='/create'><IconStartFight /></BottomMenuItem>
            <BottomMenuItem to='/watching'><IconWatching /></BottomMenuItem>
          </ul>
        : <ul className="bottomMenu loggedOut">
            <li>
              <NavLink onClick={(e) => {
                this.closeSplash(e, history)
              }} className='nav-link signUp' exact to='/join'>
                Sign Up
              </NavLink>
            </li>
            <li>
              <NavLink onClick={(e) => {
                this.closeSplash(e, history)
              }} className='nav-link logIn' exact to='/login'>
                Log In
              </NavLink>
            </li>
          </ul>
      }
    </nav>
    )
  }
}

export default BottomMenu;
