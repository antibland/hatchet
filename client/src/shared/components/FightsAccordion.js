import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import AcceptInvite from './AcceptInvite';

const FightsAccordion = props => (
  <div className="fightlist tablist">
  { props.obj.length
    ? props.obj.map((fight, index) => {
      return (
        <div className="tab" key={fight._id}>
          <input id={`tab_${index}_${props.indexModifier}`} type="checkbox" name="tabs" />
          <label className="tab-label" htmlFor={`tab_${index}_${props.indexModifier}`}>{fight.title}</label>
          <div className="tab-content">
            <div className="tab-content-inner">
              <div className="meta">
                <span className="created">
                  <strong>Created: </strong>
                  <Moment fromNow format='MMMM Do YYYY'>{fight.created_at}</Moment>
                </span>
                <span className="type"><strong>Type: </strong>A {fight.type} fight.</span>
                <span className="text">{fight.text.for}</span>
                { fight.isLive
                  ? <Link className="button" to={'/fight/' + fight._id}>View the fight</Link>
                  : <FightAction action={props.action} fightId={fight._id} />
                }
              </div>
            </div>
          </div>
        </div>
      )
    })
    : props.emptyResponse
  }
  </div>
);

FightsAccordion.defaultProps = {
  action: 'link to fight',
  emptyResponse: '',
};

FightsAccordion.propTypes = {
  obj: PropTypes.array.isRequired,
  indexModifier: PropTypes.string.isRequired
};

// The fight is not live yet. Inform the user what happens next
const FightAction = props => (
  props.action === 'link to fight'
    ? <div>
        <p className="system-message">
          <svg aria-hidden="true" className="system-tip">
            <use xlinkHref="./symbols/svg-defs.svg#system-tip" />
          </svg>
          We are still waiting to hear from that coward to respond. Remain patient.
        </p>
        <Link className="button" to={'/fight/' + props.fightId}>View fight</Link>
      </div>
    : <div>
        <AcceptInvite fightId={props.fightId} />
      </div>
);

export default FightsAccordion;
