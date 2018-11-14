import React, { Component } from "react";
import { auth } from "./Auth";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import utilities from "./shared/utilities";
import CancelFight from "./CancelFight";
import RemindThem from "./RemindThem";
import SurrenderButton from "./Surrender";
import Avatar from "./shared/components/Avatar";
import TimeRemaining from "./shared/components/TimeRemaining";

const sharedButtonStyles = css`
  padding: 1em 2.5em !important;
  font-size: 0.9rem !important;
  min-width: 200px !important;
  text-align: center;
  font-weight: bold;
`;

const LastCell = styled.td`
  padding-left: 10px !important;
`;

const HatchetListWrapper = styled.div`
  padding-bottom: 3em;
  padding-top: 3em;
`;

const HatchetListTable = styled.table`
  &.hatchetList {
    margin-top: 2em;
    display: block;

    ${utilities.media.phone`
      max-width: 100%;
    `};

    td {
      padding: 15px 0;
    }
  }

  &.activeList tbody {
    tr {
      ${utilities.media.phone`
        flex-wrap: nowrap;
        padding-bottom: 0.5em;
        padding-top: 0.5em;
      `};
    }

    td {
      ${utilities.media.phone`
        padding: 0;
    `};
    }
  }

  tbody {
    td:first-child {
      width: 100%;
      font-size: 95%;
      padding-right: 10px;

      p {
        line-height: 1.3em;
      }

      .inner {
        display: flex;
        align-items: center;
      }

      ${utilities.media.phone`
        padding-bottom: 0;
      `};
    }

    td:not(:first-child) {
      ${utilities.media.phone`
        flex: 1;
        width: 50%;
        text-align: center !important;
      `};

      .button {
        ${utilities.media.phone`
          min-width: auto !important;
          padding: 1em 0 !important;
          width: 100%;
          max-width: 200px;
        `};
      }
    }

    tr {
      ${utilities.media.phone`
        display: flex;
        flex-wrap: wrap;
        padding: 0.25em 1em 0.5em;
        width: 100vw;
      `};
    }
  }
`;

const HatchetListHeader = styled.th`
  text-align: left !important;
  padding: 0 0 0.5em !important;
  font-size: 100% !important;

  &.pending {
    color: var(--red) !important;
  }

  &.active {
    color: var(--teal) !important;
  }

  ${utilities.media.phone`
    padding-left: 1em !important;
  `};
`;

const Highlight = styled.span`
  color: var(--teal);
`;

const RedLink = styled(Link)`
  color: var(--red);
`;

const HatchetListLink = styled(Link)`
  ${sharedButtonStyles};

  &.top {
    ${utilities.media.phone`
      margin-top: 2em !important;
    `};
  }
`;

class MyHatchets extends Component {
  constructor() {
    super();
    this.state = {
      waitingOnYou: [],
      waitingOnThem: [],
      activeChallenger: [],
      activeDefender: [],
      loading: true
    };
  }

  getUserFights() {
    // /api/:userId/fights => getUserFights
    let url = `/api/${auth.user.userid}/fights`;
    return fetch(url).then(res => res.json());
  }

  componentDidMount() {
    this.getUserFights().then(fights => {
      let active = null;
      let waitingOnYou = null;
      let waitingOnThem = null;

      if (fights) {
        active = fights.active;
        waitingOnYou = fights.waitingOnYou;
        waitingOnThem = fights.waitingOnThem;
      }

      this.setState({
        activeChallenger: active.filter(
          fight => fight.antagonist.username === auth.user.username
        ),
        activeDefender: active.filter(
          fight => fight.antagonist.username !== auth.user.username
        ),
        waitingOnYou,
        waitingOnThem,
        loading: false
      });
    });
  }

  render() {
    const {
      waitingOnYou,
      waitingOnThem,
      activeChallenger,
      activeDefender,
      loading
    } = this.state;

    const PendingHeaders = () => (
      <thead>
        <tr>
          <HatchetListHeader className="pending">Pending</HatchetListHeader>
        </tr>
      </thead>
    );

    const PendingBody = () => (
      <tbody>
        {_waitingOnYou}
        {_waitingOnThem}
      </tbody>
    );

    const ActiveHeaders = props => (
      <thead>
        <tr>
          <HatchetListHeader className="active">{props.side}</HatchetListHeader>
        </tr>
      </thead>
    );

    const ChallengerBody = () => <tbody>{_activeChallenger}</tbody>;
    const DefenderBody = () => <tbody>{_activeDefender}</tbody>;

    const ShowTime = props => {
      const { activatedAt, isExpired } = props;
      return <TimeRemaining isExpired={isExpired} activatedAt={activatedAt} />;
    };

    const _activeChallenger = activeChallenger.length ? (
      activeChallenger.map(fight => {
        return (
          <tr key={fight._id}>
            <td>
              <Link to={`/fight/${fight._id}`}>{fight.title}</Link>
            </td>
            <td>
              <ShowTime
                activatedAt={fight.activatedAt}
                isExpired={fight.isExpired}
              />
            </td>
          </tr>
        );
      })
    ) : (
      <React.Fragment />
    );

    const _activeDefender = activeDefender.length ? (
      activeDefender.map(fight => {
        return (
          <tr key={fight._id}>
            <td>
              <Link to={`/fight/${fight._id}`}>{fight.title}</Link>
            </td>
            <td>
              <ShowTime
                activatedAt={fight.activatedAt}
                isExpired={fight.isExpired}
              />
            </td>
          </tr>
        );
      })
    ) : (
      <React.Fragment />
    );

    const HatchetListWrapperComponent = props => {
      if (props.type === "pending") {
        return waitingOnYou.length || waitingOnThem.length ? (
          props.children
        ) : (
          <React.Fragment />
        );
      } else if (props.type === "challenger") {
        return activeChallenger.length ? props.children : <React.Fragment />;
      } else if (props.type === "defender") {
        return activeDefender.length ? props.children : <React.Fragment />;
      }
    };

    const HatchetList = () => (
      <>
        <HatchetListWrapperComponent type="pending">
          <HatchetListTable className="fightList hatchetList">
            <PendingHeaders />
            <PendingBody />
          </HatchetListTable>
        </HatchetListWrapperComponent>

        <HatchetListWrapperComponent type="challenger">
          <HatchetListTable className="fightList hatchetList activeList">
            <ActiveHeaders side="Challenger" />
            <ChallengerBody />
          </HatchetListTable>
        </HatchetListWrapperComponent>

        <HatchetListWrapperComponent type="defender">
          <HatchetListTable className="fightList hatchetList activeList">
            <ActiveHeaders side="Defender" />
            <DefenderBody />
          </HatchetListTable>
        </HatchetListWrapperComponent>
      </>
    );

    const _waitingOnYou = waitingOnYou.length ? (
      waitingOnYou.map(fight => {
        let imgpath = fight.antagonist.avatar
          ? `/svg/avatars/${fight.antagonist.avatar.path}`
          : "/svg/unknown-user.svg";
        let antagonistId = fight.antagonist._id;
        return (
          <tr key={fight._id}>
            <td>
              <>
                <div className="inner">
                  <a href={`/profile/${antagonistId}`}>
                    <Avatar imgpath={imgpath} width="36px" height="36px" />
                  </a>
                  <p>
                    <a href={`/profile/${antagonistId}`}>
                      <Highlight>{fight.antagonist.username}</Highlight>
                    </a>{" "}
                    has an{" "}
                    <RedLink to={`/defend/${fight._id}`}>Axe to Grind</RedLink>{" "}
                    with you!
                  </p>
                </div>
              </>
            </td>
            <td>
              <SurrenderButton
                type="button"
                fightId={fight._id}
                classes="button primary alt"
                opponent={fight.antagonist.username}
              >
                Surrender
              </SurrenderButton>
            </td>
            <LastCell>
              <HatchetListLink
                className="button primary"
                to={`/defend/${fight._id}`}
              >
                Respond
              </HatchetListLink>
            </LastCell>
          </tr>
        );
      })
    ) : (
      <React.Fragment />
    );

    const _waitingOnThem = waitingOnThem.length ? (
      waitingOnThem.map(fight => {
        let imgpath = fight.defender.avatar
          ? `/svg/avatars/${fight.defender.avatar.path}`
          : "/svg/unknown-user.svg";
        let defenderId = fight.defender._id;
        return (
          <tr key={fight._id}>
            <td>
              <>
                <div className="inner">
                  <a href={`/profile/${defenderId}`}>
                    <Avatar imgpath={imgpath} width="36px" height="36px" />
                  </a>
                  <p>
                    You started a{" "}
                    <RedLink to={`/fight/${fight._id}`}>Hatchet</RedLink> with{" "}
                    <a href={`/profile/${defenderId}`}>
                      <Highlight>{fight.defender.username}</Highlight>
                    </a>
                    .
                  </p>
                </div>
              </>
            </td>
            <td>
              <CancelFight fightId={fight._id} classes="button primary alt" />
            </td>
            <LastCell>
              <RemindThem
                fightId={fight._id}
                isDisabled={fight.remindedUsed}
                classes={
                  fight.remindedUsed
                    ? "disabled button primary"
                    : "button primary"
                }
              />
            </LastCell>
          </tr>
        );
      })
    ) : (
      <React.Fragment />
    );

    const noContent =
      waitingOnThem.length === 0 &&
      waitingOnYou.length === 0 &&
      activeChallenger.length === 0 &&
      activeDefender.length === 0;

    return (
      <HatchetListWrapper>
        {loading === true ? (
          <Loading />
        ) : (
          <>
            <HatchetListLink to="/create" className="button primary top">
              Start a new Hatchet
            </HatchetListLink>

            {noContent ? (
              <p>You've got no hatchets.</p>
            ) : (
              <>
                <HatchetList />
              </>
            )}
          </>
        )}
      </HatchetListWrapper>
    );
  }
}

export default MyHatchets;
