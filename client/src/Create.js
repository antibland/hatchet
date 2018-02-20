import React, { Component } from 'react';

class Create extends Component {
  constructor() {
    super();
    this.state = {
      fight_type: 'individual',
      character_count: 0,
      is_valid: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
  }

  handleChange(e) {
    this.setState({ fight_type: e.target.value });
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
    let disabled = !this.state.is_valid ? {'disabled' : 'disabled'} : {};

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
      }
    }
    return (
      <div>
        <h2 className="ribbon">
          <strong className="ribbon-content">Create a fight</strong>
        </h2>

        <form onSubmit={this.handleSubmit} method="POST">
          <div className="slots" style={styles.slots}>
            <div className="you">
              <div style={styles.antagonist.avatar}></div>
            </div>
            <img src="./versus.png" alt="versus" style={styles.versus} />
            <div className="them">
              {this.state.fight_type === 'individual' ?
                <div style={styles.question_mark}></div> :
                <div style={styles.earth}></div>
              }
            </div>
          </div>

          <label htmlFor="type">Pick your target</label>
          <div className="styled-select slate" onChange={this.handleChange}>
            <select id="type" name="type">
              <option value="individual">Individual</option>
              <option value="world">The World</option>
            </select>
          </div>

          {this.state.fight_type === 'individual' ?
            <input
              type="text"
              aria-label="Enter username or email address"
              className="individual"
              placeholder="Enter username or email address" /> :
            ''
          }

          <label htmlFor="beef">State your beef</label>
          <textarea
            onChange={this.handleTextareaChange}
            onBlur={this.handleTextareaChange}
            name=""
            id="beef"
            placeholder="Between 200 and 1000 characters">
          </textarea>
          <span className="character-count">
            {count} {count_text}
          </span>

          <button
            type="submit"
            {...disabled}
            className="button"
            style={styles.submitButton}>Submit</button>
        </form>
      </div>
    );
  };
};

export default Create;
