import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import utilities from "../../shared/utilities";
import Avatar from "../../shared/components/Avatar";
import VersusImg from "../../shared/components/VersusImg";
import TimeRemaining from "../../shared/components/TimeRemaining";
import styled from "styled-components";

const Username = styled.span`
  max-width: 125px;
`;

const TitleRow = props => {
  let firstWord = props.type.split(" ")[0].replace("'", "");
  let categoryImg = utilities.getCategoryImage(firstWord);

  return (
    <td>
      <Link className="button link" to={"/fight/" + props.id}>
        {categoryImg}
        <span className="title">{props.title}</span>
      </Link>
    </td>
  );
};

const ChallengerRow = props => {
  let imgpath = props.avatar ? props.avatar : "/svg/unknown-user.svg";
  const username = props.username;

  return (
    <td className="challengerRow">
      <div className="part">
        <Link to={`/profile/${props.id}`}>
          <Avatar width={60} height={60} imgpath={imgpath} />
          <Username title={username} className="username ellipsize">
            {username}
          </Username>
        </Link>
      </div>
      <div className="part">
        <VersusImg />
      </div>
    </td>
  );
};

const DefenderRow = props => {
  let imgpath = props.avatar ? props.avatar : "/svg/unknown-user.svg";
  const username = props.username;

  return (
    <td className="defenderRow">
      <div className="part">
        <Link to={`/profile/${props.id}`}>
          <Avatar width={60} height={60} imgpath={imgpath} />
          <Username title={username} className="username ellipsize">
            {username}
          </Username>
        </Link>
      </div>
    </td>
  );
};

const ShowTime = props => {
  const { activatedAt, isExpired } = props;
  return <TimeRemaining isExpired={isExpired} activatedAt={activatedAt} />;
};

const HatchetList = props =>
  props.fights.map(fight => {
    const {
      _id,
      title,
      type,
      activatedAt,
      isExpired,
      antagonist: {
        username: antagonistUsername,
        avatar: antagonistAvatar = "",
        _id: antagonistId
      },
      defender: {
        username: defenderUsername,
        avatar: defenderAvatar = "",
        _id: defenderId
      }
    } = fight;

    let avatars = {
      antagonist:
        antagonistAvatar.path && antagonistAvatar.path.length > 0
          ? `/svg/avatars/${antagonistAvatar.path}`
          : "",
      defender:
        defenderAvatar.path && defenderAvatar.path.length > 0
          ? `/svg/avatars/${defenderAvatar.path}`
          : ""
    };

    return (
      <tr key={_id}>
        <TitleRow id={_id} title={title} type={type} />
        <ChallengerRow
          username={antagonistUsername}
          avatar={avatars.antagonist}
          id={antagonistId}
        />
        <DefenderRow
          username={defenderUsername}
          avatar={avatars.defender}
          id={defenderId}
        />
        <td>
          <ShowTime activatedAt={activatedAt} isExpired={isExpired} />
        </td>
      </tr>
    );
  });

HatchetList.defaultProps = {
  emptyMessage: "It's is lonely here. Not a hatchet in sight."
};

HatchetList.propTypes = {
  fights: PropTypes.array.isRequired
};

export default HatchetList;
