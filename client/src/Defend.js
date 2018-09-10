import React, { Component } from "react";
import PropTypes from "prop-types";
import { auth } from "./Auth";
import Modal from "./shared/components/Modal";
import Step1 from "./Defend/Step1";
import Step2 from "./Defend/Step2";
import styled from "styled-components";
import "./css/Create.css";
import "./css/Form.css";

const PreviousButton = props => (
  <button
    type="submit"
    onClick={props.onClick}
    className="button primary alt maxWidth"
  >
    Back
  </button>
);

const StepsContainer = styled.div`
  width: 200vw;
`;

export class Wizard extends Component {
  static TOTAL_STEPS = 2;

  static propTypes = {
    params: PropTypes.shape({
      fightId: PropTypes.string
    })
  };

  constructor() {
    super();
    this.state = {
      currentStep: 1,
      isModalOpen: false,
      fight: {}
    };

    this._prev = this._prev.bind(this);
    this._next = this._next.bind(this);
    this._gatherData = this._gatherData.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    const fightId = this.props.match.params.fightId;
    this.getFightDetails(fightId);
  }

  getFightDetails(fightId) {
    fetch(`/api/${fightId}/fight`)
      .then(res => res.json())
      .then(data => {
        this._gatherData(data.fight);
      })
      .catch(err => {
        console.error(err);
      });
  }

  _submitForm() {
    const {
      type,
      title,
      beef,
      opponent,
      bother,
      takeAction
    } = this.state.fight;

    // '/api/:userId/fight' => fightApi.newFight
    fetch(`/api/${auth.user.userid}/fight`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type,
        title,
        beef,
        opponent,
        bother,
        takeAction
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.type === "success") {
          this.setState({ isModalOpen: true });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  _next(e, data, completed = false) {
    e.preventDefault();

    this.setState(prevState => ({
      currentStep:
        prevState.currentStep >= Wizard.TOTAL_STEPS
          ? Wizard.TOTAL_STEPS
          : ++prevState.currentStep
    }));

    setTimeout(() => {
      this._gatherData(data, completed);
    }, 300);
  }

  _prev(e) {
    e.preventDefault();

    this.setState(prevState => ({
      currentStep: prevState.currentStep <= 1 ? 1 : --prevState.currentStep
    }));
  }

  _gatherData(data, completed) {
    if (completed === true) {
      this._submitForm();
    } else {
      Object.keys(data).forEach(key => {
        let newState = Object.assign({}, this.state);
        newState.fight[key] = data[key];
        this.setState(newState);
      });
    }
  }

  closeModal() {
    this.setState({ isModalOpen: false });
    this.props.history.push("/");
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  render() {
    let { currentStep, isModalOpen, fight } = this.state;
    let activeStep = `activeStep-${currentStep} stepsContainer`;
    let formAction = `/api/${auth.user.userid}/fight`;

    return (
      <React.Fragment>
        <form action={formAction} method="post" className="stepsForm">
          <StepsContainer className={activeStep}>
            <Step1
              currentStep={currentStep}
              fightData={fight}
              afterValid={this._next}
              side="defender"
            />
            <Step2
              currentStep={currentStep}
              fightData={fight}
              afterValid={this._next}
              side="defender"
            >
              <PreviousButton onClick={this._prev} />
            </Step2>
          </StepsContainer>
        </form>
        <Modal isOpen={isModalOpen} closeModal={this.closeModal}>
          <p>
            The fight was created. Everything worked. Now it's up to them. May
            your hatchet be swiftly buried.
          </p>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Wizard;