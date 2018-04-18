import React, { Component } from 'react';

class Step2 extends Component {
  render() {
    if (this.props.currentStep !== 2) {
      return null;
    }

    return (
      <h2>Step 2</h2>
    )
  }
}

export default Step2;
