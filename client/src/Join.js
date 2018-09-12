import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/Flash.css";

function validate(username, email, password) {
  // true means invalid, so our conditions got reversed
  return {
    username: username.length === 0 || username.length < 4,
    email: email.length === 0,
    password: password.length < 8
  };
}

class Join extends Component {
  constructor() {
    super();
    this.state = {
      disableForm: false,
      flash: {
        type: null,
        message: null
      },
      username: "",
      email: "",
      password: "",
      touched: {
        email: false,
        password: false
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    if (!this.canBeSubmitted()) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    this.setState({ disableForm: true });

    fetch("/api/join", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(res => res.json())
      .catch(error => {
        this.setState({ disableForm: true });
        console.error("Error:", error);
      })
      .then(data => {
        this.setState({ disableForm: false });

        if (data.type === "success") {
          this.setState({
            flash: {
              message: data.message,
              type: "success"
            },
            username: "",
            email: "",
            password: ""
          });
        } else if (data.type === "failure") {
          this.setState({
            flash: {
              message: data.message,
              type: "error"
            }
          });
        }
      })
      .catch(error => {
        this.setState({ disableForm: true });
        console.error("Error:", error);
      });
  }

  canBeSubmitted() {
    const errors = validate(
      this.state.username,
      this.state.email,
      this.state.password
    );
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    return !isDisabled;
  }

  handleBlur = field => () => {
    this.setState({
      touched: { ...this.state.touched, [field]: true }
    });
  };

  handleChange(e) {
    if (e.target.id === "email") {
      this.setState({ email: e.target.value });
    } else if (e.target.id === "password") {
      this.setState({ password: e.target.value });
    } else if (e.target.id === "username") {
      this.setState({ username: e.target.value });
    }
  }

  render() {
    const errors = validate(
      this.state.username,
      this.state.email,
      this.state.password
    );
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    const shouldMarkError = field => {
      const hasError = errors[field];
      const shouldShow = this.state.touched[field];

      return hasError ? shouldShow : false;
    };

    let flashClasses =
      this.state.flash.type !== null ? `flash ${this.state.flash.type}` : "";

    let flashMessage =
      this.state.flash.message !== null ? (
        <div className={flashClasses}>{this.state.flash.message}</div>
      ) : (
        ""
      );

    let role = "note";

    return (
      <div>
        <h2>Join</h2>
        <form
          action="/api/join"
          method="POST"
          disabled={this.state.disableForm}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
        >
          {flashMessage}

          <div className="required-field-wrapper">
            <input
              className={shouldMarkError("username") ? "error" : ""}
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              type="text"
              name="username"
              id="username"
              data-lpignore="true"
              value={this.state.username}
              placeholder="choose a username"
              aria-label="choose a username"
              maxLength="28"
              onBlur={this.handleBlur("username")}
            />
            <span role={role}>
              Letters, numbers, underscores and dots are okay.
            </span>
          </div>

          <div className="required-field-wrapper">
            <input
              className={shouldMarkError("email") ? "error" : ""}
              required
              type="email"
              name="email"
              id="email"
              data-lpignore="true"
              value={this.state.email}
              aria-label="email address"
              placeholder="email address"
              onBlur={this.handleBlur("email")}
            />
          </div>

          <div className="required-field-wrapper">
            <input
              className={shouldMarkError("password") ? "error" : ""}
              required
              type="password"
              name="password"
              id="password"
              data-lpignore="true"
              value={this.state.password}
              placeholder="password"
              aria-label="password"
              onBlur={this.handleBlur("password")}
            />
            <span role={role}>At least 8 characters.</span>
          </div>

          <p className="joinTerms">
            By creating an account, you agree to our{" "}
            <Link to="/terms">Terms & Conditions</Link>
          </p>

          <button
            type="submit"
            disabled={isDisabled}
            className="button primary"
          >
            Create Account
          </button>
        </form>
      </div>
    );
  }
}

export default Join;
