import React from 'react'
import Avatar from '../shared/components/Avatar';
import PropTypes from 'prop-types';

const SlotsYou = props => {
  return (
    <div className="you">
      { props.currentAvatarUrl === null || props.currentAvatarUrl === ''
        ? <Avatar imgpath='/user.png' width='94px' height='94px' />
        : <Avatar imgpath={props.currentAvatarUrl}>
            <span className="username">{props.you}</span>
          </Avatar>
      }
    </div>
  )
};

SlotsYou.defaultProps = {
  currentAvatarUrl: '',
};

SlotsYou.propTypes = {
  you: PropTypes.string.isRequired
};

export default SlotsYou;
