import React, { Component } from "react";
import { auth } from "./Auth";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import utilities from "./shared/utilities";

const sharedButtonStyles = css`
  padding: 1em 2.5em !important;
  font-size: 0.9rem !important;
  min-width: 200px !important;
  text-align: center;
  font-weight: bold;
`;

const HatchetListTable = styled.table`
  &.hatchetList {
    margin-top: 2em;
    display: block;

    ${utilities.media.phone`
      max-width: 100%;
    `};
  }

  &.activeList tbody tr {
    ${utilities.media.phone`
      flex-wrap: nowrap;
    `};
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
        padding: 0.5em 1em 1em;
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
      loading: true
    };

    this.handleSurrenderClick = this.handleSurrenderClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleRemindThemClick = this.handleRemindThemClick.bind(this);
  }

  componentDidMount() {
    // /api/:userId/fights => getUserFights
    let url = `/api/${auth.user.userid}/fights`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        let { active, waitingOnYou, waitingOnThem } = data;

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

  handleSurrenderClick() {
    alert("handle surrender");
  }

  handleCancelClick() {
    alert("handle cancel");
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
            <td>{fight.title}</td>
            <td>{utilities.getTimeRemaining(fight.activatedAt)}</td>
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
            <td>{fight.title}</td>
            <td>{utilities.getTimeRemaining(fight.activatedAt)}</td>
          </tr>
        );
      })
    ) : (
      <React.Fragment />
    );

    const HatchetList = () => (
      <React.Fragment>
        <HatchetListTable className="fightList hatchetList">
          <PendingHeaders />
          <PendingBody />
        </HatchetListTable>
        <HatchetListTable className="fightList hatchetList activeList">
          <ActiveHeaders side="Challenger" />
          <ChallengerBody />
        </HatchetListTable>
        <HatchetListTable className="fightList hatchetList activeList">
          <ActiveHeaders side="Defender" />
          <DefenderBody />
        </HatchetListTable>
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
                You started a Hatchet with{" "}
                <Highlight>{fight.defender.username}</Highlight>.
              </React.Fragment>
            </td>
            <td>
              <HatchetListButton
                type="button"
                onClick={this.handleCancelClick}
                className="button primary alt"
              >
                Cancel
              </HatchetListButton>
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
      <div>
        {loading === true ? (
          <Loading />
        ) : (
          <React.Fragment>
            <HatchetListLink to="/create" className="button primary top">
              Start a new Hatchet
            </HatchetListLink>
            {noContent && <p>You've got no hatchets.</p>}

            <HatchetList />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default MyHatchets;
