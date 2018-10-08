import React from "react";
import PropTypes from "prop-types";
import "../../css/Modal.css";

class Modal extends React.Component {
  render() {
    const { style, children, closeModal, isOpen } = this.props;
    if (isOpen === false) return null;
    return (
      <div className="modal">
        <div className="content" style={style}>
          {children}
          <button onClick={closeModal} className="button primary">
            Ok
          </button>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default Modal;
