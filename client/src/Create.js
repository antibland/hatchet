import React, { Component } from 'react';

class Create extends Component {
  static fight_types = [
    'Roommate',
    'Lover\'s Quarrel',
    'Coworker',
    'Family Member',
    'Friend'
  ];

  constructor() {
    super();
    this.state = {
      target: 'individual',
      character_count: 0,
      is_valid: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
  }

  handleChange(e) {
    this.setState({ target: e.target.value });
  }

  handleSubmit(e) {

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
    let antagonist_avatar = './avatars/angry-businessman.jpg';
    let question_mark = './question_mark.png';
    let earth = './earth.png';
    let count = this.state.character_count;
    let count_text = count === 1 ? 'character' : 'characters';
    let fight_type = this.state.target === 'world' ?
      <option value="philosophical">Philosophical</option> :
      Create.fight_types.map(type => {
        return <option key={type} value={type.toLowerCase()}>{type}</option>
      });

    let styles = {
      antagonist: {
        avatar: {
          backgroundSize: '100% 100%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          display: 'inline-block',
          backgroundImage: `url(${antagonist_avatar})`
        }
      },
      question_mark: {
        backgroundSize: '100% 100%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        display: 'inline-block',
        backgroundImage: `url(${question_mark})`
      },
      earth: {
        backgroundSize: '100% 100%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        display: 'inline-block',
        backgroundImage: `url(${earth})`
      },
      slots: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: '2em'
      },
      versus: {
        margin: '0 1em',
        width: '100px'
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
    return (
      <div>
        <h2 className="ribbon">
          <strong className="ribbon-content">Create a fight</strong>
        </h2>

        <form onSubmit={this.handleSubmit} method="POST" action="/api/create/fight">
          <div className="slots" style={styles.slots}>
            <div className="you">
              <div style={styles.antagonist.avatar}></div>
            </div>
            <img src="./versus.png" alt="versus" style={styles.versus} />
            <div className="them">
              {this.state.target === 'individual' ?
                <div style={styles.question_mark}></div> :
                <div style={styles.earth}></div>
              }
            </div>
          </div>

          <label htmlFor="target">Pick your target</label>
          <div className="styled-select slate">
            <select id="target" name="target" onChange={this.handleChange}>
              <option value="individual">Individual</option>
              <option value="world">The World</option>
            </select>
          </div>

          {this.state.target === 'individual' ?
            <div className="required-field-wrapper">
              <input
                type="text"
                aria-label="Enter username or email address"
                className="individual"
                required
                placeholder="Enter username or email address" />
              <span className="required">*</span>
            </div> :
            ''
          }

          <label htmlFor="type">What type of fight?</label>
          <div className="styled-select slate">
            <select name="type" id="type">
              {fight_type}
            </select>
          </div>

          <label htmlFor="beef">State your beef</label>
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
            style={styles.submitButton}>Submit</button>
        </form>
      </div>
    );
  };
};

export default Create;
