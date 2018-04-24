import React from 'react';
import { NavLink } from 'react-router-dom';
import MainTabs from './MainTabs';
import commonData from './shared/commonData';
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
    </nav>
  </header>
)

export default Header;
