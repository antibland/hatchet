import React, { Component } from 'react';
import Footer from './Footer';
import Logo from './Logo';
import IntroSlides from './IntroSlides';
import './css/Splash/Splash.css';
import './css/Splash/Slides.css';
class Splash extends Component {
  render() {
    return(
      <div className='splash modal'>
        <div className='logoContainer'>
          <Logo />
        </div>
        <IntroSlides />
        <Footer isAuthenticated={false} />
      </div>
    )
  }
}

export default Splash;
