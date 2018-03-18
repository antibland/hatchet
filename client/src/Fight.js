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
      fight: ''
    };
  }

  componentDidMount() {
    let fightId = this.props.match.params.fightId;
    fetch(`/api/${fightId}/fight`)
      .then(res => res.json())
      .then(data => {
        this.setState({ fight: data.fight })
      });
  }

  render() {
    let antagonist = {},
        defender = {};

    antagonist.imgpath = (this.state.fight.antagonist && this.state.fight.antagonist.avatar)
    ? this.state.fight.antagonist.avatar.path
    : '/question_mark.png';

    if (this.state.fight.type === 'philosophical') {
      defender.imgpath = '/earth.png';
      defender.username = 'The Internet';
      defender.fightText = `Is ${this.state.fight.antagonist.username} right? What do you think? Have a good, hard look and vote.`
    } else {
      defender.imgpath = '/question_mark.png'; // <-- Make this real
      defender.username = 'Another user';
      defender.fightText = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis fugiat in impedit maxime blanditiis nam assumenda. Dicta quo sequi dolorum similique. Libero repudiandae esse voluptate impedit delectus enim, nostrum quos?'
    }

    return (
      <div>
      { this.state.fight
        ? <div className="featured-fights-container">
            <div className="user1">
              <UserAvatar
                imgpath={antagonist.imgpath}
                username={this.state.fight.antagonist.username}
              />
              <p className="fight-text">{this.state.fight.text.for}</p>
              <p className="total-votes">Votes: {this.state.fight.votes.for}</p>
            </div>
            <img className="versus" src="/versus.png" alt="versus graphic"/>
            <div className="user2">
              <UserAvatar
                imgpath={defender.imgpath}
                username={defender.username}
              />
              <p className="fight-text">{defender.fightText}</p>
              <p className="total-votes">Votes: {this.state.fight.votes.against}</p>
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
