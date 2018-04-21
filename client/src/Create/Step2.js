import React, { Component } from 'react';
import Categories from '../Categories';

class Step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false
    };
    this.setValidTrue = this.setValidTrue.bind(this);
  }

  setValidTrue() {
    this.setState({ isValid: true })
  }

  render() {
    const { isValid } = this.state;

    return (
      <div className="stepContainer">
        <div className="inner">
          <h2>Pick a Category</h2>
          <Categories mode='button' onClick={this.setValidTrue} />
          <button
            type="submit"
            onClick={this.props.afterValid}
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
