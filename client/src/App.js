import React, { Component } from 'react';

import Main from './Main';
import Header from './Header.js';
import BottomMenu from './BottomMenu.js';
import { auth } from './Auth.js';
import './App.css';
import './css/Nav.css';
import './css/Ribbon.css';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer>
    <small>{new Date().getFullYear()} &copy; Bury The Hatchet</small>
    <nav>
      <Link to='/terms'>Terms of Service</Link>
      <Link to='/privacy'>Privacy Policy</Link>
    </nav>
  </footer>
)

class App extends Component {
  render() {
    let isAuthenticated = auth.hasValidToken();

    return (
      <div className="App">
        <Header isAuthenticated={isAuthenticated} />
        <Main />
        { isAuthenticated
          ? <BottomMenu />
          : ''
        }
        <Footer />
        {/* <FightsContainer fights={fakeServerData} /> */}
      </div>
    );
  }
}

export default App;
