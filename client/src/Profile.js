import React, { Component } from "react";
import { auth } from "./Auth.js";
import Loading from "./Loading.js";
import AvatarContainer from "./AvatarContainer";
import MyHatchets from "./MyHatchets";
import Modal from "./shared/components/Modal";
import UserRecord from "./shared/components/UserRecord";
import "./css/Flash.css";
import "./css/ProfileFightList.css";
import "./css/Accordion.css";
import "./css/ImagePreview.css";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      isModalOpen: false,
      changedAvatar: false,
      chosenAvatar: null,
      userId: null,
      userName: null,
      avatars: {}
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.loadAvatars = this.loadAvatars.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.loadUser = this.loadUser.bind(this);
  }

  componentDidMount() {
    this.loadUser();
    this.loadAvatars();
  }

  loadUser() {
    let urlParts = document.location.href.split("/");
    if (urlParts.length !== 5) {
      this.setState({
        loading: false,
        userId: auth.user.userid,
        userName: auth.user.username
      });
      return;
    }

    // "/api/:userId" => userApi.getUser
    // retrieve id, username
    fetch(`/api/${urlParts.pop()}`)
      .then(res => {
        return res.ok
          ? Promise.resolve(res.json())
          : Promise.reject({
              status: res.status,
              statusText: res.statusText
            });
      })
      .then(data => {
        this.setState(
          { userId: data.user._id, userName: data.user.username },
          () => this.setState({ loading: false })
        );
      })
      .catch(err => console.error(err));
  }

  loadAvatars() {
    function importAll(r) {
      let avatars = {};
      r.keys().map(item => {
        return (avatars[item.replace("./", "")] = r(item));
      });
      return avatars;
    }

    const avatars = importAll(
      require.context("../public/svg/avatars", false, /\.(svg)$/)
    );
    this.setState({ avatars });
  }

  closeModal() {
    this.setState({ isModalOpen: false }, () => {
      if (this.state.changedAvatar === true) {
        window.location.reload();
      }
    });
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  handleClick(e) {
    const chosenAvatar = e.currentTarget.dataset.img;
    this.setState({ chosenAvatar, changedAvatar: true });
  }

  render() {
    const { loading, isModalOpen, avatars, chosenAvatar, userId } = this.state;

    const self = auth.user.userid === userId;

    const ProfileHeader = () => {
      const { userName } = this.state;
      let headerText =
        userName === auth.user.username ? `Hey, ${userName}!` : userName;
      return <h1 className="profileH1">{headerText}</h1>;
    };

    const modalStyles = {
      content: {
        width: "23em",
        paddingLeft: "1.5em",
        paddingRight: "1.5em"
      },
      title: {
        color: "white",
        marginTop: 0
      },
      buttonContainer: {
        marginBottom: "1em"
      },
      avatarButton: {
        width: "85px",
        height: "85px",
        backgroundColor: "transparent",
        border: "none"
      }
    };

    const UserAvatarList = () => {
      let buttons = [];
      let index = 0;
      for (let a in avatars) {
        buttons.push(
          <button
            key={`${++index}-${a}`}
            data-img={a}
            onClick={this.handleClick}
            style={modalStyles.avatarButton}
            dangerouslySetInnerHTML={{
              __html: `<img src='/svg/avatars/${a}' alt='' />`
            }}
          />
        );
      }
      return buttons;
    };

    return (
      <div>
        {loading === true ? (
          <Loading />
        ) : (
          <div>
            <UserRecord id={userId} />
            <ProfileHeader />
            <AvatarContainer
              onClick={() => {
                if (self) this.openModal();
              }}
              chosenAvatar={chosenAvatar}
              userId={userId}
            />
            {self && <MyHatchets />}
          </div>
        )}
        <Modal
          isOpen={isModalOpen}
          onAction={this.closeModal}
          style={modalStyles.content}
        >
          <>
            <h2 style={modalStyles.title}>Choose an avatar</h2>
            <div style={modalStyles.buttonContainer}>
              <UserAvatarList />
            </div>
          </>
        </Modal>
      </div>
    );
  }
}

export default Profile;
