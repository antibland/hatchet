import React, { Component } from 'react';
import { auth } from '../Auth.js';
import LookupResult from './LookupResult';
import utilities from '../shared/utilities';
import VersusImg from './VersusImg';
import SlotsYou from './SlotsYou';
import SlotsThem from './SlotsThem';
import CheckMarkIcon from './CheckMarkIcon';

class Step1 extends Component {
  static timeout = null;
  static timeoutInterval = 1200;

  constructor(props) {
    super(props);
    this.state = {
      opponent: '',
      someone: '',
      isValid: false,
      currentAvatarUrl: null,
      opponentAvatarUrl: '',
      opponentIsValidUser: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.checkForUser = this.checkForUser.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleChange(e) {
    this.setState({ opponent: e.target.value });
  }

  handleInput(e) {
    this.setState({
      opponentIsValidUser: null,
      someone: e.target.value,
      opponentAvatarUrl: '',
      isValid: false
    });
    clearTimeout(Step1.timeout);
  }

  handleKeyUp(e) {
    clearTimeout(Step1.timeout);
    Step1.timeout = setTimeout(this.checkForUser, Step1.timeoutInterval);
  }

  checkForUser() {
    const { someone } = this.state;

    // user can be an email or username — figure this out server-side
    if (someone.length && someone !== auth.user.username) {
      fetch(`/api/${someone}/isUser`)
        .then(res => res.json())
        .then(data => {

          data.isUser // fetch avatar from returned username
            ? fetch(`/api/${data.username}/avatar/username`)
                .then(res => res.json())
                .then(data => {
                  this.setState({
                    opponentAvatarUrl: data.avatar,
                    opponentIsValidUser: true,
                    isValid: true
                  });
                })
            : this.setState({
              opponentAvatarUrl: '',
              opponentIsValidUser: false,
              isValid: utilities.validateEmail(someone)
            });
        })
        .catch(err => {
          console.log('Request failed', err)
        });
    }
  }

  setAvatar() {
    fetch(`/api/${auth.user.userid}/avatar`)
      .then(res => res.json())
      .then(data => {
        if (data.type === 'success' && data.avatar !== null) {
          this.setState({ currentAvatarUrl: data.avatar })
        }
      });
  }

  componentDidMount() {
    this.setAvatar();
  }

  render() {
    if (this.props.currentStep !== 1) {
      return null;
    }

    const you = auth.user.username;

    const {
      someone,
      opponentIsValidUser,
      opponentAvatarUrl,
      currentAvatarUrl,
      isValid
    } = this.state;

    const notUserIsEmail = opponentIsValidUser === false && utilities.validateEmail(someone) === true;
    const notUserNotEmail = opponentIsValidUser === false && utilities.validateEmail(someone) === false;
    const isUser = opponentIsValidUser === true && someone !== you;

    const opponentIsValidUserResult =
      notUserIsEmail
        ? <LookupResult>
            The email address <strong>{someone}</strong> isn't connected to any
            of our users. After your fight is created, we'll email them and
            invite them to join.
          </LookupResult>
        : notUserNotEmail
          ? <LookupResult>
              We could not locate <strong>{someone}</strong>. You can look people up
              by username or email address.
            </LookupResult>
          : isUser
            ? <LookupResult>
                <CheckMarkIcon />
                Current opponent: <strong>{someone}</strong>
              </LookupResult>
            : '';

    return (
      <div>
        <h2>Step 1</h2>
          <div className="stepContainer">

            <div className="slots">
              <SlotsYou
                you={you}
                currentAvatarUrl={currentAvatarUrl}
              />
              <VersusImg />
              <SlotsThem
                them={someone}
                opponentAvatarUrl={opponentAvatarUrl}
              />
            </div>

            <input
              className="featured"
              type="text"
              aria-label="Enter username or email address"
              name="opponent"
              id="opponent"
              required
              onInput={this.handleInput}
              onKeyUp={this.handleKeyUp}
              placeholder="Enter username or email address" />

            {opponentIsValidUserResult}

            <button
              type="submit"
              onClick={() => {
                if (isValid === true) {
                  this.props.afterValid({
                    step: this.props.currentStep,
                    opponent: this.state.opponent
                  })
                }
              }}
              style={{ display: 'block', margin: '2em auto'}}
              disabled={!isValid}
              className="button">Continue
            </button>
        </div>
      </div>
    )
  }
}

export default Step1;
