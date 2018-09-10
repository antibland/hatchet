import React, { Component } from "react";
import styled, { css } from "styled-components";
import TextareaWithCountdown from "../shared/components/TextareaWithCountdown";
import Loading from "../Loading.js";
import shared from "./shared/styles";

const StepButtons = shared.stepButtons();
const SubmitButton = shared.submitButton();
const FieldWrap = shared.fieldWrap();

const Highlight = styled.span`
  color: var(--red);
`;

const headerStyles = css`
  color: var(--teal);
  margin-bottom: 5px;
`;

const PageH1 = styled.h1`
  font-size: 27px;
  ${headerStyles};
`;

const PageH2 = styled.h2`
  ${headerStyles};
`;

const PageTitle = styled.h2`
  color: black;
  font-style: italic;
`;

const AttackerStatement = styled.div`
  font-style: italic;
  padding-bottom: 0.5em;
`;

class Step3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      count: 0,
      title: "",
      beef: "",
      bother: "",
      takeAction: "",
      isValid: false,
      isTitleValid: false,
      isBeefValid: false,
      isBotherYouValid: false,
      isActionValid: false,
      side: "",
      copiesBeef: "",
      copiesBother: "",
      copiesTakeAction: ""
    };

    this.handleTitleInput = this.handleTitleInput.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    this.locateField = this.locateField.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.props.side === "defender") {
        this.setState({
          side: this.props.side,
          title: this.props.fightData.title,
          beef: this.props.fightData.text.attacker.do,
          bother: this.props.fightData.text.attacker.bother,
          takeAction: this.props.fightData.text.attacker.action,
          copiesBeef: this.props.fightData.text.attacker.do,
          copiesBother: this.props.fightData.text.attacker.bother,
          copiesTakeAction: this.props.fightData.text.attacker.action,
          isTitleValid: true
        });
      }
      this.setState({ loading: false });
    }, 200);
  }

  setOverallValidity() {
    setTimeout(() => {
      const {
        isTitleValid,
        isBeefValid,
        isBotherYouValid,
        isActionValid
      } = this.state;
      this.setState({
        isValid:
          isTitleValid === true &&
          isBeefValid === true &&
          isBotherYouValid === true &&
          isActionValid === true
      });
    }, 50);
  }

  handleTitleInput(e) {
    let count = e.target.value.length;

    this.setState({
      title: e.target.value,
      isTitleValid: count > 0 ? true : false
    });

    this.setOverallValidity();
  }

  locateField(fieldId) {
    switch (fieldId) {
      case "beef":
        return "isBeefValid";
      case "bother":
        return "isBotherYouValid";
      case "takeAction":
        return "isActionValid";
      default:
        return "";
    }
  }

  handleTextareaChange(fieldValidity, fieldVal, fieldId) {
    const validField = this.locateField(fieldId);

    this.setState({
      [validField]: fieldValidity,
      [fieldId]: fieldVal
    });

    this.setOverallValidity();
  }

  render() {
    const {
      isValid,
      beef,
      bother,
      takeAction,
      title,
      side,
      loading
    } = this.state;
    const opponent = side !== "defender" ? this.props.fightData.opponent : "";
    const attacker =
      side === "defender" ? this.props.fightData.antagonist.username : "";
    let labels = {
      do:
        side === "defender"
          ? `Why is ${attacker} wrong?`
          : `What did ${opponent} do?`,
      bother:
        side === "defender"
          ? "Why are you right?"
          : "Why does this bother you?",
      takeAction:
        side === "defender"
          ? `Why should ${attacker} do now?`
          : `What should ${opponent} do now?`
    };

    let placeholders = {
      do:
        side === "defender"
          ? `Is ${attacker} accurate? Tell us about it.`
          : `${opponent}…`,
      bother:
        side === "defender"
          ? `Time to defend yourself! Convince the community of your innocence. Better yet, convince them that ${attacker} is wrong.`
          : `This is where you really get to plead your case against ${opponent}. Tell the voters why this bothers you so much.`,
      takeAction:
        side === "defender"
          ? `Why should ${attacker} do now?`
          : `What should ${opponent} do now?`
    };

    const fieldTitle = (
      <input
        required
        id="title"
        name="title"
        defaultValue={title}
        maxLength="75"
        className="fullWidth"
        aria-label="Make it intriguing without giving too much away."
        placeholder="Make it intriguing without giving too much away!"
        onInput={this.handleTitleInput}
        type="text"
      />
    );

    return (
      <div className="stepContainer">
        {loading === true ? (
          <Loading />
        ) : (
          <div className="inner">
            {side !== "defender" ? (
              <React.Fragment>
                <PageH1>Enter a title for your fight</PageH1>
                <FieldWrap>{fieldTitle}</FieldWrap>
              </React.Fragment>
            ) : (
              <PageTitle>{title}</PageTitle>
            )}

            {side !== "defender" ? (
              <PageH2>
                What did <Highlight>{opponent}</Highlight> do?
              </PageH2>
            ) : (
              <AttackerStatement>
                &ldquo;
                {this.state.copiesBeef}
                &rdquo;
              </AttackerStatement>
            )}

            <FieldWrap>
              <TextareaWithCountdown
                countLimit={1000}
                onInput={this.handleTextareaChange}
                ariaLabel={labels.do}
                placeholder={placeholders.do}
                fieldName="beef"
              />
            </FieldWrap>

            <PageH2>
              {side !== "defender" ? (
                <React.Fragment>
                  Why does this bother <Highlight>you</Highlight>?
                </React.Fragment>
              ) : (
                <React.Fragment>
                  Why are <Highlight>you</Highlight> right?
                </React.Fragment>
              )}
            </PageH2>
            <FieldWrap>
              <TextareaWithCountdown
                countLimit={1000}
                onInput={this.handleTextareaChange}
                ariaLabel={labels.bother}
                placeholder={placeholders.bother}
                fieldName="bother"
              />
            </FieldWrap>

            <PageH2>
              {side !== "defender" ? (
                <React.Fragment>
                  What should <Highlight>{opponent}</Highlight> do now?
                </React.Fragment>
              ) : (
                <React.Fragment>
                  What should <Highlight>{attacker}</Highlight> do now?
                </React.Fragment>
              )}
            </PageH2>
            <FieldWrap>
              <TextareaWithCountdown
                countLimit={1000}
                onInput={this.handleTextareaChange}
                ariaLabel={labels.takeAction}
                placeholder="What is it that you really want? An apology? Financial restitution? A change in behavior?"
                fieldName="takeAction"
              />
            </FieldWrap>

            <StepButtons>
              {this.props.children}
              <SubmitButton
                type="submit"
                onClick={event =>
                  this.props.afterValid(event, {
                    beef,
                    bother,
                    takeAction,
                    title
                  })
                }
                disabled={!isValid}
                className="button primary"
              >
                Preview
              </SubmitButton>
            </StepButtons>
          </div>
        )}
      </div>
    );
  }
}

export default Step3;
