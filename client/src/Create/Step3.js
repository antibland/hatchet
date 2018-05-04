import React, {Component} from 'react';
import TextareaWithCountdown from '../shared/components/TextareaWithCountdown';
class Step3 extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      title: '',
      beef: '',
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
      this.setState({ isValid: isTitleValid === true && isBeefValid === true })
    }, 50);
  }

  handleTitleInput(e) {
    let count = e.target.value.length;

    this.setState({
      title: e.target.value,
      isTitleValid: (count > 0) ? true : false
    });

    this.setOverallValidity();
  }

  handleTextareaChange(fieldValidity, fieldVal) {
    this.setState({
      isBeefValid: fieldValidity,
      beef: fieldVal
    })

    this.setOverallValidity();
  }

  render() {
    const role="note";
    const { isValid, beef, title } = this.state;

    return (
      <div className="stepContainer">
        <div className="inner">
          <h2>How about a title?</h2>
          <div className="fieldWrap">
            <input
              required
              id="title"
              name="title"
              value={this.state.title}
              maxLength="75"
              className="fullWidth"
              aria-label="Create title."
              onInput={this.handleTitleInput}
              type="text"/>
            <span role={role}>Creative titles get featured, so make it good.</span>
          </div>

          <h2>What happened?</h2>
          <div className="fieldWrap">
            <TextareaWithCountdown
              countLimit={1000}
              onInput={this.handleTextareaChange}
              ariaLabel="What happened"
              placeholder="Your argument goes here"
              fieldName="beef"
              fieldId="beef"
            />
          </div>

          <button
            type="submit"
            onClick={(event) => this.props.afterValid(
              event,
              { beef:beef, title:title },
              true
            )}
            style={{ display: 'block', margin: '2em auto 0'}}
            disabled={!isValid}
            className="button primary">Complete
          </button>

        </div>
      </div>
    )
  }
}

export default Step3;
