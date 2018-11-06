import React, { Component } from "react";
import PropTypes from "prop-types";
import { auth } from "./Auth";
import styled from "styled-components";
import Modal from "./shared/components/Modal";

const Button = styled.button`
  padding: 1em 2.5em !important;
  font-size: 0.9rem !important;
  min-width: 200px !important;
  text-align: center;
  font-weight: bold;
`;

class SurrenderButton extends Component {
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

    // '/api/:userId/:fightId' => fightApi.surrender
    fetch(`/api/${auth.user.userid}/${fightId}`, {
      method: "PATCH"
    })
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
    const { opponent } = this.props;

    return (
      <>
        <Button
          className={this.props.classes}
          onClick={this.handleClick}
          {...this.props}
        >
          Surrender
        </Button>
        <Modal
          isOpen={isModalOpen}
          onAction={this.mainAction}
          onCancel={this.handleCancel}
          isDisabled={isServerBusy}
        >
          <p>
            Are you sure? You're making things pretty easy for{" "}
            <strong>{opponent}</strong>
          </p>
        </Modal>
      </>
    );
  }
}

SurrenderButton.defaultProps = {
  classes: "button primary"
};

SurrenderButton.propTypes = {
  fightId: PropTypes.string.isRequired,
  classes: PropTypes.string
};

export default SurrenderButton;
