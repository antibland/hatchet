import React, { Component } from 'react';
import Loading from './Loading.js';
import Pagination from './shared/components/Pagination';

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
      <div className='paginationContainer'>
        { this.state.loading === true
            ? <Loading />
            : this.state.fights.length === 0
              ? <ul><li className='noResults center'>
                  <p>It's lonely here. Not a hatchet in sight.</p>
                </li></ul>
              : <Pagination items={this.state.fights} />
        }
      </div>
    );
  }
}

export default Home;
