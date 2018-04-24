import React, {Component} from 'react';
import RichTextEditor from 'react-rte';
import PropTypes from 'prop-types';

class Step3 extends Component {
  constructor() {
    super();
    this.state = {
      value: RichTextEditor.createEmptyValue(),
      countRemaining: 1011,
      isValid: false
    };

    this.onChange = this.onChange.bind(this);
  }
  static propTypes = {
    onChange: PropTypes.func
  };

  onChange(value) {
    this.setState({
      value,
      countRemaining: Number(1000 - value.toString('html').length)
    });

    const { countRemaining } = this.state;

    if (countRemaining > 0 && countRemaining <= 1000) {
      this.setState({ isValid: true })
    } else {
      this.setState({ isValid: false })
    }

    if (this.props.onChange) {
      console.log('changed')
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      console.log('value', value)
      this.props.onChange(
        value.toString('html')
      );
    }
  }

  render() {
    const toolbarConfig = {
      // Optionally specify the groups to display (displayed in the order listed).
      display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS'],
      INLINE_STYLE_BUTTONS: [
        {label: 'Bold', style: 'BOLD'},
        {label: 'Italic', style: 'ITALIC'},
        {label: 'Underline', style: 'UNDERLINE'}
      ],
      BLOCK_TYPE_DROPDOWN: [
        {label: 'Normal', style: 'unstyled'},
        {label: 'Heading Large', style: 'header-one'},
        {label: 'Heading Medium', style: 'header-two'},
        {label: 'Heading Small', style: 'header-three'}
      ],
      BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'}
      ]
    };

    const { countRemaining, isValid } = this.state;
    const error = isValid === false ? 'error' : '';
    const classes = `charsRemaining ${error}`;

    return (
      <div className="stepContainer">
        <div className="inner">
          <h2>What happened?</h2>
          <RichTextEditor
            toolbarConfig={toolbarConfig}
            value={this.state.value}
            onChange={this.onChange}
            placeholder="Your argument goes here"
          />
          <div className={classes}>{ countRemaining }</div>
        </div>
      </div>
    )
  }
}

export default Step3;
