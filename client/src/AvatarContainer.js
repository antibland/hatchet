import React, { Component } from "react";
import { auth } from "./Auth.js";
import Avatar from "./shared/components/Avatar";

class AvatarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAvatar: null,
      userId: null
    };
  }

  getAvatar() {
    // /api/:userId/avatar", userApi.getAvatar
    fetch(`/api/${this.state.userId}/avatar`)
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
    this.setState({ userId: this.props.userId }, () => {
      this.getAvatar();
    });
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

          auth.authenticate(() => {
            auth.user = {
              username: auth.user.username,
              userid: auth.user.userid,
              token: auth.token,
              avatar: nextProps.chosenAvatar
            };
            localStorage.setObject("user", auth.user);
            auth.isAuthenticated = auth.hasValidToken();
          });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  render() {
    let { currentAvatar } = this.state;

    let _currentAvatar = currentAvatar ? (
      <Avatar
        imgpath={`/svg/avatars/${currentAvatar}`}
        width="250px"
        height="250px"
        onClick={this.props.onClick}
      />
    ) : (
      <Avatar width="250px" height="250px" onClick={this.props.onClick} />
    );

    return <div className="profilePage">{_currentAvatar}</div>;
  }
}

export default AvatarContainer;
