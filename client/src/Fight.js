import React, { Component } from 'react';
import { auth } from './Auth';
import Loading from './Loading';
import WatchingWidget from './WatchingWidget';
import StartHatchet from './shared/components/StartHatchet';
import TextareaWithCountdown from './shared/components/TextareaWithCountdown';
import VersusImg from './shared/components/VersusImg';
import Vote from './Vote';
import './css/Fight.css';
import './css/Watching.css';

function UserAvatar({
  imgpath,
  username
}) {
  return (
    <div className="user-avatar">
      <div style={{
        backgroundSize: 'cover',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        display: 'inline-block',
        backgroundImage: `url(${imgpath})` }}>
      </div>
      <h2>
        {username}
      </h2>
    </div>
  )
};

class Fight extends Component {
  constructor() {
    super();
    this.state = {
      isValid: false,
      isLive: false,
      textAgainst: '',
      fight: '',
      fight_title: '',
      fight_type: '',
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

  afterVote(votes) {
    let newState = Object.assign({}, this.state);
    newState.votes.for = votes.for;
    newState.votes.against = votes.against;
    this.setState(newState);
  }

  handleTextareaChange(fieldValidity, val) {
    this.setState({
      isValid: fieldValidity,
      textAgainst: val
    });
  }

  componentDidMount() {
    const fightId = this.props.match.params.fightId;
    // /api/:fightId/fight => getFight
    fetch(`/api/${fightId}/fight`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          isLive: data.fight.isLive,
          fight_title: data.fight.title,
          fight_type: data.fight.type,
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
  };

  render() {
    let antagonist = {},
        defender = {},
        defaultUserImg = '/user.png';

    const username = auth.user.username;
    const { isLive, isValid, textAgainst } = this.state;
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
      this.state.isLive === true &&
      !(username === defender.username || username === antagonist.username)
    );

    const VotesCount = props => {
      return (
        isLive
          ? <p className="total-votes">Votes: {props.votes}</p>
          : ''
      )
    };

    const VotingButton = props => {
      return (
        userCanVote
          ? <Vote
              fightId={fightId}
              side={props.side}
              username={antagonist.username}
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
        { this.state.fight_title
          ? <React.Fragment>
              <h2>{this.state.fight_title}</h2>
              <div className="featured-fights-container">
                <div className="user1">
                  <UserAvatar
                    imgpath={antagonist.imgpath}
                    username={antagonist.username}
                  />
                  <p className="fight-text">{antagonist.argument}</p>
                  <VotesCount votes={this.state.votes.for} />
                  <VotingButton side='for' />
                </div>
                <VersusImg />
                <div className="user2 fullWidth">
                  <UserAvatar
                    imgpath={defender.imgpath}
                    username={defender.username}
                  />
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
                  <VotesCount votes={this.state.votes.against} />
                  <VotingButton side='against' />
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
