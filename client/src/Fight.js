import React, { Component } from 'react';
import { auth } from './Auth';
import Loading from './Loading';
import WatchingWidget from './WatchingWidget';
import StartHatchet from './shared/components/StartHatchet';
import TextareaWithCountdown from './shared/components/TextareaWithCountdown';
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

    const placeholderText = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis fugiat in impedit maxime blanditiis nam assumenda. Dicta quo sequi dolorum similique. Libero repudiandae esse voluptate impedit delectus enim, nostrum quos?';

    const userCanDefend = (
      auth.user.username === this.state.defender.username && this.state.isLive === false
    );

    const fightId = this.props.match.params.fightId;

    const { isLive, isValid, textAgainst } = this.state;

    const votesFor = isLive
                      ? <p className="total-votes">Votes: {this.state.votes.for}</p>
                      : '';
    const votesAgainst = isLive
                          ?  <p className="total-votes">Votes: {this.state.votes.against}</p>
                          : '';

    antagonist.imgpath = this.state.antagonist.avatarPath === ''
      ? defaultUserImg
      : this.state.antagonist.avatarPath;
    antagonist.username = this.state.antagonist.username;

    defender.imgpath = this.state.defender.avatarPath === ''
      ? defaultUserImg
      : this.state.defender.avatarPath;
    defender.username = this.state.defender.username;

    defender.argument = isLive
                          ? <p className="fight-text">{this.state.defender.argument}</p>
                          : <p className='fight-text blurred'>{placeholderText}</p>

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
                    username={this.state.antagonist.username}
                  />
                  <p className="fight-text">{this.state.antagonist.argument}</p>
                  { votesFor }
                  <Vote
                    fightId={fightId}
                    side='for'
                    username={antagonist.username}
                    afterVote={this.afterVote}
                  />
                </div>
                <img className="versus" src="/versus.small.png" alt="versus graphic"/>
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
                  { votesAgainst }
                  <Vote
                    fightId={fightId}
                    side='against'
                    username={defender.username}
                    afterVote={this.afterVote}
                  />
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
