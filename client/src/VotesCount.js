import React from 'react'
import { PropTypes } from 'prop-types';

const VotesCount = props => {
  const { isLoggedIn, isExpired, isLive, showVotes, votes, votedFor, side } = props;

  return (
    isLoggedIn === true && (isExpired === true || (isLive && showVotes === true))
      ? <p className="totalVotes">Votes: {votes[side]}
          { side === votedFor
            ? <svg aria-hidden="true" className="tilted-ax">
                <use xlinkHref="/symbols/svg-defs.svg#tilted-ax" />
              </svg>
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
