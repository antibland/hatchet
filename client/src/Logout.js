import React, { Component } from 'react';
import { fakeAuth } from './Auth';

class Logout extends Component {

  componentDidMount(){
    fetch('/api/logout')
      .then(() => {
        fakeAuth.signout(() => { this.props.history.push('/') })
      })
  }

  render() {
    return (
      <h1 className="loading-text">
        Logging out...
      </h1>
    );
  }
}

export default Logout;
