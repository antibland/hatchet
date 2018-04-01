import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { auth } from './Auth.js';
import Avatar from './shared/components/Avatar';
import commonData from './shared/commonData';
import MainTabs from './MainTabs';
import './css/NavTabs.css';

const Logo = () => (
  <h1 aria-labelledby='logoText'>
    <NavLink exact to='/'>
      <img
        className='logo'
        src='/logo.png'
        srcSet='/logo.png 1x, /logo@2x.png 2x, /logo@3x.png 3x'
        alt='Bury The Hatchet logo'
      />
    </NavLink>
    <span className='a11yText' id='logoText'>Bury The Hatchet</span>
  </h1>
);

const Header = props => (
  <header>
    <Logo />
    <nav role='main'>
      <MainTabs data={
        props.isAuthenticated
          ? commonData.mainTabs
          : commonData.restrictedTabs
      } {...props} />
      {/* <ul>
        { props.isAuthenticated
          ? <React.Fragment>
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
            </React.Fragment>
          : <React.Fragment>
              <li><NavLink className="nav-link" exact to='/join'>Join</NavLink></li>
              <li><NavLink className="nav-link" exact to='/login'>Login</NavLink></li>
            </React.Fragment>
        }
      </ul> */}
    </nav>
  </header>
)

export default Header;
