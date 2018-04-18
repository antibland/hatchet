import React, { Component } from 'react';

class Step3 extends Component {
  render() {
    if (this.props.currentStep !== 3) {
      return null;
    }

    return (
      <h2>Step 3</h2>
    )
  }
}

export default Step3;
