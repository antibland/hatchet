import React from 'react';
import ButtonLink from './ButtonLink';
import PropTypes from 'prop-types';

const JoinOrStartButton = props => (
  props.loggedIn
    ? <ButtonLink
        to='/create'
        classList='button primary'>
        Start Fight
      </ButtonLink>
    : <ButtonLink
        to='/join'
        classList='button primary'>
        Join Us
      </ButtonLink>
);

JoinOrStartButton.propTypes = {
  loggedIn: PropTypes.bool.isRequired
};

export default JoinOrStartButton;
