import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import "../../css/Modal.css";

const ModalButtons = styled.div`
  display: flex;
  > * {
    flex: 1;
  }
`;

const CancelButton = styled.button`
  color: var(--teal);
  font-size: 1em;
`;

class Modal extends React.Component {
  render() {
    const { style, children, onAction, onCancel, isOpen } = this.props;
    if (isOpen === false) return null;

    const CancelButtonWrapper = () => (
      <CancelButton className="removeDefaultButtonStyles" onClick={onCancel}>
        Skip{" "}
        <span role="img" aria-label="Indifferent emoji">
          😑
        </span>
      </CancelButton>
    );

    const ActionButton = () => (
      <button onClick={onAction} className="button primary">
        Ok
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
  onAction: PropTypes.func,
  onCancel: PropTypes.func,
  style: PropTypes.object
};

export default Modal;
