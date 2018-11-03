import React, { Component } from "react";
import { auth } from "./Auth";
import { Link } from "react-router-dom";
import Avatar from "./shared/components/Avatar";
import Loading from "./Loading";
import Symbol from "./shared/components/Symbol";
import PlaceholderText from "./shared/components/PlaceholderText";
import VersusImg from "./shared/components/VersusImg";
import Modal from "./shared/components/Modal";
import Gif from "./shared/components/Gif";
import Vote from "./Vote";
import TimeRemaining from "./shared/components/TimeRemaining";
import commonData from "./shared/commonData";
import styled from "styled-components";
import TwitterShareButton from "./shared/components/TwitterShareButton";
import "./css/Fight.css";

const modalStyles = {
  frame: {
    backgroundColor: "white",
    paddingLeft: "2em",
    paddingRight: "2em",
    width: "22em"
  },
  labelTxt: {
    color: "var(--teal)"
  },
  list: {
    marginBottom: "1.8em"
  },
  listButtons: {
    marginBottom: ".5em",
    marginTop: ".5em",
    paddingTop: ".6em",
    paddingBottom: ".6em",
    width: "100%",
    maxWidth: "none"
  }
};

const VoteAgainstList = props => (
  <ul style={modalStyles.list}>
    {commonData.voteAgainst.map((item, index) => (
      <li key={item}>
        <button
          style={modalStyles.listButtons}
          className={index % 2 === 0 ? "button primary" : "button primary alt"}
          onClick={() => props.onItemClick(item)}
          type="button"
        >
          {item}
        </button>
      </li>
    ))}
  </ul>
);

const Highlight = styled.span`
  color: var(--teal);
`;

const UserCanDefendWrapper = styled.div`
  position: relative;
  .blurred {
    opacity: 0.6;
  }
`;

const DefendButton = styled(Link)`
  position: absolute !important;
  padding: 1em 1.5em !important;
  width: auto !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

class Fight extends Component {
  constructor() {
    super();
    this.state = {
      isModalOpen: false,
      showGif: false,
      gifCaption: "",
      addStyle: false,
      loaded: false,
      showVotes: false,
      votedFor: "",
      isValid: false,
      isLive: false,
      textAgainst: "",
      fight: "",
      fightTitle: "",
      fightType: "",
      votes: {
        for: 0,
        against: 0
      },
      antagonist: {
        avatarPath: "",
        username: "",
        argument: {
          offense: "",
          bother: "",
          action: ""
        }
      },
      defender: {
        avatarPath: "",
        username: "",
        argument: {
          offense: "",
          bother: "",
          action: ""
        }
      }
    };

    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.checkIfUserHasVoted = this.checkIfUserHasVoted.bind(this);
    this.getUsernameFromSide = this.getUsernameFromSide.bind(this);
    this.afterVote = this.afterVote.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  getUsernameFromSide(votedFor) {
    const { defender, antagonist } = this.state;
    return votedFor === ""
      ? ""
      : votedFor === "for"
        ? defender.username
        : antagonist.username;
  }

  handleItemClick(reason) {
    const username = this.getUsernameFromSide(this.state.votedFor);

    // "/api/:fightId/voteReason" => fightApi.voteReason
    fetch(`/api/${username}/voteReason`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "PATCH",
      body: JSON.stringify({
        reason: reason.toLowerCase()
      })
    })
      .then(res => {
        if (res.ok) {
          this.setState({ isModalOpen: false });
        } else {
          throw Error(`Request rejected with status ${res.status}`);
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({ isModalOpen: false });
      });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  afterVote(votes, votedOn) {
    const fightId = this.props.match.params.fightId;
    let newState = Object.assign({}, this.state);
    newState.votes.for = votes.for;
    newState.votes.against = votes.against;

    votedOn.forEach(item => {
      if (item.fightId === fightId) {
        newState.showVotes = true;
        newState.votedFor = item.side;
      }
    });

    this.setState(newState, () => this.setState({ isModalOpen: true }));
  }

  handleTextareaChange(fieldValidity, val) {
    this.setState({
      isValid: fieldValidity,
      textAgainst: val
    });
  }

  checkIfUserHasVoted(fightId) {
    // /api/:userId/:fightId/hasUserVoted => hasUserVoted
    fetch(`/api/${auth.user.userid}/${fightId}/hasUserVoted`)
      .then(res => res.json())
      .then(data => {
        if (data.match === true) {
          this.setState({
            showVotes: true,
            votedFor: data.vote.side
          });
        }
      });
  }

  handleError(message) {
    this.setState({ loaded: true, showGif: true, gifCaption: message });
  }

  getFightDetails(fightId, cb) {
    // /api/:fightId/fight => getFight
    fetch(`/api/${fightId}/fight`)
      .then(res => res.json())
      .then(data => {
        if (data.type === "not found") {
          this.handleError(data.message);
          return;
        }

        let offense = "";
        let bother = "";
        let action = "";

        if (data.fight.text && data.fight.text.defender) {
          offense = data.fight.text.defender.do;
          bother = data.fight.text.defender.bother;
          action = data.fight.text.defender.action;
        }

        this.setState({
          activatedAt: data.fight.activatedAt,
          isExpired: data.fight.isExpired,
          isLive: data.fight.isLive,
          fightTitle: data.fight.title,
          fightType: data.fight.type,
          votes: {
            for: data.fight.votes.for,
            against: data.fight.votes.against
          },
          antagonist: {
            avatarPath: data.fight.antagonist.avatar
              ? data.fight.antagonist.avatar.path
              : "",
            username: data.fight.antagonist.username,
            argument: {
              offense: data.fight.text.attacker.do,
              bother: data.fight.text.attacker.bother,
              action: data.fight.text.attacker.action
            }
          },
          defender: {
            avatarPath: data.fight.defender.avatar
              ? data.fight.defender.avatar.path
              : "",
            username: data.fight.defender.username,
            argument: {
              offense,
              bother,
              action
            },
            userSurrendered: data.fight.userSurrendered
          }
        });

        if (auth.isAuthenticated) {
          if (
            auth.user.username !== data.fight.antagonist.username &&
            auth.user.username !== data.fight.defender.username
          ) {
            cb(fightId);
          } else {
            this.setState({ showVotes: true });
          }
        }

        setTimeout(() => {
          this.setState({ loaded: true });

          setTimeout(() => {
            this.setState({ addStyle: true });
          }, 400);
        }, 500);
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentDidMount() {
    const fightId = this.props.match.params.fightId;
    this.getFightDetails(fightId, this.checkIfUserHasVoted);
  }

  render() {
    let antagonist = {},
      defender = {},
      defaultUserImg = "/svg/unknown-user.svg";

    const username = auth.user.username;
    const {
      isModalOpen,
      isLive,
      isExpired,
      showVotes,
      loaded,
      addStyle,
      votes,
      activatedAt
    } = this.state;

    const { offense, bother, action } = this.state.antagonist.argument;
    const {
      offense: defend_offense,
      bother: defend_bother,
      action: defend_action
    } = this.state.defender.argument;

    const fightId = this.props.match.params.fightId;

    antagonist.imgpath =
      this.state.antagonist.avatarPath === ""
        ? defaultUserImg
        : `/svg/avatars/${this.state.antagonist.avatarPath}`;

    antagonist.username =
      username === this.state.antagonist.username
        ? "You"
        : this.state.antagonist.username;

    defender.imgpath =
      this.state.defender.avatarPath === ""
        ? defaultUserImg
        : `/svg/avatars/${this.state.defender.avatarPath}`;
    defender.username =
      username === this.state.defender.username
        ? "You"
        : this.state.defender.username;

    defender.argument = isLive ? (
      <p className="fightText">{this.state.defender.argument}</p>
    ) : (
      <PlaceholderText />
    );

    const userCanDefend =
      (username === defender.username || defender.username === "You") &&
      this.state.isLive === false;

    const userCanVote =
      auth.hasValidToken() &&
      isExpired === false &&
      isLive === true &&
      showVotes === false &&
      !(
        username === defender.username ||
        username === antagonist.username ||
        antagonist.username === "You" ||
        defender.username === "You"
      );

    const VotingButton = props => {
      return userCanVote ? (
        <Vote
          fightId={fightId}
          side={props.side}
          username={props.username}
          afterVote={this.afterVote}
        />
      ) : (
        ""
      );
    };

    const VersusWrapper = () => (
      <div className="versusWrapper">
        <VersusImg />
      </div>
    );

    const votesFor = votes.for;
    const votesAgainst = votes.against;
    const totalVotes = votesFor + votesAgainst;
    let progressUser1;
    let progressUser2;

    if (votesFor === votesAgainst) {
      progressUser1 = 50;
      progressUser2 = 50;
    } else {
      progressUser1 = (votesFor / totalVotes) * 100;
      progressUser2 = (votesAgainst / totalVotes) * 100;
    }

    const VotedAgainstUsername = () =>
      this.getUsernameFromSide(this.state.votedFor);

    return (
      <div>
        <div className="contentPadding">
          {loaded === true ? (
            <>
              {this.state.showGif === true ? (
                <Gif
                  src="https://media.giphy.com/media/L6Dx055YCpcFa/giphy.mp4"
                  caption={this.state.gifCaption}
                />
              ) : (
                <div className="fightContainer">
                  <header className="fightContainerHeader">
                    <Avatar
                      imgpath={antagonist.imgpath}
                      width="100px"
                      height="100px"
                    >
                      <Symbol name="challenger-hatchet-icon" />
                    </Avatar>
                    <h2 className="hatchetTitle">
                      {this.state.fightTitle}
                      <TwitterShareButton />
                    </h2>
                    <Avatar
                      imgpath={defender.imgpath}
                      width="100px"
                      height="100px"
                    >
                      <Symbol name="defender-shield-icon" />
                    </Avatar>
                  </header>

                  <div className="fightTally">
                    <div className="user1">
                      <div className="fightMeter">
                        <span
                          style={
                            addStyle
                              ? { width: `${progressUser1}%` }
                              : { width: "0%" }
                          }
                        />
                      </div>
                    </div>
                    <VersusImg />
                    <div className="user2">
                      <div className="fightMeter">
                        <span
                          style={
                            addStyle
                              ? { width: `${progressUser2}%` }
                              : { width: "0%" }
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fightBody">
                    <div className="user1">
                      <h3>{antagonist.username}</h3>
                      <p className="fightText">{offense}</p>
                      <p className="fightText">{bother}</p>
                      <p className="fightText">{action}</p>

                      <VotingButton side="for" username={antagonist.username} />
                    </div>

                    <TimeRemaining
                      isExpired={isExpired}
                      activatedAt={activatedAt}
                      fromFightPage={true}
                    />

                    <VersusWrapper />

                    <div className="user2">
                      <h3>{defender.username}</h3>
                      {userCanDefend ? (
                        <UserCanDefendWrapper>
                          <PlaceholderText />
                          <DefendButton
                            className="primary button"
                            to={`/defend/${this.props.match.params.fightId}`}
                          >
                            Defend yourself
                          </DefendButton>
                        </UserCanDefendWrapper>
                      ) : defend_offense.length ? (
                        <>
                          <p className="fightText">{defend_offense}</p>
                          <p className="fightText">{defend_bother}</p>
                          <p className="fightText">{defend_action}</p>
                        </>
                      ) : (
                        <PlaceholderText />
                      )}
                      <VotingButton
                        side="against"
                        username={defender.username}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Loading />
          )}
        </div>
        <Modal
          style={modalStyles.frame}
          isOpen={isModalOpen}
          onCancel={this.closeModal}
          onCancelText="Skip"
        >
          <h2 className="title">
            Why did you vote against{" "}
            <Highlight>
              <VotedAgainstUsername />
            </Highlight>
            ?
          </h2>
          <p style={modalStyles.labelTxt}>They were being:</p>
          <VoteAgainstList onItemClick={this.handleItemClick} />
        </Modal>
      </div>
    );
  }
}

export default Fight;
