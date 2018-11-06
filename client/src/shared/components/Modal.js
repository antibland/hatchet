import React from "react";
import PropTypes from "prop-types";
import LoadingText from "./LoadingText";
import styled from "styled-components";
import "../../css/Modal.css";

const ModalButtons = styled.div`
  display: flex;
  > * {
    flex: 1;
  }
`;

const CancelButton = styled.button`
  color: white;
  font-size: 1em;
`;

class Modal extends React.Component {
  render() {
    const {
      style,
      children,
      onAction,
      onCancel,
      onCancelText,
      isOpen
    } = this.props;
    if (isOpen === false) return null;

    const CancelButtonWrapper = () => (
      <CancelButton
        disabled={this.props.isDisabled}
        className="removeDefaultButtonStyles"
        onClick={onCancel}
      >
        {onCancelText}
      </CancelButton>
    );

    const ActionButton = () => (
      <button
        disabled={this.props.isDisabled}
        onClick={onAction}
        className="button primary"
      >
        <LoadingText isDisabled={this.props.isDisabled}>Ok</LoadingText>
      </button>
    );

    return (
      <div className="modal">
        <div className="content" style={style}>
          {children}

          <ModalButtons>
            {onAction && <ActionButton />}
            {onCancel && <CancelButtonWrapper />}
          </ModalButtons>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  onAction: PropTypes.func,
  onCancel: PropTypes.func,
  onCancelText: PropTypes.string,
  style: PropTypes.object
};

Modal.defaultProps = {
  onCancelText: "Cancel",
  isDisabled: false
};

export default Modal;
