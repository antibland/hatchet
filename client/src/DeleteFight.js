import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { auth } from './Auth';

class DeleteFight extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { fightId } = this.props;

    // '/api/:userId/:fightId' => fightApi.deleteFight
    if (window.confirm('Are you sure? Not to scare you, but deleting a fight cannot be undone.')) {
      fetch(`/api/${auth.user.userid}/${fightId}`, {
        method: 'DELETE'
      }).then(res => res.json())
        .then(data => {
          window.location.reload();
        });
    }
  }

  render() {

    return (
      <button
        className="button alt-color"
        onClick={this.handleClick}>Delete fight
      </button>
    )
  }
}

DeleteFight.propTypes = {
  fightId: PropTypes.string.isRequired
};

export default DeleteFight;
