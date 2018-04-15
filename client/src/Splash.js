import React from 'react';
import Footer from './Footer';
import './css/Splash/Splash.css';
import './css/Splash/Slides.css';

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
    <div className="slider">
      <div className="slides">
        <div className="slide" id="step1">
          <img className="image" src="./svg/icon-intro-argument.svg" alt="Opposing chat bubbles"/>
          <div className="title">Submit Your Conflict</div>
          <div className="text">Tell us who you are fighting with, what they did, and why it bothers you.</div>
        </div>
        <div className="slide" id="step2">
          <img className="image" src="./svg/icon-intro-clock.svg" alt="Clock"/>
          <div className="title">Wait For Response</div>
          <div className="text">Your opponent has 24 hours to respond with a counter argument.</div>
        </div>
        <div className="slide" id="step3">
          <img className="image" src="./svg/icon-intro-voting.svg" alt="Ballot box"/>
          <div className="title">Voting Begins</div>
          <div className="text">Aloow the fate of your dispute to be decided by a jury of your peers.</div>
        </div>
        <div className="slide" id="step4">
          <img className="image" src="./svg/icon-intro-trophy.svg" alt="Trophy"/>
          <div className="title">Bury The Hatchet</div>
          <div className="text">Once the winner is chosen, agree to accept the verdict and let go of the argument.</div>
        </div>
      </div>
      <nav className="sliderNav">
        <a href="#step1"><span>step 1</span></a>
        <a href="#step2"><span>step 2</span></a>
        <a href="#step3"><span>step 3</span></a>
        <a href="#step4"><span>step 4</span></a>
      </nav>
    </div>
    <Footer isAuthenticated={false} />
  </div>
);

export default Splash;
