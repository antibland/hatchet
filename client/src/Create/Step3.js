import React, {Component} from 'react';
class Step3 extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      isValid: true
    };

    this.handleTextareaChange = this.handleTextareaChange.bind(this);
  }

  handleTextareaChange(e) {
    let count = e.target.value.length;
    this.setState({ count });

    if (count >= 0 && count <= 1000) {
      this.setState({ isValid: true });
    } else {
      this.setState({ isValid: false });
    }
  }

  render() {
    const { count, isValid } = this.state;
    const countRemaining = 1000 - count;
    const error = isValid === false ? 'error' : '';
    const classes = `charsRemaining ${error}`;

    return (
      <div className="stepContainer">
        <div className="inner">
          <h2>What happened?</h2>

          <div className="beefWrap">
            <textarea
              required
              onInput={this.handleTextareaChange}
              onBlur={this.handleTextareaChange}
              name="beef"
              id="beef"
              placeholder="Your argument goes here">
            </textarea>
            <div className={classes}>{ countRemaining }</div>
          </div>

          <button
            type="submit"
            onClick={this.props.afterValid}
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
