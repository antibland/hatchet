import React, { Component } from "react";
import { auth } from "./Auth.js";
import Avatar from "./shared/components/Avatar";

class AvatarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAvatar: null
    };
  }

  getAvatar() {
    // /api/:userId/avatar", userApi.getAvatar
    fetch(`/api/${auth.user.userid}/avatar`)
      .then(res => {
        if (res.ok) {
          return res;
        } else {
          throw Error(`Request rejected with status ${res.status}`);
        }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({
          currentAvatar: data.avatar
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentDidMount() {
    this.getAvatar();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chosenAvatar !== this.props.chosenAvatar) {
      // /api/:userId/avatar", userApi.setAvatar
      const url = `/api/${auth.user.userid}/avatar`;

      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentAvatar: nextProps.chosenAvatar
        })
      })
        .then(res => {
          if (res.ok) {
            return res;
          } else {
            throw Error(`Request rejected with status ${res.status}`);
          }
        })
        .then(res => res.json())
        .then(() => {
          this.setState({ currentAvatar: nextProps.chosenAvatar });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  render() {
    let { currentAvatar } = this.state;

    let defaultUser = "/user.png";

    let _currentAvatar = currentAvatar ? (
      <Avatar
        imgpath={`svg/avatars/${currentAvatar}`}
        width="250px"
        height="250px"
        onClick={this.props.onClick}
      />
    ) : (
      <Avatar
        imgpath={defaultUser}
        width="120px"
        height="120px"
        onClick={this.props.onClick}
      />
    );

    return <div>{_currentAvatar}</div>;
  }
}

export default AvatarContainer;
