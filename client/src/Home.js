import React, { Component } from 'react';
import Loading from './Loading.js';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
class Home extends Component {
  constructor() {
    super();
    this.state = {
      fights: []
    }
  }
  componentDidMount() {
    let url = '/api/fights';

    fetch(url)
      .then(res => res.json())
      .then(data => this.setState({ fights: data }));
  }

  render() {
    return (
      <div>
        <ul className="homeList">
          {this.state.fights.length
            ? this.state.fights.map(fight => {
              return (
                <li key={fight._id}>
                  <span className="title">{fight.title}</span>
                  <span className="created">
                    <strong>Created </strong>
                    <Moment fromNow format='MMMM Do YYYY'>{fight.created_at}</Moment>
                  </span>
                  <span className="text">{fight.text.for}</span>
                  <Link className="button" to={'/fight/' + fight._id}>View fight</Link>
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
