import React, { Component } from 'react';
import { fakeAuth } from './Auth';
//import { Redirect } from 'react-router';

class Logout extends Component {

  componentDidMount(){
    fetch('/api/logout')
      .then(() => {
        fakeAuth.signout(() => { window.location.href = '/' })
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
