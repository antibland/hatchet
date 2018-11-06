import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Modal from "./shared/components/Modal";

const RemindButton = styled.button`
  padding: 1em 2.5em !important;
  font-size: 0.9rem !important;
  min-width: 200px !important;
  text-align: center;
  font-weight: bold;
`;

class RemindThem extends Component {
  constructor(props) {
    super(props);

    this.state = { isModalOpen: false, isServerBusy: false };
    this.handleClick = this.handleClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.mainAction = this.mainAction.bind(this);
  }

  handleClick() {
    this.setState({ isModalOpen: true });
  }

  handleCancel() {
    this.setState({ isModalOpen: false });
  }

  mainAction() {
    const { fightId } = this.props;
    this.setState({ isServerBusy: true });

    // '/api/:userId/:fightId' => fightApi.RemindThem
    fetch(`/api/remind/${fightId}`)
      .then(res => {
        return res.ok
          ? Promise.resolve()
          : Promise.reject({
              status: res.status,
              statusText: res.statusText
            });
      })
      .then(() => {
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
        this.setState({ isServerBusy: false });
      });
  }

  render() {
    const { isModalOpen, isServerBusy } = this.state;
    const { isDisabled, classes } = this.props;

    return (
      <>
        <RemindButton
          disabled={isDisabled}
          className={classes}
          onClick={this.handleClick}
        >
          Remind Them
        </RemindButton>
        <Modal
          isOpen={isModalOpen}
          onAction={this.mainAction}
          onCancel={this.handleCancel}
          isDisabled={isServerBusy}
        >
          <p>Are you sure? You can only do this once.</p>
        </Modal>
      </>
    );
  }
}

RemindThem.defaultProps = {
  classes: "button primary"
};

RemindThem.propTypes = {
  fightId: PropTypes.string.isRequired,
  classes: PropTypes.string,
  isDisabled: PropTypes.bool
};

export default RemindThem;
