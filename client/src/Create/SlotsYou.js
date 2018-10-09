import React from "react";
import Avatar from "../shared/components/Avatar";
import PropTypes from "prop-types";

const SlotsYou = props => {
  return (
    <div className="you">
      {props.avatar === null || props.avatar === "" ? (
        <Avatar imgpath="/user.png" width="94px" height="94px" />
      ) : (
        <Avatar imgpath={`/svg/avatars/${props.avatar}`}>
          <span className="username">{props.you}</span>
        </Avatar>
      )}
    </div>
  );
};

SlotsYou.defaultProps = {
  avatar: ""
};

SlotsYou.propTypes = {
  you: PropTypes.string.isRequired
};

export default SlotsYou;
