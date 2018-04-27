import React, { Component } from 'react';
import { auth } from './Auth';
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
      currentStep: 1,
      fight: {
        type: '',
        title: '',
        beef: '',
        opponent: ''
      }
    };

    this._prev = this._prev.bind(this);
    this._next = this._next.bind(this);
    this._gatherData = this._gatherData.bind(this);
  }

  _submitForm(e) {
    const { type, title, beef, opponent } = this.state.fight;
    e.preventDefault();
    // '/api/:userId/fight' => fightApi.newFight
    // fetch(`/api/${auth.user.userid}/fight`, {
    //   method: 'POST',
    //   header: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     type,
    //     title,
    //     beef,
    //     opponent
    //   })
    // })
  }

  _next(e, data) {
    e.preventDefault();
    let currentStep = this.state.currentStep;

    if (currentStep >= 2) {
      currentStep = 3;
    } else {
      currentStep += 1;
    }

    this.setState({
      currentStep: currentStep
    });

    setTimeout(() => {
      if (data) {
        this._gatherData(data);
      }
    }, 300)
  }

  _prev(e) {
    e.preventDefault();
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

  _gatherData(data) {
    data.forEach(element => {
      let [key, val]= element.split(':');
      let newState = Object.assign({}, this.state);
      newState.fight[key] = val;
      this.setState(newState);
    });

    console.log(this.state)
  }

  render() {
    let { currentStep } = this.state;
    let activeStep = `activeStep-${currentStep} stepsContainer`;
    let formAction = `/api/${auth.user.userid}/fight`;
    return (
      <form action={formAction} method="post" className="stepsForm">
        <div className={activeStep}>
          <Step1 sendData={this._getData} currentStep={currentStep} afterValid={this._next} />
          <Step2 sendData={this._getData} currentStep={currentStep} afterValid={this._next} />
          <Step3 sendData={this._getData} currentStep={currentStep} afterValid={this._submitForm} />
        </div>
        { currentStep > 1
          ? <PreviousButton onClick={this._prev}  />
          : ''
        }
      </form>
    );
  }
}

export default Wizard;
