import React, { Component } from 'react';
import { auth } from './Auth';
import Loading from './Loading.js';

class Logout extends Component {

  componentDidMount() {
    let userId = auth.user.userid;
    let url = `/api/${userId}/logout`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        auth.signout(() => {
          this.props.history.push('/');
        });
      });
  }

  render() {
    return (
      <Loading text='Logging out...' />
    );
  }
}

export default Logout;
