import React, { Component } from 'react';
// import Menu from './Menu.js'
import './App.css';

let fakeServerData = {
  fights: [
    {
      id: "1",
      type: "Workplace",
      time_remaining: "30 seconds",
      antagonist: {
        votes: 2213,
        name: "Unbeatable113",
        avatar: "./avatars/angry-businessman.jpg",
        text: "Joe likes clipping his nails at his desk. It's fucking disgusting and I finally brought it up to him, 3 years on. He acted offended and said that he has no time to do it elsewhere—he's got three kids and a real battle-ax for a wife. The thing is, I don't care. There's a right and wrong way to act in the workplace. Clip those nails on your own time, brother!"
      },
      defender: {
        votes: 3109,
        name: "YerWrongDude99",
        avatar: "./avatars/redneck.jpeg",
        text: "Why should I stop? This is why headphones were invented. You don't see me complaining about the confederate flag on your desk. You're a redneck and that doesn't bother me. Live and let live, you snob."
      }
    },
    // {
    //   id: "2",
    //   type: "Domestic Partnership",
    //   time_remaining: "20 seconds",
    //   antagonist: {
    //     name: "HumanGarbage01",
    //     text: "I need sex more than once a week. Sometimes it goes even longer! I'm not some perverted demon. I'm just a guy with basic needs and possibly too much time on my hands. Am I overstepping by demanding more out of this relationship?"
    //   },
    //   defender: {
    //     name: "LivingIsFighting",
    //     text: "For years, I've had terrible headaches. When my head hurts, I don't put out. It's that simple. When we met, I had the same headaches, so you knew what you were getting into. For most guys, porn fills in when their main squeeze isn't available. I would suggest you explore the filthy corners of the Internet and stop harassing me for nookie."
    //   }
    // }
  ]
};

class Fight extends Component {
  render() {
    let image_alt = `${this.props.data.antagonist.name}'s avatar`;
    let antagonist_avatar = this.props.data.antagonist.avatar;
    let defender_avatar = this.props.data.defender.avatar;
    let styles = {
      antagonist: {
        avatar: {
          backgroundSize: '100% 100%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          display: 'inline-block',
          backgroundImage: `url(${antagonist_avatar})`
        }
      },
      defender: {
        avatar: {
          backgroundSize: '100% 100%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          display: 'inline-block',
          backgroundImage: `url(${defender_avatar})`
        }
      }
    }
    return (
      <div>
        <header className="fight-header">
          <div className="user1">
            <div className="user-avatar">
              <div style={styles.antagonist.avatar}></div>
              <h2 title={this.props.data.antagonist.name}>
                {this.props.data.antagonist.name}
              </h2>
            </div>
          </div>
          <div className="user2">
            <div className="user-avatar">
              <div style={styles.defender.avatar}></div>
              <h2 title={this.props.data.defender.name}>
                {this.props.data.defender.name}
              </h2>
            </div>
          </div>
        </header>
        <div className="fight-arguments">
          <div className="antagonist-argument">
            <p className="fight-text">{(this.props.data.antagonist.text).substring(0, 100) + '…'}</p>
            <p className="total-votes">Votes: {this.props.data.antagonist.votes}</p>
          </div>
          <div className="defender-argument">
            <p className="fight-text">{(this.props.data.defender.text).substring(0, 100) + '…'}</p>
            <p className="total-votes">Votes: {this.props.data.defender.votes}</p>
          </div>
        </div>
        <a href="#" className="button">View full fight</a>
      </div>
    )
  }
}

class FightsContainer extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {}
    };
  }
  componentDidMount() {
    this.setState({
      serverData: fakeServerData
    });
  }

  render() {
    let fights = null;

    if (this.state.serverData.fights) {
      fights = this.state.serverData.fights.map((fight) => {
        return <Fight key={fight.id} data={fight} />
      });
    }
    return (
      <div>
        {this.state.serverData.fights ?

          <div className="featured-fights-container">
            {fights}
          </div> :

          <h1>Loading…</h1>
        }
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <FightsContainer fights={fakeServerData} />
      </div>
    );
  }
}

export default App;
