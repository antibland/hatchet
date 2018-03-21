import React, { Component } from 'react';
import Loading from './Loading';
import './css/Fight.css';

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
      fight: '',
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
  }

  componentDidMount() {
    let fightId = this.props.match.params.fightId;
    // /api/:fightId/fight => getFight
    fetch(`/api/${fightId}/fight`)
      .then(res => res.json())
      .then(data => {
        this.setState({
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
          }
        });

        data.fight.type !== 'philosophical'
          ? this.setState({
              defender: {
                avatarPath: data.fight.defender.avatar
                  ? data.fight.defender.avatar.path
                  : '',
                username: data.fight.defender.username
              }
            })
          : this.setState({
              defender: {
                avatarPath: '',
                username: ''
              }
            })
      });
  };

  render() {
    let antagonist = {},
        defender = {},
        defaultUserImg = '/user.png';

    antagonist.imgpath = this.state.antagonist.avatarPath === ''
      ? defaultUserImg
      : this.state.antagonist.avatarPath;

    if (this.state.fight_type === 'philosophical') {
      defender.imgpath = '/earth.png';
      defender.username = 'The Internet';
      defender.argument = `Is ${this.state.antagonist.username} right? What do you think? Have a good, hard look and vote.`
    } else {
      defender.imgpath = this.state.defender.avatarPath === ''
        ? defaultUserImg
        : this.state.defender.avatarPath;
      defender.username = this.state.defender.username;
      defender.argument = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis fugiat in impedit maxime blanditiis nam assumenda. Dicta quo sequi dolorum similique. Libero repudiandae esse voluptate impedit delectus enim, nostrum quos?'
    }

    return (
      <div>
      { this.state.fight_type
        ? <div className="featured-fights-container">
            <div className="user1">
              <UserAvatar
                imgpath={antagonist.imgpath}
                username={this.state.antagonist.username}
              />
              <p className="fight-text">{this.state.antagonist.argument}</p>
              <p className="total-votes">Votes: {this.state.votes.for}</p>
            </div>
            <img className="versus" src="/versus.png" alt="versus graphic"/>
            <div className="user2">
              <UserAvatar
                imgpath={defender.imgpath}
                username={defender.username}
              />
              <p className="fight-text">{defender.argument}</p>
              <p className="total-votes">Votes: {this.state.votes.against}</p>
            </div>
          </div>
        : <Loading />
      }
      </div>
    )
  }
}

// class FightsContainer extends Component {
//   constructor() {
//     super();
//     this.state = {
//       serverData: {}
//     };
//   }
//   componentDidMount() {
//     this.setState({
//       serverData: fakeServerData
//     });
//   }

//   render() {
//     let fights = null;

//     if (this.state.serverData.fights) {
//       fights = this.state.serverData.fights.map((fight) => {
//         return <Fight key={fight.id} data={fight} />
//       });
//     }
//     return (
//       <div>
//         {this.state.serverData.fights ?

//           <div className="featured-fights-container">
//             {fights}
//           </div> :

//           <h1>Loading…</h1>
//         }
//       </div>
//     )
//   }
// }

export default Fight;
