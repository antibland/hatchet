import React, { Component } from 'react';
import { auth } from './Auth';
import Loading from './Loading';
import FightsAccordion from './shared/components/FightsAccordion';
import HatchetList from './shared/components/HatchetList';
class MyHatchets extends Component {
  constructor() {
    super();
    this.state = {
      waitingOnYou: [],
      waitingOnThem: [],
      active: [],
      loading: true
    };
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
      ? <React.Fragment>
          <h2>Waiting On You</h2>
          <FightsAccordion
            indexModifier='waitingOnYou'
            obj={waitingOnYou}
            action='accept invite' />
        </React.Fragment>
      : '';

    let _waitingOnThem = waitingOnThem.length
      ? <React.Fragment>
          <h2>Waiting On Them</h2>
          <FightsAccordion
            indexModifier='waitingOnThem'
            obj={waitingOnThem} />
        </React.Fragment>
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
              { _waitingOnYou }
              { _waitingOnThem }
              { _active }
            </div>
        }
      </div>
    );
  }
}

export default MyHatchets;
