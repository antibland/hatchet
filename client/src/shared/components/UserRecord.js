import React, { Component } from "react";
import styled from "styled-components";

const RecordLabel = styled.span`
  color: var(--teal);
  padding-right: 0.5rem;
`;

const RecordHighlight = styled.strong`
  color: var(--dark-text);
`;

class UserRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wins: 0,
      losses: 0,
      ties: 0
    };

    this.getUserRecord = this.getUserRecord.bind(this);
  }

  componentDidMount() {
    this.getUserRecord();
  }

  getUserRecord() {
    const { id } = this.props;
    // /api/:userId/record => getUserRecord
    let url = `/api/${id}/record`;
    fetch(url)
      .then(res => {
        return res.ok
          ? Promise.resolve(res.json())
          : Promise.reject({
              status: res.status,
              statusText: res.statusText
            });
      })
      .then(user => {
        if (user && user.record) {
          const { wins, losses, ties } = user.record;
          this.setState({ wins, losses, ties });
        }
      })
      .catch(err => console.error(err));
  }

  render() {
    const FightRecord = () => {
      const { ties, wins, losses } = this.state;
      return (
        <div>
          <RecordLabel>Wins/Losses/Ties:</RecordLabel>
          <RecordHighlight>
            {wins}-{losses}-{ties}
          </RecordHighlight>
        </div>
      );
    };

    return <FightRecord />;
  }
}

export default UserRecord;
