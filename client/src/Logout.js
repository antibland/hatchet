import React, { Component } from 'react';
import { fakeAuth } from './Auth';
import Loading from './Loading.js';

class Logout extends Component {

  componentDidMount(){
    fetch('/api/logout')
      .then(() => {
        fakeAuth.signout(() => { this.props.history.push('/') })
      })
  }

  render() {
    return (
      <Loading text='Logging out...' />
    );
  }
}

export default Logout;
