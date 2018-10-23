import React, { Component } from "react";
import { Link } from "react-router-dom";
import { auth } from "./Auth.js";
import queryString from "query-string";
import "./css/Flash.css";

function validate(email, password) {
  // true means invalid, so our conditions got reversed
  return {
    email: email.length === 0,
    password: password.length === 0
  };
}
class Login extends Component {
  constructor() {
    super();
    this.state = {
      flash: {
        type: null,
        message: null
      },
      email: "",
      password: "",
      touched: {
        email: false,
        password: false
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const params = queryString.parse(this.props.location.search);

    if (params.verified) {
      let message =
        params.verified === "1"
          ? "Your account is 100% verified. Log in and look around."
          : params.verified === "2"
            ? "You account was previously verified."
            : "";

      if (message.length > 0) {
        let flash = { ...this.state.flash };
        flash.type = "success";
        flash.message = message;
        this.setState({ flash });
      }
    }
  }

  handleSubmit(e) {
    if (!this.canBeSubmitted()) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    fetch("/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.type === "success" && data.token.length) {
          auth.authenticate(() => {
            auth.user = {
              username: data.user.username,
              userid: data.user.userid,
              token: data.token,
              avatar: data.user.avatar
            };
            localStorage.setObject("user", auth.user);
            auth.isAuthenticated = auth.hasValidToken();
            this.props.history.push("/");
            document.body.classList.remove("loggedOut");
            window.init();
          });
        } else if (data.type === "failure") {
          this.setState({
            flash: {
              message: data.message,
              type: "error"
            }
          });
        }
      });
  }

  canBeSubmitted() {
    const errors = validate(this.state.email, this.state.password);
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
    }
  }

  render() {
    let styles = {
      forgottenPassword: {
        padding: "1em 0"
      }
    };

    const errors = validate(this.state.email, this.state.password);
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

    return (
      <div>
        <h2>Log In</h2>
        <form
          action="/api/login"
          method="POST"
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
        >
          {flashMessage}

          <div className="required-field-wrapper">
            <input
              className={shouldMarkError("email") ? "error" : ""}
              required
              aria-label="email"
              type="email"
              name="email"
              id="email"
              data-lpignore="true"
              placeholder="email"
              defaultValue={this.state.email}
              onBlur={this.handleBlur("email")}
            />
          </div>

          <div className="required-field-wrapper">
            <input
              className={shouldMarkError("password") ? "error" : ""}
              required
              aria-label="password"
              type="password"
              name="password"
              id="password"
              data-lpignore="true"
              placeholder="password"
              defaultValue={this.state.password}
              onBlur={this.handleBlur("password")}
            />
          </div>
          <button
            type="submit"
            disabled={isDisabled}
            className="button primary"
          >
            Log In
          </button>
          <div style={styles.forgottenPassword}>
            <Link
              className="form-link"
              to={`/forgot_password?email=${this.state.email}`}
            >
              I forgot my password
            </Link>
            <Link
              className="form-link"
              to={`/resend?email=${this.state.email}`}
            >
              Resend verification link
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
