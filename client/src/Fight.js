import React, { Component } from 'react';
import { auth } from './Auth';
import Avatar from './shared/components/Avatar';
import Loading from './Loading';
import WatchingWidget from './WatchingWidget';
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

  getFightDetails(fightId) {
    // /api/:fightId/fight => getFight
    fetch(`/api/${fightId}/fight`)
      .then(res => res.json())
      .then(data => {
        this.setState({
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
      });
  }

  componentDidMount() {
    const fightId = this.props.match.params.fightId;
    this.getFightDetails(fightId);

    if (auth.isAuthenticated) {
      this.checkIfUserHasVoted(fightId);
    }
  };

  render() {
    let antagonist = {},
        defender = {},
        defaultUserImg = '/user.png';

    const username = auth.user.username;
    const { isLive, isValid, textAgainst, showVotes, votedFor } = this.state;
    const fightId = this.props.match.params.fightId;
    const placeholderText = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis fugiat in impedit maxime blanditiis nam assumenda. Dicta quo sequi dolorum similique. Libero repudiandae esse voluptate impedit delectus enim, nostrum quos?';

    antagonist.imgpath = this.state.antagonist.avatarPath === ''
      ? defaultUserImg
      : this.state.antagonist.avatarPath;
    antagonist.username = this.state.antagonist.username;
    antagonist.argument = this.state.antagonist.argument;

    defender.imgpath = this.state.defender.avatarPath === ''
      ? defaultUserImg
      : this.state.defender.avatarPath;
    defender.username = this.state.defender.username;

    defender.argument = isLive
                          ? <p className="fight-text">{this.state.defender.argument}</p>
                          : <p className='fight-text blurred'>{placeholderText}</p>

    const userCanDefend = (
      username === defender.username && this.state.isLive === false
    );

    const userCanVote = (
      auth.hasValidToken() &&
      isLive === true &&
      showVotes === false &&
      !(username === defender.username || username === antagonist.username)
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

    return (
      <div>
        <div className='contentPadding'>
          { auth.hasValidToken()
            ? <WatchingWidget
                userId={auth.user.userid}
                fightId={this.props.location.pathname.split('/').pop()}
              />
            : ''
          }
        { this.state.fightTitle
          ? <React.Fragment>
              <h2 className="hatchetTitle">{this.state.fightTitle}</h2>
              <div className="featured-fights-container">
                <div className="user1">

                  <Avatar imgpath={antagonist.imgpath} width='100px' height='100px'>
                    <h3>{antagonist.username}</h3>
                  </Avatar>

                  <p className="fight-text">{antagonist.argument}</p>
                  <VotesCount
                    votedFor={votedFor}
                    isLive={isLive}
                    showVotes={showVotes}
                    side='for'
                    votes={this.state.votes.for} />
                  <VotingButton side='for' username={antagonist.username} />
                </div>
                <VersusImg />
                <div className="user2 fullWidth">
                  <Avatar imgpath={defender.imgpath} width='100px' height='100px'>
                    <h3>{defender.username}</h3>
                  </Avatar>

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
                    votedFor={votedFor}
                    isLive={isLive}
                    showVotes={showVotes}
                    side='against'
                    votes={this.state.votes.against} />
                  <VotingButton side='against' username={defender.username} />
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
