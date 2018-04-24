import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AcceptInvite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fightId: this.props.fightId,
      acceptedInvite: false
    };

    this.acceptInvite = this.acceptInvite.bind(this);
  }

  acceptInvite() {
    if (window.confirm('Are you sure? Once you confirm, the hatchet is live!')) {
      // app.get('/api/:fightId/fight/setLive', fightApi.setLive);
      fetch(`/api/${this.state.fightId}/fight/setLive`)
      .then(res => res.json())
      .then(data => {
        if (data.type === 'success') {
          this.setState({ acceptedInvite: true});
        }
      });
    }
  }

  render() {
    return (
      <div>
      { this.state.acceptedInvite === true
          ? <Link
              className="button"
              to={`/fight/${this.state.fightId}`}>
              Check it out
            </Link>
          : <button
              className='button'
              onClick={this.acceptInvite}>
              Accept invite
            </button>
      }
      </div>
    );
  }
}

AcceptInvite.propTypes = {
  fightId: PropTypes.string.isRequired
};

export default AcceptInvite;
