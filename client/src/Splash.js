import React from 'react';
import Footer from './Footer';
import './css/Splash.css';

const Splash = () => (
  <div className='splash modal'>
    <div className="logoContainer">
      <img
        className='logo'
        src='/logo.png'
        srcSet='/logo.png 1x, /logo@2x.png 2x, /logo@3x.png 3x'
        alt='Bury The Hatchet logo'
      />
    </div>
    <p>Slides go here</p>
    <Footer isAuthenticated={false} />
  </div>
);

export default Splash;
