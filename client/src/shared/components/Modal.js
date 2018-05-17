import React from 'react';
import PropTypes from 'prop-types';
import '../../css/Modal.css';

class Modal extends React.Component {
  render() {
    if (this.props.isOpen === false ) return null;
    return (
      <div className="modal">
        <div className="content">
          {this.props.children}
          <button onClick={this.props.closeModal} className="button primary">Ok</button>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default Modal;
