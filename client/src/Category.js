import React, { Component } from 'react';
import { auth } from './Auth.js';
import JoinOrStartButton from './shared/components/JoinOrStartButton';
import HatchetList from './shared/components/HatchetList';
import Loading from './Loading.js';

class Category extends Component {
  constructor() {
    super();
    this.state = {
      fights: [],
      loading: true,
      message: ''
    };
  }

  componentDidMount() {
    // /api/fights/categories/:category' => fightApi.getFightsByCategory
    const {pathname} = this.props.location;

    fetch(`/api/fights${pathname}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          fights: data.fights,
          loading: false,
          message: data.message
        });
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
                  <p>{ this.state.message }</p>
                </li>
                : <HatchetList fights={this.state.fights} />
          }
        </ul>
        <p>
          <JoinOrStartButton loggedIn={auth.hasValidToken()} />
        </p>
      </div>
    );
  }
}

export default Category;
