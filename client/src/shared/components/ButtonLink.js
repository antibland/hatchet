import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ButtonLink = props => (
  <Link
    className={props.widgetType === 'button' ? 'button.primary' : '' }
    style={props.styles}
    className={props.classList}
    to={props.to}>{ props.children }
  </Link>
);

ButtonLink.defaultProps = {
  styles: {},
  classList: ''
};

ButtonLink.propTypes = {
  to: PropTypes.string.isRequired
};

export default ButtonLink;
