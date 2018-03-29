import React, { Component } from 'react';
import Loading from './Loading.js';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import utilities from './shared/utilities';
import { auth } from './Auth';
import ButtonLink from './shared/components/ButtonLink';
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
        let firstWord = fight.type.split(' ')[0].replace('\'', '');
        let categoryImg = utilities.getCategoryImage(firstWord);
        return (
          <li key={fight._id}>
            <Link className="button link" to={'/fight/' + fight._id}>
              { categoryImg }
              <span className="title">{fight.title}</span>
            </Link>
          </li>
        )
      })
    );

    return (
      <div>
        <ul className="homeList">
          { this.state.loading === true
              ? <Loading />
              : this.state.fights.length === 0
                ? <li className="noResults">
                  <p>It's lonely here. Not a hatchet in sight.
                    { auth.hasValidToken()
                        ? <ButtonLink
                            to='/create'
                            classList='inlineLink'>
                            Start Fight
                          </ButtonLink>
                        : <ButtonLink
                            to='/join'
                            classList='inlineLink'>
                            Join Us
                          </ButtonLink>
                    }
                  </p>
                </li>
                : <Hatchets />
          }
        </ul>
      </div>
    );
  }
}

export default Home;
