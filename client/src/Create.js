import React, { Component } from 'react';

class Create extends Component {
  constructor() {
    super();
    this.state = { fight_type: 'individual' }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ fight_type: e.target.value });
  }

  render() {
    let antagonist_avatar = './avatars/angry-businessman.jpg';
    let question_mark = './question_mark.png';
    let earth = './earth.png';
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
          <strong class="ribbon-content">Create a fight</strong>
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

          <label for="type">Pick your target</label>
          <div class="styled-select slate" onChange={this.handleChange}>
            <select id="type" name="type">
              <option value="individual">Individual</option>
              <option value="world">The World</option>
            </select>
          </div>

          {this.state.fight_type === 'individual' ?
            <input
              type="text"
              className="individual"
              placeholder="Enter username or email address" /> :
            <span>Fight the world!</span>

          }
          <button
            type="submit"
            className="button"
            style={styles.submitButton}>Submit</button>
        </form>
      </div>
    );
  };
};

export default Create;
