import React from 'react';
import BottomMenu from './BottomMenu';
import PropTypes from 'prop-types';

const Footer = props => (
  <footer className={props.isAuthenticated === false
    ? 'loggedOut'
    : ''}>
    <BottomMenu />
  </footer>
);

export default Footer;

Footer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};
