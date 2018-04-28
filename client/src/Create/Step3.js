import React, {Component} from 'react';

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
    this.setState({ title: e.target.value })

    if (count > 0) {
      this.setState({ isTitleValid: true })
    } else {
      this.setState({ isTitleValid: false })
    }

    this.setOverallValidity();
  }

  handleTextareaChange(e) {
    let count = e.target.value.length;
    this.setState({
      count,
      beef: e.target.value
    });

    if (count >= 0 && count <= 1000) {
      this.setState({ isBeefValid: true });
    } else {
      this.setState({ isBeefValid: false });
    }

    this.setOverallValidity();
  }

  render() {
    const role="note";
    const { count, isValid, beef, title } = this.state;
    const countRemaining = 1000 - count;
    const error = isValid === false ? 'error' : '';
    const classes = `charsRemaining ${error}`;

    return (
      <div className="stepContainer">
        <div className="inner">
          <h2>How about a title?</h2>
          <div className="fieldWrap">
            <input
              required
              id="title"
              name="title"
              valuee={this.state.title}
              maxLength="75"
              style={{ width: '100%' }}
              aria-label="Create title."
              onInput={this.handleTitleInput}
              type="text"/>
            <span role={role}>Creative titles get featured, so make it good.</span>
          </div>

          <h2>What happened?</h2>
          <div className="fieldWrap">
            <textarea
              required
              onInput={this.handleTextareaChange}
              name="beef"
              id="beef"
              aria-label="What happened?"
              placeholder="Your argument goes here">
            </textarea>
            <div className={classes}>{ countRemaining }</div>
          </div>

          <button
            type="submit"
            onClick={(event) => this.props.afterValid(
              event,
              { beef:beef, title:title },
              true
            )}
            style={{ display: 'block', margin: '2em auto 0'}}
            disabled={count <= 0 || !isValid}
            className="button primary">Complete
          </button>

        </div>
      </div>
    )
  }
}

export default Step3;
