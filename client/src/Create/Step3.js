import React, { Component } from "react";
import styled, { css } from "styled-components";
import TextareaWithCountdown from "../shared/components/TextareaWithCountdown";

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

const FieldWrap = styled.div`
  margin: 0 2em;
  position: relative;
`;

const SubmitButton = styled.button`
  display: "block";
  margin: "2em auto 0;
`;

class Step3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      title: "",
      beef: "",
      isValid: false,
      isTitleValid: false,
      isBeefValid: false
    };

    this.handleTitleInput = this.handleTitleInput.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
  }

  setOverallValidity() {
    setTimeout(() => {
      const { isTitleValid, isBeefValid } = this.state;
      this.setState({ isValid: isTitleValid === true && isBeefValid === true });
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

  handleTextareaChange(fieldValidity, fieldVal) {
    this.setState({
      isBeefValid: fieldValidity,
      beef: fieldVal
    });

    this.setOverallValidity();
  }

  render() {
    const { isValid, beef, title } = this.state;
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
              fieldId="beef"
            />
          </FieldWrap>

          <SubmitButton
            type="submit"
            onClick={event =>
              this.props.afterValid(event, { beef: beef, title: title }, true)
            }
            disabled={!isValid}
            className="button primary"
          >
            Complete
          </SubmitButton>
        </div>
      </div>
    );
  }
}

export default Step3;
