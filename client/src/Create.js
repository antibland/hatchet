import React, { Component } from 'react';
import Step1 from './Create/Step1';
import Step2 from './Create/Step2';
import Step3 from './Create/Step3';
import './css/Create.css';
import './css/Form.css';

const PreviousButton = props => (
  <div className="previousButtonWrap">
    <button
      type="submit"
      onClick={props.onClick}
      className="button alt-color">Back
    </button>
  </div>
)
class Wizard extends Component {
  constructor() {
    super();
    this.state = {
      currentStep: 1
    };

    this._prev = this._prev.bind(this);
    this._next = this._next.bind(this);
  }

  _next() {
    let currentStep = this.state.currentStep;

    if (currentStep >= 2) {
      currentStep = 3;
    } else {
      currentStep += 1;
    }

    this.setState({
      currentStep: currentStep
    });
  }

  _prev() {
    let currentStep = this.state.currentStep;
    if (currentStep <= 1) {
      currentStep = 1;
    } else {
      currentStep -= 1;
    }

    this.setState({
      currentStep: currentStep
    });
  }

  render() {
    let { currentStep } = this.state;
    let activeStep = `activeStep-${currentStep} stepsContainer`
    return (
      <React.Fragment>
      <div className={activeStep}>
        <Step1 currentStep={currentStep} afterValid={this._next} />
        <Step2 currentStep={currentStep} afterValid={this._next} />
        <Step3 currentStep={currentStep} afterValid={this._next} />
      </div>
      { currentStep > 1
        ? <PreviousButton onClick={this._prev}  />
        : ''
      }
      </React.Fragment>
    );
  }
}

export default Wizard;
