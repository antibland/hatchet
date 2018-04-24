import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import utilities from '../../shared/utilities';

const HatchetList = props => (
  props.fights.map(fight => {
    let firstWord = fight.type.split(' ')[0].replace('\'', '');
    let categoryImg = utilities.getCategoryImage(firstWord);
    return (
      <li key={fight._id}>
        <Link className="button link" to={'/fight/' + fight._id}>
          { categoryImg }
          <span className="title">{fight.title}</span>
        </Link>
      </li>
    )
  })
);

HatchetList.defaultProps = {
  emptyMessage: "It's is lonely here. Not a hatchet in sight."
};

HatchetList.propTypes = {
  fights: PropTypes.array.isRequired
};

export default HatchetList;
