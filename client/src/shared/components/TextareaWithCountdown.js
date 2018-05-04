import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TextareaWithCountdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      isFieldValid: false
    }

    this.handleTextareaChange = this.handleTextareaChange.bind(this);
  }

  handleTextareaChange(e) {
    let count = e.target.value.length;
    let fieldVal = e.target.value;
    let isFieldValid = (count > 0 && count <= this.props.countLimit)
                        ? true
                        : false;

    this.setState({
      count,
      isFieldValid: isFieldValid
    });

    this.props.onInput(isFieldValid, fieldVal);
  }

  render() {
    const { count, isFieldValid } = this.state;
    const {fieldName, fieldId, ariaLabel, placeholder, countLimit } = this.props;
    const countRemaining = countLimit - count;
    const error = isFieldValid === false ? 'error' : '';
    const classes = `charsRemaining ${error}`;

    return (
      <div style={{ position: 'relative'}}>
        <textarea
          required
          onInput={this.handleTextareaChange}
          name={fieldName}
          id={fieldId}
          aria-label={ariaLabel}
          placeholder={placeholder}>
        </textarea>
        <div className={classes}>{ countRemaining }</div>
      </div>
    )
  }
}

TextareaWithCountdown.propTypes = {
  onInput: PropTypes.func.isRequired,
  countLimit: PropTypes.number.isRequired,
  fieldName: PropTypes.string.isRequired,
  fieldId: PropTypes.string.isRequired,
  placeholder: PropTypes.string
};

export default TextareaWithCountdown;
