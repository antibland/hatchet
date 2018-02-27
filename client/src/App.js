import React, { Component } from 'react';

import Main from './Main';
import Header from './Header.js';
import { fakeAuth } from './Auth.js';
import './App.css';
import './css/Ribbon.css';

//import { withRouter } from 'react-router-dom';

// const AuthButton = withRouter(({ history }) => (
//   fakeAuth.isAuthenticated === true
//    ? <p>
//       Welcome. <button onClick={() => {
//         fakeAuth.signout(() => history.push('/login'))
//       }}>Log out</button>
//     </p>
//   :  <div>
//       <p>You are not logged in</p>
//         <button onClick={() => {
//           fakeAuth.authenticate(() => history.push('/'))
//         }}>Log in</button>
//       </div>
// ))

class App extends Component {
  render() {
    console.log(fakeAuth.isAuthenticated)

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
