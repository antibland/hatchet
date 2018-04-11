import React, { Component } from 'react';

import Main from './Main';
import Header from './Header.js';
import BottomMenu from './BottomMenu.js';
import { auth } from './Auth.js';
import './App.css';
import './css/Nav.css';
import './css/Ribbon.css';

const Footer = props => (
  <footer className={props.isAuthenticated === false ? 'loggedOut' : ''}>
    <BottomMenu />
  </footer>
)

class App extends Component {
  render() {
    let isAuthenticated = auth.hasValidToken();

    return (
      <div className="App">
        <Header isAuthenticated={isAuthenticated} />
        <Main />
        <Footer isAuthenticated={isAuthenticated} />
      </div>
    );
  }
}

export default App;
