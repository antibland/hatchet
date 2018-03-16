import React, { Component } from 'react';
import Loading from './Loading.js';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import utilities from './shared/utilities';
class Home extends Component {
  constructor() {
    super();
    this.state = {
      fights: [],
      loading: true
    }
  }
  componentDidMount() {
    let url = '/api/fights';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({
          fights: data,
          loading: false
        });
      });
  }

  render() {
    let Hatchets = () => (
      this.state.fights.map(fight => {
        return (
          <li key={fight._id}>
            <span className="title">{fight.title}</span>
            <span className="created">
              <strong>Created </strong>
              <Moment fromNow format='MMMM Do YYYY'>{fight.created_at}</Moment>
            </span>
            <span className="text">{
              utilities.truncate(fight.text.for, 150)
            }</span>
            <Link className="button" to={'/fight/' + fight._id}>View fight</Link>
          </li>
        )
      })
    );

    let emptyMessage = 'It\'s lonely here. Not a hatchet in sight.'

    return (
      <div>
        <ul className="homeList">
          { this.state.loading === true
              ? <Loading />
              : this.state.fights.length === 0
                ? <li>{emptyMessage}</li>
                : <Hatchets />
          }
        </ul>
      </div>
    );
  }
}

export default Home;
