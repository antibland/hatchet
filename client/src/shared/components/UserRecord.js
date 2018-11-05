import React, { Component } from "react";
import styled from "styled-components";
import { auth } from "../../Auth";

const Record = styled.h2`
  padding: 15px 0 0;
`;

const RecordHighlight = styled.strong`
  background: var(--dark-text);
  color: white;
  padding: 0 10px;
  animation: simpleFadeIn 0.8s forwards ease-in 0.2s;
  opacity: 0;
  visibility: hidden;
  text-shadow: 0 0 1px var(--red);
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
    const { id } = this.props;
    const self = auth.user.userid === id;

    const FightRecord = () => {
      const { ties, wins, losses } = this.state;
      let recordText = self ? "Your record is " : "Record: ";
      return (
        <>
          <Record>
            {recordText}
            <RecordHighlight>
              {wins}-{losses}-{ties}
            </RecordHighlight>
          </Record>
        </>
      );
    };

    return <FightRecord />;
  }
}

export default UserRecord;
