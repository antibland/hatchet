import React, { Component } from 'react';
import { fakeAuth } from './Auth.js';
import { Link } from 'react-router-dom';
import Loading from './Loading.js';
import Moment from 'react-moment';
import './css/Flash.css';
import './css/ProfileFightList.css';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      fights: [],
      loading: true
    }
  }
  componentDidMount() {
    let url = `/api/${fakeAuth.user.userid}/fights`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({
          fights: data.fights,
          loading: false
        });
      });

  }

  render() {
    let fight_noun = '';
    let fight_len = this.state.fights.length;
    if (fight_len === 1) {
      fight_noun = 'fight';
    } else if (fight_len > 1) {
      fight_noun = 'fights';
    }

    function truncate(str) {
      const len = 75;
      return (str.length > len) ? str.substr(0, len-1) + '…' : str;
    }

    return (
      <div>
        { this.state.loading === true
          ? <Loading />
          : <div>
              <h1>{ fight_len } { fight_noun } found</h1>
              <ul className="fightList">
              { this.state.fights.length
                ? this.state.fights.map((fight, index) => {
                  return (
                    <li key={fight._id}>
                      <span className="created">
                        <strong>Created: </strong>
                        <Moment fromNow format='MMMM Do YYYY'>{fight.created_at}</Moment>
                      </span>
                      <span className="type"><strong>Type: </strong>A {fight.type} fight.</span>
                      <span className="text">{truncate(fight.text.for)}</span>
                      { fight.isLive
                        ? <Link className="button" to={'api/fights/' + fight._id}>View the fight</Link>
                        : <p className="system-message">
                          <svg aria-hidden="true" className="system-tip">
                            <use xlinkHref="./symbols/svg-defs.svg#system-tip" />
                          </svg>
                            We are still waiting to hear from that coward to respond. Stay patient.
                          </p>
                      }

                    </li>
                  )
                })
                : <li><p>You have no fights just yet. <Link to='/create'>Start one</Link></p></li>
              }
              </ul>
            </div>
        }
      </div>
    )
  }
}

export default Profile;
