import React from 'react';
import BottomMenu from './BottomMenu';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

const BottomMenuWithRouter = withRouter(BottomMenu);

const Footer = props => (
  <footer className={props.isAuthenticated === false
    ? 'loggedOut'
    : ''}>
    <BottomMenuWithRouter />
  </footer>
);

export default Footer;

Footer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};
