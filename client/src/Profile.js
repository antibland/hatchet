import React, { Component } from 'react';
import { auth } from './Auth.js';
import Loading from './Loading.js';
import FightsAccordion from './shared/components/FightsAccordion';
import AvatarContainer from './AvatarContainer';
import HatchetList from './shared/components/HatchetList';
import './css/Flash.css';
import './css/ProfileFightList.css';
import './css/Accordion.css';
import './css/ImagePreview.css';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      waitingOnYou: [],
      waitingOnThem: [],
      active: [],
      loading: true
    }
  }
  componentDidMount() {
    // /api/:userId/fights => getUserFights
    let url = `/api/${auth.user.userid}/fights`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        let { active, waitingOnYou, waitingOnThem } = data;

        this.setState({
          active,
          waitingOnYou,
          waitingOnThem,
          loading: false
        });
      });
  }

  render() {
    let { waitingOnYou, waitingOnThem, active } = this.state;

    let _waitingOnYou = waitingOnYou.length
      ? <div className="block">
          <h2>Waiting On You</h2>
          <FightsAccordion
            indexModifier='waitingOnYou'
            obj={waitingOnYou}
            action='accept invite' />
        </div>
      : '';

    let _waitingOnThem = waitingOnThem.length
      ? <div className="block">
          <h2>Waiting On Them</h2>
          <FightsAccordion
            indexModifier='waitingOnThem'
            obj={waitingOnThem} />
        </div>
      : ''

   let _active = active.length
      ? <React.Fragment>
          <h2>Active Fights</h2>
          <ul className="fightList">
            <HatchetList fights={active} />
          </ul>
        </React.Fragment>
      : ''

    return (
      <div>
        { this.state.loading === true
          ? <Loading />
          : <div>
              <h1 className="profileH1">Hey, {auth.user.username}!</h1>
              <AvatarContainer />
              <div className="twoByTwo">
                { _waitingOnYou }
                { _waitingOnThem }
              </div>
              { _active }
            </div>
        }
      </div>
    )
  }
}

export default Profile;
