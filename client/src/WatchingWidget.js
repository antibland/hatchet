import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Symbol from './shared/components/Symbol';

class WatchingWidget extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      watching: null,
      watchingText: '',
      userId: null,
      fightId: null
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { userId, fightId } = this.state;
    //'/api/:userId/:fightId/setWatch' => userApi.setWatch
    fetch(`/api/${userId}/${fightId}/setWatch`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PATCH'
    }).then(res => res.json())
      .then(data => {
        this.setState({
          watchingText: data.isWatching === true ? 'Watching' : 'Not watching'
        });
      });
  }

  componentDidMount() {
    const { userId, fightId } = this.props;
    this.setState({ userId, fightId });

    //'/api/:userId/:fightId/isUserWatchingFight' => userApi.isUserWatchingFight
    fetch(`/api/${userId}/${fightId}/isUserWatchingFight`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          watchingText: data.isWatching === true ? 'Watching' : 'Not watching'
        });
      });
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} className='watchingEye removeDefaultButtonStyles'>
          <Symbol name='watching-eye' />
          <span className='watchingEyeText'>{this.state.watchingText}</span>
        </button>
      </div>
    )
  }
}

WatchingWidget.propTypes = {
  userId: PropTypes.string.isRequired,
  fightId: PropTypes.string.isRequired
};

export default WatchingWidget;
