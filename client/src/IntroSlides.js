import React, { Component } from 'react'
import Swiper from 'react-id-swiper';

export class IntroSlides extends Component {
  render() {
    const params = {
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    };
    return (
      <Swiper {...params}>
        <div className='swiper-slide' id='step1'>
          <img className='image' src='./svg/icon-intro-argument.svg' alt='Opposing chat bubbles'/>
          <div className='title'>Submit Your Conflict</div>
          <div className='text'>Tell us who you are fighting with, what they did, and why it bothers you.</div>
        </div>
        <div className='swiper-slide' id='step2'>
          <img className='image' src='./svg/icon-intro-clock.svg' alt='Clock'/>
          <div className='title'>Wait For Response</div>
          <div className='text'>Your opponent has 24 hours to respond with a counter argument.</div>
        </div>
        <div className='swiper-slide' id='step3'>
          <img className='image' src='./svg/icon-intro-voting.svg' alt='Ballot box'/>
          <div className='title'>Voting Begins</div>
          <div className='text'>Aloow the fate of your dispute to be decided by a jury of your peers.</div>
        </div>
        <div className='swiper-slide' id='step4'>
          <img className='image' src='./svg/icon-intro-trophy.svg' alt='Trophy'/>
          <div className='title'>Bury The Hatchet</div>
          <div className='text'>Once the winner is chosen, agree to accept the verdict and let go of the argument.</div>
        </div>
    </Swiper>
    )
  }
}

export default IntroSlides;
