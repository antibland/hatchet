import React, { Component } from "react";
import styled, { css } from "styled-components";
import TextareaWithCountdown from "../shared/components/TextareaWithCountdown";
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

class Step3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { isValid, beef, bother, takeAction, title } = this.state;
    const opponent = this.props.fightData.opponent;

    return (
      <div className="stepContainer">
        <div className="inner">
          <PageH1>Enter a title for your fight</PageH1>
          <FieldWrap>
            <input
              required
              id="title"
              name="title"
              value={this.state.title}
              maxLength="75"
              className="fullWidth"
              aria-label="Make it intriguing without giving too much away."
              placeholder="Make it intriguing without giving too much away!"
              onInput={this.handleTitleInput}
              type="text"
            />
          </FieldWrap>

          <PageH2>
            What did <Highlight>{opponent}</Highlight> do?
          </PageH2>
          <FieldWrap>
            <TextareaWithCountdown
              countLimit={1000}
              onInput={this.handleTextareaChange}
              ariaLabel={`What did ${opponent} do?`}
              placeholder={`${opponent}…`}
              fieldName="beef"
            />
          </FieldWrap>

          <PageH2>
            Why does this bother <Highlight>you</Highlight>?
          </PageH2>
          <FieldWrap>
            <TextareaWithCountdown
              countLimit={1000}
              onInput={this.handleTextareaChange}
              ariaLabel={`What did ${opponent} do?`}
              placeholder={`This is where you really get to plead your case against ${opponent}. Tell the voters why this bothers you so much.`}
              fieldName="bother"
            />
          </FieldWrap>

          <PageH2>
            What should <Highlight>{opponent}</Highlight> do now?
          </PageH2>
          <FieldWrap>
            <TextareaWithCountdown
              countLimit={1000}
              onInput={this.handleTextareaChange}
              ariaLabel={`What should ${opponent} do now?`}
              placeholder="What is it that you really want? An apology? Financial restitution? A change in behavior?"
              fieldName="takeAction"
            />
          </FieldWrap>

          <StepButtons>
            {this.props.children}
            <SubmitButton
              type="submit"
              onClick={event =>
                this.props.afterValid(
                  event,
                  { beef, bother, takeAction, title },
                  true
                )
              }
              disabled={!isValid}
              className="button primary"
            >
              Complete
            </SubmitButton>
          </StepButtons>
        </div>
      </div>
    );
  }
}

export default Step3;
