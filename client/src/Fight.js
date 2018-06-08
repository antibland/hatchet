import React, { Component } from 'react';
import { auth } from './Auth';
import Avatar from './shared/components/Avatar';
import Loading from './Loading';
// import WatchingWidget from './WatchingWidget';
import StartHatchet from './shared/components/StartHatchet';
import TextareaWithCountdown from './shared/components/TextareaWithCountdown';
import VersusImg from './shared/components/VersusImg';
import Vote from './Vote';
import VotesCount from './VotesCount';
import './css/Fight.css';
import './css/Watching.css';

class Fight extends Component {
  constructor() {
    super();
    this.state = {
      addStyle: false,
      loaded: false,
      showVotes: false,
      votedFor: '',
      isValid: false,
      isLive: false,
      textAgainst: '',
      fight: '',
      fightTitle: '',
      fightType: '',
      votes: {
        for: 0,
        against: 0
      },
      antagonist: {
        avatarPath: '',
        username: '',
        argument: ''
      },
      defender: {
        avatarPath: '',
        username: ''
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
  };

  getFightDetails(fightId, cb) {
    // /api/:fightId/fight => getFight
    fetch(`/api/${fightId}/fight`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          isExpired: data.isExpired,
          isLive: data.fight.isLive,
          fightTitle: data.fight.title,
          fightType: data.fight.type,
          votes: {
            for: data.fight.votes.for,
            against: data.fight.votes.against,
          },
          antagonist: {
            avatarPath: data.fight.antagonist.avatar
              ? data.fight.antagonist.avatar.path
              : '',
            username: data.fight.antagonist.username,
            argument: data.fight.text.for
          },
          defender: {
            avatarPath: data.fight.defender.avatar
              ? data.fight.defender.avatar.path
              : '',
            username: data.fight.defender.username,
            argument: data.fight.text.against
          }
        });

        if (auth.isAuthenticated) {
          if (auth.user.username !== data.fight.antagonist.username &&
              auth.user.username !== data.fight.defender.username) {
                cb(fightId);
          } else {
            this.setState({ showVotes: true })
          }
        }

        setTimeout(() => {
          this.setState({ loaded: true });

          setTimeout(() => {
            this.setState({ addStyle: true })
          }, 400);
        }, 500);
      });
  }

  componentDidMount() {
    const fightId = this.props.match.params.fightId;
    this.getFightDetails(fightId, this.checkIfUserHasVoted);
  };

  render() {
    let antagonist = {},
        defender = {},
        defaultUserImg = '/user.png';

    const username = auth.user.username;
    const { isLive, isValid, isExpired, textAgainst, showVotes, loaded, addStyle, votes } = this.state;
    const fightId = this.props.match.params.fightId;
    const placeholderText = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis fugiat in impedit maxime blanditiis nam assumenda. Dicta quo sequi dolorum similique. Libero repudiandae esse voluptate impedit delectus enim, nostrum quos?';

    antagonist.imgpath = this.state.antagonist.avatarPath === ''
      ? defaultUserImg
      : this.state.antagonist.avatarPath;

    antagonist.username = username === this.state.antagonist.username
      ? 'You'
      : this.state.antagonist.username;

    antagonist.argument = this.state.antagonist.argument;

    defender.imgpath = this.state.defender.avatarPath === ''
      ? defaultUserImg
      : this.state.defender.avatarPath;
    defender.username = username === this.state.defender.username
      ? 'You'
      : this.state.defender.username;

    defender.argument = isLive
      ? <p className="fightText">{this.state.defender.argument}</p>
      : <p className='fightText blurred'>{placeholderText}</p>

    const userCanDefend = (
      (username === defender.username || defender.username === 'You') &&
      this.state.isLive === false
    );

    const userCanVote = (
      auth.hasValidToken() &&
      isExpired === false &&
      isLive === true &&
      showVotes === false &&
      !(username === defender.username ||
        username === antagonist.username ||
        antagonist.username === "You" ||
        defender.username === "You"
      )
    );

    const VotingButton = props => {
      return (
        userCanVote
          ? <Vote
              fightId={fightId}
              side={props.side}
              username={props.username}
              afterVote={this.afterVote}
            />
          : ''
      )
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
        <div className='contentPadding'>
          {/* { auth.hasValidToken()
            ? <WatchingWidget
                userId={auth.user.userid}
                fightId={this.props.location.pathname.split('/').pop()}
              />
            : ''
          } */}
        { loaded === true
          ? <React.Fragment>
              <div className="fightContainer">
                <header className="fightContainerHeader">
                  <Avatar imgpath={antagonist.imgpath} width='100px' height='100px' />
                  <h2 className="hatchetTitle">{this.state.fightTitle}</h2>
                  <Avatar imgpath={defender.imgpath} width='100px' height='100px' />
                </header>

                <div className="fightTally">
                  <div className="user1">
                    <div className="fightMeter">
                      <span style={ addStyle ? {width: `${progressUser1}%`} : {width: '0%'} }></span>
                    </div>
                  </div>
                  <VersusImg />
                  <div className="user2">
                    <div className="fightMeter">
                    <span style={ addStyle ? {width: `${progressUser2}%`} : {width: '0%'} }></span>
                    </div>
                  </div>
                </div>

                <div className="fightBody">
                  <div className="user1">
                    <h3>{antagonist.username}</h3>
                    <p className="fightText">{antagonist.argument}</p>
                    <VotesCount
                      { ...this.state }
                      isLoggedIn={auth.isAuthenticated}
                      side='for'
                    />

                    <VotingButton
                      side='for'
                      username={antagonist.username}
                    />
                  </div>

                  <div className="fightTimeRemaining">
                    <time>23:59</time>
                    <span>
                      TIME REMAINING
                    </span>
                  </div>

                  <div className="user2">
                    <h3>{defender.username}</h3>
                    { userCanDefend
                      ? <React.Fragment>
                          <div style={{position: 'relative'}}>
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
                      : defender.argument
                    }
                    <VotesCount
                      { ...this.state }
                      isLoggedIn={auth.isAuthenticated}
                      side='against'
                    />

                    <VotingButton
                      side='against'
                      username={defender.username}
                    />
                  </div>
                </div>
              </div>
            </React.Fragment>
          : <Loading />
        }
        </div>
      </div>
    )
  }
}

export default Fight;
