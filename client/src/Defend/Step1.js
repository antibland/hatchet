import React, { Component } from "react";
import styled, { css } from "styled-components";
import TextareaWithCountdown from "../shared/components/TextareaWithCountdown";
import Loading from "../Loading.js";
import shared from "../Create/shared/styles";

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

class Step1 extends Component {
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
      isActionValid: false
    };

    this.handleTitleInput = this.handleTitleInput.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    this.locateField = this.locateField.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: false, isTitleValid: true });
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
    const { isValid, loading } = this.state;
    const title = this.props.fightData.title;
    let attacker =
      this.props.fightData.antagonist &&
      this.props.fightData.antagonist.username;

    let beef =
      this.props.fightData.text && this.props.fightData.text.attacker.do;

    let labels = attacker
      ? {
          do: `Why is ${attacker} wrong?`,
          bother: "Why are you right?",
          takeAction: `Why should ${attacker} do now?`
        }
      : null;

    let placeholders = attacker
      ? {
          do: `Is ${attacker} accurate? Tell us about it.`,
          bother: `Time to defend yourself! Convince the community of your innocence. Better yet, convince them that ${attacker} is wrong.`,
          takeAction: `Why should ${attacker} do now?`
        }
      : null;

    return (
      <div className="stepContainer">
        {loading === true ||
        typeof this.props.fightData.text === "undefined" ? (
          <Loading />
        ) : (
          <div className="inner">
            {title && <PageTitle>{title}</PageTitle>}

            <AttackerStatement>“{beef}”</AttackerStatement>

            <FieldWrap>
              <TextareaWithCountdown
                countLimit={1000}
                onInput={this.handleTextareaChange}
                ariaLabel={labels && labels.do}
                placeholder={placeholders && placeholders.do}
                fieldName="beef"
              />
            </FieldWrap>

            <PageH2>
              Why are <Highlight>you</Highlight> right?
            </PageH2>
            <FieldWrap>
              <TextareaWithCountdown
                countLimit={1000}
                onInput={this.handleTextareaChange}
                ariaLabel={labels && labels.bother}
                placeholder={placeholders && placeholders.bother}
                fieldName="bother"
              />
            </FieldWrap>

            <PageH2>
              What should <Highlight>{attacker}</Highlight> do now?
            </PageH2>
            <FieldWrap>
              <TextareaWithCountdown
                countLimit={1000}
                onInput={this.handleTextareaChange}
                ariaLabel={labels && labels.takeAction}
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
                    beef: this.state.beef,
                    bother: this.state.bother,
                    takeAction: this.state.takeAction,
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

export default Step1;
