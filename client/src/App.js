import React, { Component } from 'react';
import Main from './Main';
import Header from './Header';
import Footer from './Footer';
import Splash from './Splash';
import { auth } from './Auth.js';
import './App.css';
import './css/Nav.css';
import './css/Ribbon.css';

class App extends Component {
  checkStorage(key) {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, true);
      return true;
    } else {
      return localStorage.getItem(key);
    }
  }

  render() {
    let isAuthenticated = auth.hasValidToken();
    let showSplash = this.checkStorage('showSplash');
    return (
      <div className="App">
        { showSplash === true && isAuthenticated === false
          ? <Splash />
          : <React.Fragment>
              <Header isAuthenticated={isAuthenticated} />
              <Main />
              <Footer isAuthenticated={isAuthenticated} />
            </React.Fragment>
        }
      </div>
    );
  }
}

export default App;
