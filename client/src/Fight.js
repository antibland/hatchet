import React, { Component } from 'react';
import Loading from './Loading';

function extractRootPath(str) {
  return str.substr(str.lastIndexOf('/')+1);
}

function UserAvatar({
  imgpath,
  username
}) {
  let rootPath = '/avatars/' + extractRootPath(imgpath);

  return (
    <div className="user-avatar">
      <div style={{
        backgroundSize: 'cover',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        display: 'inline-block',
        backgroundImage: `url(${rootPath})` }}>
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
    console.log(this.state.fight)
    let antagonist_avatar = 'this.state.fight.antagonist.avatar';
    let defender_avatar = 'this.state.fight.antagonist.avatar';
    let styles = {
      antagonist: {
        avatar: {
          backgroundSize: '100% 100%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          display: 'inline-block',
          backgroundImage: `url(${antagonist_avatar})`
        }
      },
      defender: {
        avatar: {
          backgroundSize: '100% 100%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          display: 'inline-block',
          backgroundImage: `url(${defender_avatar})`
        }
      }
    };

    return (
      <div className="featured-fights-container">
      { this.state.fight
        ? <div>
            <header className="fight-header">
              <div className="user1">
                <UserAvatar
                  imgpath={this.state.fight.antagonist.avatar.path}
                  username={this.state.fight.antagonist.username}
                />
              </div>
              <div className="user2">
              <UserAvatar
                  imgpath={this.state.fight.antagonist.avatar.path}
                  username='Other person'
                />
              </div>
            </header>
            <div className="fight-arguments">
              <div className="antagonist-argument">
                <p className="fight-text">{(this.state.fight.text.for).substring(0, 100) + '…'}</p>
                <p className="total-votes">Votes: {this.state.fight.votes.for}</p>
              </div>
              <div className="defender-argument">
                <p className="fight-text">Argument against...</p>
                <p className="total-votes">Votes: {this.state.fight.votes.against}</p>
              </div>
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
