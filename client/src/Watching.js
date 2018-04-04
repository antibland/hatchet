import React, { Component } from 'react';
import HatchetList from './shared/components/HatchetList';
import Loading from './Loading';
import { auth } from './Auth';
class Watching extends Component {
  constructor() {
    super();
    this.state = {
      fights: [],
      loading: true
    };
  }
  componentDidMount() {
    fetch(`/api/${auth.user.userid}/getWatchedFights`)
      .then(res => res.json())
      .then(data => {
        this.setState({ fights: data.fights, loading: false })
      });
  }

  render() {
    return (
      <div>
        <ul className="fightList">
          { this.state.loading === true
              ? <Loading />
              : this.state.fights.length === 0
                ? <li className="noResults center">
                    <p>You're not watching any fights. And that's a little anti-social.</p>
                  </li>
                : <HatchetList fights={this.state.fights} />
          }
        </ul>
      </div>
    );
  }
}

export default Watching;
