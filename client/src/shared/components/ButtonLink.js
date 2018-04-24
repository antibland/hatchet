import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const ButtonLink = props => (
  <Link
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
