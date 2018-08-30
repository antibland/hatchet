import React, { Component } from "react";
import { auth } from "./Auth";
import Avatar from "./shared/components/Avatar";
import Loading from "./Loading";
import Symbol from "./shared/components/Symbol";
import StartHatchet from "./shared/components/StartHatchet";
import TextareaWithCountdown from "./shared/components/TextareaWithCountdown";
import VersusImg from "./shared/components/VersusImg";
import utilities from "./shared/utilities";
import Vote from "./Vote";
import "./css/Fight.css";
import "./css/Watching.css";

const PlaceholderText = () => {
  const placeholderText =
    "Lorem, ipsum dolor sit amet consect adipisicing elit. Facilis fugiat in impedit maxime adipisicing elit";

  return (
    <React.Fragment>
      <p className="fightText blurred">{placeholderText}</p>
      <p className="fightText blurred">{placeholderText}</p>
      <p className="fightText blurred">{placeholderText}</p>
    </React.Fragment>
  );
};
class Fight extends Component {
  constructor() {
    super();
    this.state = {
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
        username: ""
      }
    };

    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    this.checkIfUserHasVoted = this.checkIfUserHasVoted.bind(this);
    this.afterVote = this.afterVote.bind(this);
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

    this.setState(newState);
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

  getFightDetails(fightId, cb) {
    // /api/:fightId/fight => getFight
    fetch(`/api/${fightId}/fight`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          activatedAt: data.fight.activatedAt,
          isExpired: data.isExpired,
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
            argument: data.fight.text.against
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
      });
  }

  componentDidMount() {
    const fightId = this.props.match.params.fightId;
    this.getFightDetails(fightId, this.checkIfUserHasVoted);
  }

  render() {
    let antagonist = {},
      defender = {},
      defaultUserImg = "/user.png";

    const username = auth.user.username;
    const {
      isLive,
      isValid,
      isExpired,
      textAgainst,
      showVotes,
      loaded,
      addStyle,
      votes,
      activatedAt
    } = this.state;

    const { offense, bother, action } = this.state.antagonist.argument;

    const fightId = this.props.match.params.fightId;

    antagonist.imgpath =
      this.state.antagonist.avatarPath === ""
        ? defaultUserImg
        : this.state.antagonist.avatarPath;

    antagonist.username =
      username === this.state.antagonist.username
        ? "You"
        : this.state.antagonist.username;

    defender.imgpath =
      this.state.defender.avatarPath === ""
        ? defaultUserImg
        : this.state.defender.avatarPath;
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

    const TimeRemaining = () => {
      return (
        <div className="fightTimeRemaining">
          {isLive ? (
            !isExpired ? (
              <React.Fragment>
                <time>{utilities.getTimeRemaining(activatedAt)}</time>
                <span>TIME REMAINING</span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <time>00:00</time>
                <span>EXPIRED!</span>
              </React.Fragment>
            )
          ) : (
            <React.Fragment>
              <time>24:00</time>
              <span>PENDING</span>
            </React.Fragment>
          )}
        </div>
      );
    };

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

    return (
      <div>
        <div className="contentPadding">
          {loaded === true ? (
            <React.Fragment>
              <div className="fightContainer">
                <header className="fightContainerHeader">
                  <Avatar
                    imgpath={antagonist.imgpath}
                    width="100px"
                    height="100px"
                  >
                    <Symbol name="challenger-hatchet-icon" />
                  </Avatar>
                  <h2 className="hatchetTitle">{this.state.fightTitle}</h2>
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

                  <TimeRemaining />

                  <div className="user2">
                    <h3>{defender.username}</h3>
                    {userCanDefend ? (
                      <React.Fragment>
                        <div style={{ position: "relative" }}>
                          <TextareaWithCountdown
                            countLimit={1000}
                            onInput={this.handleTextareaChange}
                            ariaLabel="What happened"
                            placeholder="Your argument goes here"
                            fieldName="beef"
                            fieldId="beef"
                          />
                        </div>
                        <StartHatchet
                          fightId={fightId}
                          isDisabled={isValid}
                          textAgainst={textAgainst}
                        />
                      </React.Fragment>
                    ) : (
                      defender.argument
                    )}

                    <VotingButton side="against" username={defender.username} />
                  </div>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    );
  }
}

export default Fight;
