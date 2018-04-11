import React, { Component } from 'react';

function validate(email) {
  // true means invalid, so our conditions got reversed
  return {
    email: email.length === 0
  };
}
class Resend extends Component {

  constructor() {
    super();

    this.state = {
      flash: {
        type: null,
        message: null
      },
      email: '',
      touched: {
        email: false,
        password: false,
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    let queryString = this.props.location.search.split('=')[1];
    this.setState({ email: queryString });
  }

  handleSubmit(e) {
    if (!this.canBeSubmitted()) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    fetch('/api/resend', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email
      })
    }).then(res => res.json())
      .then(data => {
        if (data.type === 'success') {
          this.setState({
            flash: {
              message: data.message,
              type: 'success'
            },
            email: ''
          })
        } else if (data.type === 'failure') {
          this.setState({
            flash: {
              message: data.message,
              type: 'error'
            }
          })
        }
      })
  }

  canBeSubmitted() {
    const errors = validate(this.state.email);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    return !isDisabled;
  }

  handleBlur = (field) => (e) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    })
  }

  handleChange(e) {
    if (e.target.id === 'email') {
      this.setState({ email: e.target.value });
    }
  }

  render() {

    let styles = {
      submitButton: {
        display: 'block',
        width: '100%'
      }
    };

    const errors = validate(this.state.email);
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    const shouldMarkError = (field) => {
      const hasError = errors[field];
      const shouldShow = this.state.touched[field];

      return hasError ? shouldShow : false;
    };

    let flashClasses = this.state.flash.type !== null
      ? `flash ${this.state.flash.type}`
      : '';

    let flashMessage = this.state.flash.message !== null
      ? <div className={flashClasses}>
          { this.state.flash.message }
        </div>
      : '';

    return (
      <div>
        <h2>Resend Verification Link</h2>
        <form
          action="/api/resend"
          method="POST"
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}>

          { flashMessage }

          <div className="required-field-wrapper">
            <input
              className={shouldMarkError('email') ? "error" : ""}
              required
              type="email"
              name="email"
              id="email"
              placeholder="account email address"
              aria-label="account email address"
              value={this.state.email}
              onBlur={this.handleBlur('email')}/>
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className="button primary"
            style={styles.submitButton}>Submit</button>

        </form>
      </div>
    );
  }
}

export default Resend;
