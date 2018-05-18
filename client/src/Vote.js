import React from 'react';
import PropTypes from 'prop-types';
import { auth } from './Auth';

const Vote = props => {
  function makeVote() {
    fetch(`/api/${props.fightId}/vote`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        side: props.side,
        voterId: auth.user.userid
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.type === 'success') {
        props.afterVote(data.votes);
      }
    });
  }

  return (
    <button
      className='button primary'
      onClick={makeVote}
    >Vote for {props.username}
    </button>
  );
};

Vote.propTypes = {
  fightId: PropTypes.string.isRequired,
  side: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  afterVote: PropTypes.func
};

export default Vote;
