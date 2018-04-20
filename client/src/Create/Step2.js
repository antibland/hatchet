import React, { Component } from 'react';
import Categories from '../Categories';

class Step2 extends Component {
  render() {
    if (this.props.currentStep !== 2) {
      return null;
    }

    return (
      <div className="stepContainer">
        <h2>Pick a Category</h2>
        <Categories />
      </div>
    )
  }
}

export default Step2;
