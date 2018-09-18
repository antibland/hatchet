import React, { Component } from "react";
import { auth } from "./Auth.js";
import Loading from "./Loading.js";
import AvatarContainer from "./AvatarContainer";
import MyHatchets from "./MyHatchets";
import "./css/Flash.css";
import "./css/ProfileFightList.css";
import "./css/Accordion.css";
import "./css/ImagePreview.css";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    let { loading } = this.state;
    return (
      <div>
        {loading === true ? (
          <Loading />
        ) : (
          <div>
            <h1 className="profileH1">Hey, {auth.user.username}!</h1>
            <AvatarContainer />
            <MyHatchets />
          </div>
        )}
      </div>
    );
  }
}

export default Profile;
