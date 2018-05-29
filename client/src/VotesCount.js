import React from 'react'
import { PropTypes } from 'prop-types';
import Symbol from './shared/components/Symbol';

const VotesCount = props => {
  const { isLoggedIn, isExpired, isLive, showVotes, votes, votedFor, side } = props;

  return (
    isLoggedIn === true && (isExpired === true || (isLive && showVotes === true))
      ? <p className="totalVotes">Votes: {votes[side]}
          { side === votedFor
            ? <Symbol name='tilted-ax' />
            : ''
          }
        </p>
      : ''
  )
};

VotesCount.propTypes = {
  side: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};

export default VotesCount;
