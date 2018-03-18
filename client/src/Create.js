import React, { Component } from 'react';
import './css/Form.css';
import { auth } from './Auth.js';
import Avatar from './shared/components/Avatar';

function OpponentAvatar(props) {
  if (props.url.length) {
    return <Avatar imgpath={props.url} />;
  } else {
    return <Avatar />;
  }
}

class Create extends Component {
  static fight_types = [
    'Roommate',
    'Lover\'s Quarrel',
    'Coworker',
    'Family Member',
    'Friend'
  ];

  static timeout = null;
  static timeoutInterval = 2000;

  constructor() {
    super();
    this.state = {
      target: 'someone',
      character_count: 0,
      is_valid: false,
      currentAvatarUrl: null,
      opponentAvatarUrl: '',
      opponentIsValidUser: null,
      someone: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    this.checkForUser = this.checkForUser.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleChange(e) {
    this.setState({ target: e.target.value });
  }

  handleSubmit(e) {

  }

  handleInput(e) {
    this.setState({
      opponentIsValidUser: null,
      someone: e.target.value,
      opponentAvatarUrl: ''
    });
    clearTimeout(Create.timeout);
  }

  handleKeyUp(e) {
    clearTimeout(Create.timeout);
    Create.timeout = setTimeout(this.checkForUser, Create.timeoutInterval);
  }

  checkForUser() {
    let { someone } = this.state;

    if (someone.length && someone !== auth.user.username) {
      // /api/:userName/avatar/username
      fetch(`/api/${this.state.someone}/avatar/username`)
        .then(res => res.json())
        .then(data => {
          if (data.type === true && data.avatar) {
            this.setState({
              opponentAvatarUrl: data.avatar
            });
          }
          this.setState({ opponentIsValidUser: data.type });
        })
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

  handleTextareaChange(e) {
    let count = this.state.character_count;
    if (count >= 200 && count <= 1000) {
      this.setState({ is_valid: true })
    } else {
      this.setState({ is_valid: false })
    }
    this.setState({ character_count : e.target.value.length });
  }

  render() {
    let antagonist_avatar = this.state.currentAvatarUrl;
    let earth = './earth.png';
    let count = this.state.character_count;

    let count_text = count === 1 ? 'character' : 'characters';
    let fight_type = this.state.target === 'world' ?
      <option value="philosophical">Philosophical</option> :
      Create.fight_types.map(type => {
        return <option key={type} value={type.toLowerCase()}>{type}</option>
      });

    let styles = {
      slots: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: '2em'
      },
      versus: {
        margin: '0 1em',
        width: '100px',
        height: '100%'
      },
      submitButton: {
        display: 'block',
        width: '100%'
      },
      characterCount: {
        color: '#333',
        fontFamily: "'Bitter', serif"
      }
    }

    let formAction = `/api/${auth.user.userid}/fight`;
    let role = "note";

    let { someone, opponentIsValidUser, opponentAvatarUrl } = this.state;
    let me = auth.user.username;

    let opponentIsValidUserResult =
      opponentIsValidUser === false
        ? (<div className="lookupResult">
            We could not locate <strong>{someone}</strong>
          </div>)
        : opponentIsValidUser === true && someone === me
          ? (<div className="lookupResult">
              You have an axe to grind with yourself? Save it for therapy.
            </div>)
          : opponentIsValidUser === true && someone !== me
            ? (<div className="lookupResult">
                <svg aria-hidden="true" className="checkmark-icon">
                  <use xlinkHref="./symbols/svg-defs.svg#checkmark-icon" />
                </svg>
                Current opponent: <strong>{someone}</strong>
              </div>)
            : '';

    return (
      <div>
        <h2 className="ribbon">
          <strong className="ribbon-content">Start a Hatchet</strong>
        </h2>

        <form onSubmit={this.handleSubmit} method="POST" action={formAction}>
          <div className="slots" style={styles.slots}>
            <div className="you">
              { antagonist_avatar === null || antagonist_avatar === ''
                ? <Avatar imgpath='/user.png' width='94px' height='94px' />
                : <Avatar imgpath={antagonist_avatar} />
              }
            </div>
            <img src="./versus.png" alt="versus" style={styles.versus} />
            <div className="them">
              {this.state.target === 'someone'
                ? <OpponentAvatar url={opponentAvatarUrl} />
                : <Avatar imgpath={earth} />
              }
            </div>
          </div>

          <label htmlFor="target">Choose your opponent</label>
          <div className="styled-select slate">
            <select id="target" name="target" onChange={this.handleChange}>
              <option value="someone">Someone</option>
              <option value="world">Everyone</option>
            </select>
          </div>

          {this.state.target === 'someone'
          ? <div className="required-field-wrapper">
              <input
                type="text"
                aria-label="Enter username or email address"
                className="someone"
                name="opponent"
                id="opponent"
                defaultValue={this.state.someone}
                required
                onInput={this.handleInput}
                onKeyUp={this.handleKeyUp}
                placeholder="Enter username or email address" />
              <span className="required">*</span>
              {opponentIsValidUserResult}
            </div>
            : ''
          }

          <label htmlFor="type">What type?</label>
          <div className="styled-select slate">
            <select name="type" id="type">
              {fight_type}
            </select>
          </div>

          <label htmlFor="title">Title it</label>
          <div className="required-field-wrapper">
          <input
            type="text"
            onChange={this.handleTextareaChange}
            onBlur={this.handleTextareaChange}
            name="title"
            id="title"
            maxLength="100"
            required
            placeholder="Is it okay that… Should I allow my mother to…" />
            <span className="required">*</span>
            <span role={role}>A good title is neutral and fair. Don't use the title to state your argument—that's what the next part is for. Consider titles starting with: <em>Is it okay that…</em> or <em>Is my boyfriend being overly jealous?</em> Get the idea?</span>
          </div>

          <label htmlFor="beef">Why I'm right</label>
          <div className="required-field-wrapper">
            <textarea
              required
              onChange={this.handleTextareaChange}
              onBlur={this.handleTextareaChange}
              name="beef"
              id="beef"
              placeholder="Between 200 and 1000 characters">
            </textarea>
            <span className="required">*</span>
          </div>
          <span style={styles.characterCount} className="character-count">
            {count} {count_text}
          </span>

          <button
            type="submit"
            disabled={!this.state.is_valid}
            className="button"
            style={styles.submitButton}>Send</button>
        </form>
      </div>
    );
  };
};

export default Create;
