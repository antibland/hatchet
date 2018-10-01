import React, { Component } from "react";
import shared from "./shared/styles";
import Avatar from "../shared/components/Avatar";
import Symbol from "../shared/components/Symbol";
import VersusImg from "../shared/components/VersusImg";
import PlaceholderText from "../shared/components/PlaceholderText";
import Loading from "../Loading.js";
import "../css/Fight.css";

const StepButtons = shared.stepButtons();
const SubmitButton = shared.submitButton();

const TimeRemaining = () => (
  <React.Fragment>
    <time>24:00</time>
    <span>PENDING</span>
  </React.Fragment>
);

class Step4 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user1_username: "",
      user1_beef: "",
      user1_bother: "",
      user1_takeAction: "",
      user2_username: "",
      user2_beef: "",
      user2_bother: "",
      user2_takeAction: "",
      side: ""
    };
  }

  shouldComponentUpdate(nextProps) {
    return nextProps !== this.props;
  }

  componentDidUpdate(prevProps) {
    const side = this.props.side || "";
    let proceed = false;
    if (side === "defender" && this.props.fightData.antagonist) {
      proceed = true;
    } else if (side === "" && this.props.fightData.beef) {
      proceed = true;
    }

    if (proceed) {
      this.setState({
        side,
        loading: false,
        title: prevProps.fightData.title,
        user1_username:
          side === "defender"
            ? this.props.fightData.antagonist.username
            : "You",
        user1_beef:
          side === "defender"
            ? this.props.fightData.text.attacker.do
            : this.props.fightData.beef,
        user1_bother:
          side === "defender"
            ? this.props.fightData.text.attacker.bother
            : this.props.fightData.bother,
        user1_takeAction:
          side === "defender"
            ? this.props.fightData.text.attacker.action
            : this.props.fightData.takeAction,
        user2_username: side === "defender" ? "You" : "",
        user2_beef: side === "defender" ? this.props.fightData.beef : "",
        user2_bother: side === "defender" ? this.props.fightData.bother : "",
        user2_takeAction:
          side === "defender" ? this.props.fightData.takeAction : ""
      });
    }
  }

  render() {
    const { side, loading } = this.state;

    return (
      <div className="stepContainer">
        {loading === true ? (
          <Loading />
        ) : (
          <div className="inner relaxedWidth">
            <div className="fightContainer">
              <React.Fragment>
                <header className="fightContainerHeader">
                  <Avatar>
                    <Symbol name="challenger-hatchet-icon" />
                  </Avatar>
                  <h2 className="hatchetTitle">{this.props.fightData.title}</h2>
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
                    <h3>{this.state.user1_username}</h3>
                    <p className="fightText">{this.state.user1_beef}</p>
                    <p className="fightText">{this.state.user1_bother}</p>
                    <p className="fightText">{this.state.user1_takeAction}</p>
                  </div>

                  <div className="fightTimeRemaining">
                    <TimeRemaining isExpired={false} activatedAt={Date.now()} />
                  </div>

                  <div className="user2">
                    {side === "defender" ? (
                      <React.Fragment>
                        <h3>{this.state.user2_username}</h3>
                        <p className="fightText">{this.state.user2_beef}</p>
                        <p className="fightText">{this.state.user2_bother}</p>
                        <p className="fightText">
                          {this.state.user2_takeAction}
                        </p>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <h3>Someone</h3>
                        <PlaceholderText />
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </React.Fragment>
              <StepButtons>
                {this.props.children}
                <SubmitButton
                  type="submit"
                  onClick={event => this.props.afterValid(event, {}, true)}
                  className="button primary maxWidth"
                >
                  Complete
                </SubmitButton>
              </StepButtons>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Step4;
