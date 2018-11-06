import React, { Component } from "react";
import PropTypes from "prop-types";
import { auth } from "./Auth";
import styled from "styled-components";
import Modal from "./shared/components/Modal";

const CancelButton = styled.button`
  padding: 1em 2.5em !important;
  font-size: 0.9rem !important;
  min-width: 200px !important;
  text-align: center;
  font-weight: bold;
`;

class CancelFight extends Component {
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

    // '/api/:userId/:fightId' => fightApi.cancelFight
    fetch(`/api/${auth.user.userid}/${fightId}`, {
      method: "DELETE"
    })
      .then(res => res.json())
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
    const { classes } = this.props;

    return (
      <>
        <CancelButton className={classes} onClick={this.handleClick}>
          Cancel
        </CancelButton>
        <Modal
          isOpen={isModalOpen}
          onAction={this.mainAction}
          onCancel={this.handleCancel}
          isDisabled={isServerBusy}
        >
          <p>
            Are you sure? Not to scare you, but deleting a fight cannot be
            undone.
          </p>
        </Modal>
      </>
    );
  }
}

CancelFight.defaultProps = {
  classes: "button primary"
};

CancelFight.propTypes = {
  fightId: PropTypes.string.isRequired,
  classes: PropTypes.string
};

export default CancelFight;
