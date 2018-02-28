import React, { Component } from 'react';
import Loading from './Loading.js';
class Home extends Component {
  constructor() {
    super();
    this.state = {
      fights: []
    }
  }
  componentDidMount() {
    let url = '/api/show/fights';

    fetch(url)
      .then(res => res.json())
      .then(data => this.setState({ fights: data }));
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.fights.length
            ? this.state.fights.map(fight => {
              return (
                <li key={fight._id}>
                  <span className="created">{fight.created_at}</span>
                  <span className="text">{fight.antagonist.text}</span>
                </li>
              )
            })
            : <Loading />
          }
        </ul>
      </div>
    );
  }
}

export default Home;
