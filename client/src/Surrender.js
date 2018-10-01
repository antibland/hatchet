import React, { Component } from "react";
import PropTypes from "prop-types";
import { auth } from "./Auth";
import styled from "styled-components";

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
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { fightId, opponent } = this.props;

    // '/api/:userId/:fightId' => fightApi.surrender
    if (
      window.confirm(
        `Are you sure? You're making things pretty easy for ${opponent}`
      )
    ) {
      fetch(`/api/${auth.user.userid}/${fightId}`, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then(() => {
          window.location.reload();
        });
    }
  }

  render() {
    return (
      <Button
        className={this.props.classes}
        onClick={this.handleClick}
        {...this.props}
      >
        Surrender
      </Button>
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
