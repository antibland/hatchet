import React, { Component } from 'react';
import Loading from './Loading.js';
import { auth } from './Auth';
import HatchetList from './shared/components/HatchetList';
import ButtonLink  from './shared/components/ButtonLink';
class Home extends Component {
  constructor() {
    super();
    this.state = {
      fights: [],
      loading: true
    };
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
    return (
      <div>
        <ul className="homeList">
          { this.state.loading === true
              ? <Loading />
              : this.state.fights.length === 0
                ? <li className="noResults center">
                    <p>It's lonely here. Not a hatchet in sight.</p>
                  </li>
                : <HatchetList fights={this.state.fights} />
          }
        </ul>
        <p>
          { auth.hasValidToken()
            ? ''
            : <ButtonLink
                to='/join'
                classList='button primary'>Join Us
              </ButtonLink>
          }
        </p>
      </div>
    );
  }
}

export default Home;
