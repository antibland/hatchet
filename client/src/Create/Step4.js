import React from "react";
import shared from "./shared/styles";
import Avatar from "../shared/components/Avatar";
import Symbol from "../shared/components/Symbol";
import VersusImg from "../shared/components/VersusImg";
import PlaceholderText from "../shared/components/PlaceholderText";
import "../css/Fight.css";

const StepButtons = shared.stepButtons();
const SubmitButton = shared.submitButton();

const TimeRemaining = () => (
  <React.Fragment>
    <time>24:00</time>
    <span>PENDING</span>
  </React.Fragment>
);

function Step4(props) {
  const { beef, bother, takeAction, title, opponent } = props.fightData;
  return (
    <div className="stepContainer">
      <div className="inner relaxedWidth">
        <div className="fightContainer">
          <React.Fragment>
            <header className="fightContainerHeader">
              <Avatar>
                <Symbol name="challenger-hatchet-icon" />
              </Avatar>
              <h2 className="hatchetTitle">{title}</h2>
              <Avatar>
                <Symbol name="defender-shield-icon" />
              </Avatar>
            </header>

            <div className="fightTally">
              <div className="user1">
                <div className="fightMeter">
                  <span style={{ width: "50%" }} />
                </div>
              </div>
              <VersusImg />
              <div className="user2">
                <div className="fightMeter">
                  <span style={{ width: "50%" }} />
                </div>
              </div>
            </div>

            <div className="fightBody">
              <div className="user1">
                <h3>You</h3>
                <p className="fightText">{beef}</p>
                <p className="fightText">{bother}</p>
                <p className="fightText">{takeAction}</p>
              </div>

              <div className="fightTimeRemaining">
                <TimeRemaining />
              </div>

              <div className="user2">
                <h3>{opponent}</h3>
                <PlaceholderText />
              </div>
            </div>
          </React.Fragment>
          <StepButtons>
            {props.children}
            <SubmitButton
              type="submit"
              onClick={event => props.afterValid(event, {}, true)}
              className="button primary maxWidth"
            >
              Complete
            </SubmitButton>
          </StepButtons>
        </div>
      </div>
    </div>
  );
}

export default Step4;
