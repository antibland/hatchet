import React, { Component } from 'react';
import Categories from '../Categories';

class Step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      type: ''
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(type) {
    this.setState({
      isValid: true,
      type
    })
  }

  render() {
    const { isValid, type } = this.state;

    return (
      <div className="stepContainer">
        <div className="inner">
          <h2>Pick a Category</h2>
          <Categories mode='button' onClick={this.handleButtonClick} />
          <button
            type="submit"
            onClick={(event) => this.props.afterValid(
              event,
              [`type:${type}`]
            )}
            style={{ display: 'block', margin: '2em auto 0'}}
            disabled={!isValid}
            className="button">Continue
          </button>
        </div>
      </div>
    )
  }
}

export default Step2;
