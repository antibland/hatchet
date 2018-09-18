import React, { Component } from "react";
import PropTypes from "prop-types";
import { auth } from "./Auth";
import styled from "styled-components";

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

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { fightId } = this.props;

    // '/api/:userId/:fightId' => fightApi.cancelFight
    if (
      window.confirm(
        "Are you sure? Not to scare you, but deleting a fight cannot be undone."
      )
    ) {
      fetch(`/api/${auth.user.userid}/${fightId}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(() => {
          window.location.reload();
        });
    }
  }

  render() {
    return (
      <CancelButton className={this.props.classes} onClick={this.handleClick}>
        Cancel
      </CancelButton>
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
