import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';

export class StartHatchet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.startHatchet = this.startHatchet.bind(this);
  }

  startHatchet() {
    if (window.confirm('Are you sure? Once you confirm, the hatchet is live!')) {
      // '/api/:fightId/fight/setLive' => fightApi.setLive
      fetch(`/api/${this.props.fightId}/fight/setLive`,  {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          textAgainst: this.props.textAgainst
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.type === 'success') {
          this.openModal();
        }
      });
    }
  }

  closeModal() {
    this.setState({ isModalOpen: false });
    window.location.reload();
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  render() {
    const { isModalOpen } = this.state;

    return (
      <React.Fragment>
        <button
          className='button primary'
          disabled={!this.props.isDisabled}
          onClick={this.startHatchet}>Start Hatchet
        </button>
        <Modal isOpen={isModalOpen} closeModal={this.closeModal}>
          <p>The Hatchet is live! You've got 24 hours to amass as many votes as possible. Share the
             link and cross your fingers.</p>
        </Modal>
      </React.Fragment>
    )
  }
}

StartHatchet.propTypes = {
  fightId: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  textAgainst: PropTypes.string.isRequired
};

export default StartHatchet;
