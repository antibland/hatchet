import React from "react";
import Avatar from "../shared/components/Avatar";

const SlotsThem = props => {
  return (
    <div className="them">
      {props.opponentAvatarUrl && props.opponentAvatarUrl.length ? (
        <Avatar imgpath={`/svg/avatars/${props.opponentAvatarUrl}`}>
          <span className="username">{props.them}</span>
        </Avatar>
      ) : (
        <Avatar />
      )}
    </div>
  );
};

SlotsThem.defaultProps = {
  opponentAvatarUrl: "",
  them: ""
};

export default SlotsThem;
