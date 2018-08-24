import React, { Component } from "react";
import PropTypes from "prop-types";

class TextareaWithCountdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      isFieldValid: false
    };

    this.handleTextareaChange = this.handleTextareaChange.bind(this);
  }

  handleTextareaChange(e) {
    let count = e.target.value.length;
    let fieldVal = e.target.value;
    let fieldId = e.target.id;
    let isFieldValid =
      count > 0 && count <= this.props.countLimit ? true : false;

    this.setState({
      count,
      isFieldValid: isFieldValid
    });

    this.props.onInput(isFieldValid, fieldVal, fieldId);
  }

  render() {
    const { count, isFieldValid } = this.state;
    const { fieldName, ariaLabel, placeholder, countLimit } = this.props;
    const countRemaining = countLimit - count;
    const error = isFieldValid === false ? "error" : "";
    const classes = `charsRemaining ${error}`;

    return (
      <div className="countdownContainer">
        <textarea
          required
          onInput={this.handleTextareaChange}
          name={fieldName}
          id={fieldName}
          aria-label={ariaLabel}
          placeholder={placeholder}
        />
        <div className={classes}>{countRemaining}</div>
      </div>
    );
  }
}

TextareaWithCountdown.propTypes = {
  onInput: PropTypes.func.isRequired,
  countLimit: PropTypes.number.isRequired,
  fieldName: PropTypes.string.isRequired,
  placeholder: PropTypes.string
};

export default TextareaWithCountdown;
