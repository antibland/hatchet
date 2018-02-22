import React, { Component } from 'react';

import Main from './Main';
import Header from './Header.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Main />
        {/* <FightsContainer fights={fakeServerData} /> */}
      </div>
    );
  }
}

export default App;
