import React, { Component } from 'react';

import Main from './Main';
import Header from './Header.js';
import { fakeAuth } from './Auth.js';
import './App.css';
import './css/Nav.css';
import './css/Ribbon.css';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer>
    <small>2018 &copy; Big Idea, Inc.</small>
    <nav>
      <Link to='/terms'>Terms of Service</Link>
      <Link to='/privacy'>Privacy Policy</Link>
    </nav>
  </footer>
)

class App extends Component {
  render() {
    console.log(fakeAuth.isAuthenticated)

    return (
      <div className="App">
        <Header />
        <Main />
        <Footer />
        {/* <FightsContainer fights={fakeServerData} /> */}
      </div>
    );
  }
}

export default App;
