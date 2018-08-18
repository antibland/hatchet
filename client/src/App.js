import React, { Component } from "react";
import { auth } from "./Auth.js";
import Header from "./Header";
import Main from "./Main";
import Splash from "./Splash";
import "./App.css";
import "./css/Avatar.css";
import "./css/Grid.css";
import "./css/Nav.css";
import "./css/Ribbon.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      showSplash: null
    };
  }

  checkStorage(key) {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, "show");
      this.setState({ showSplash: "show" });
      return;
    } else {
      return localStorage.getItem(key);
    }
  }

  render() {
    let isAuthenticated = auth.hasValidToken();
    let showSplash = this.checkStorage("showSplash");

    return (
      <div className="App">
        {showSplash === "show" && isAuthenticated === false ? (
          <Splash />
        ) : (
          <React.Fragment>
            <Header isAuthenticated={isAuthenticated} />
            <Main />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
