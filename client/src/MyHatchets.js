import React, { Component } from "react";
import { auth } from "./Auth";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import utilities from "./shared/utilities";
import CancelFight from "./CancelFight";
import TimeRemaining from "./shared/components/TimeRemaining";

const sharedButtonStyles = css`
  padding: 1em 2.5em !important;
  font-size: 0.9rem !important;
  min-width: 200px !important;
  text-align: center;
  font-weight: bold;
`;

const RecordHighlight = styled.strong`
  background: var(--dark-text);
  color: white;
  padding: 0 10px;
  animation: simpleFadeIn 0.8s forwards ease-in 0.2s;
  opacity: 0;
  visibility: hidden;
  text-shadow: 0 0 1px var(--red);
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

const HatchetListButton = styled.button`
  ${sharedButtonStyles};
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
      loading: true,
      ties: 0,
      wins: 0,
      losses: 0
    };

    this.handleSurrenderClick = this.handleSurrenderClick.bind(this);
    this.handleRemindThemClick = this.handleRemindThemClick.bind(this);
  }

  componentDidMount() {
    // /api/:userId/fights => getUserFights
    let url = `/api/${auth.user.userid}/fights`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        let { active, waitingOnYou, waitingOnThem, record } = data;

        this.setState({
          activeChallenger: active.filter(
            fight => fight.antagonist.username === auth.user.username
          ),
          activeDefender: active.filter(
            fight => fight.antagonist.username !== auth.user.username
          ),
          waitingOnYou,
          waitingOnThem,
          loading: false,
          ties: record.ties,
          wins: record.wins,
          losses: record.losses
        });
      });
  }

  handleSurrenderClick() {
    alert("handle surrender");
  }

  handleRemindThemClick() {
    alert("handle remind them");
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

    const _activeChallenger = activeChallenger.length ? (
      activeChallenger.map(fight => {
        return (
          <tr key={fight._id}>
            <td>
              <Link to={`/fight/${fight._id}`}>{fight.title}</Link>
            </td>
            <td>
              <TimeRemaining remaining={fight.activatedAt} />
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
              <TimeRemaining remaining={fight.activatedAt} />
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

    const Record = () => {
      const { ties, wins, losses } = this.state;
      return (
        <React.Fragment>
          <h2>
            Your record is{" "}
            <RecordHighlight>
              {wins}-{losses}-{ties}
            </RecordHighlight>
          </h2>
        </React.Fragment>
      );
    };

    const HatchetList = () => (
      <React.Fragment>
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
      </React.Fragment>
    );

    const _waitingOnYou = waitingOnYou.length ? (
      waitingOnYou.map(fight => {
        return (
          <tr key={fight._id}>
            <td>
              <React.Fragment>
                <Highlight>{fight.antagonist.username}</Highlight> has an{" "}
                <RedLink to={`/defend/${fight._id}`}>Axe to Grind</RedLink> with
                you!
              </React.Fragment>
            </td>
            <td>
              <HatchetListButton
                type="button"
                onClick={this.handleSurrenderClick}
                className="button primary alt"
              >
                Surrender
              </HatchetListButton>
            </td>
            <td>
              <HatchetListLink
                className="button primary"
                to={`/defend/${fight._id}`}
              >
                Respond
              </HatchetListLink>
            </td>
          </tr>
        );
      })
    ) : (
      <React.Fragment />
    );

    const _waitingOnThem = waitingOnThem.length ? (
      waitingOnThem.map(fight => {
        return (
          <tr key={fight._id}>
            <td>
              <React.Fragment>
                You started a{" "}
                <RedLink to={`/fight/${fight._id}`}>Hatchet</RedLink> with{" "}
                <Highlight>{fight.defender.username}</Highlight>.
              </React.Fragment>
            </td>
            <td>
              <CancelFight fightId={fight._id} classes="button primary alt" />
            </td>
            <td>
              <HatchetListButton
                type="button"
                onClick={this.handleRemindThemClick}
                className="button primary"
              >
                Remind them
              </HatchetListButton>
            </td>
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
          <React.Fragment>
            <HatchetListLink to="/create" className="button primary top">
              Start a new Hatchet
            </HatchetListLink>

            {noContent ? (
              <p>You've got no hatchets.</p>
            ) : (
              <React.Fragment>
                <Record />
                <HatchetList />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </HatchetListWrapper>
    );
  }
}

export default MyHatchets;
