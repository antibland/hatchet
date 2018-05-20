import React from 'react'
import { PropTypes } from 'prop-types';

const VotesCount = props => {
  return (
    props.isLive && props.showVotes === true
      ? <p className="totalVotes">Votes: {props.votes}
          { props.side === props.votedFor
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
  votes: PropTypes.number.isRequired
};

export default VotesCount;
