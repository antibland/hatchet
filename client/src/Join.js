import React, { Component } from 'react';

function validate(email, password) {
  // true means invalid, so our conditions got reversed
  return {
    email: email.length === 0,
    password: password.length === 0,
  };
}

class Join extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      touched: {
        email: false,
        password: false,
      }
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    if (!this.canBeSubmitted()) {
      e.preventDefault();
      return;
    }
    const { email, password } = this.state;
    alert(`Signed up with email: ${email} password: ${password}`);
    e.preventDefault();
  }

  canBeSubmitted() {
    const errors = validate(this.state.email, this.state.password);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    return !isDisabled;
  }

  handleBlur = (field) => (e) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  }

  handleChange(e) {
    if (e.target.id === 'email') {
      this.setState({ email: e.target.value });
    } else if (e.target.id === 'password') {
      this.setState({ password: e.target.value });
    }
  }

  render() {
    let styles = {
      submitButton: {
        display: 'block',
        width: '100%'
      }
    }

    const errors = validate(this.state.email, this.state.password);
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    const shouldMarkError = (field) => {
      const hasError = errors[field];
      const shouldShow = this.state.touched[field];

      return hasError ? shouldShow : false;
    };

    return (
      <div>
        <h2 className="ribbon">
          <strong className="ribbon-content">Join</strong>
        </h2>

        <form action="/api/create/user" method="POST" onChange={this.handleChange}>
          <label htmlFor="email">Email</label>
          <div className="required-field-wrapper">
            <input
              className={shouldMarkError('email') ? "error" : ""}
              required
              type="email"
              name="email"
              id="email"
              value={this.state.email}
              placeholder="winner@someplace.com"
              onBlur={this.handleBlur('email')}/>
            <span className="required">*</span>
          </div>

          <label htmlFor="password">Password</label>
          <div className="required-field-wrapper">
            <input
              className={shouldMarkError('password') ? "error" : ""}
              required
              type="password"
              name="password"
              id="password"
              value={this.state.password}
              placeholder="not_your_cats_name"
              onBlur={this.handleBlur('password')}/>
              <span className="required">*</span>
            </div>
          <button
            type="submit"
            disabled={isDisabled}
            className="button"
            style={styles.submitButton}>Submit</button>
        </form>
      </div>
    );
  }
}

export default Join;
