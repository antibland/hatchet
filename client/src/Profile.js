import React, { Component } from "react";
import { auth } from "./Auth.js";
import styled from "styled-components";
import Loading from "./Loading.js";
import AvatarContainer from "./AvatarContainer";
import MyHatchets from "./MyHatchets";
import Modal from "./shared/components/Modal";
import UserRecord from "./shared/components/UserRecord";
import utilities from "./shared/utilities";
import "./css/Flash.css";
import "./css/ProfileFightList.css";
import "./css/Accordion.css";
import "./css/ImagePreview.css";

const UserInfoText = styled.div`
  padding-left: 1em;

  ${utilities.media.phone`
    padding: .5rem 0.5rem 0 0;
    font-size: 1.25rem;
  `}
`;

const ProfileHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;

  ${utilities.media.phone`
    flex-direction: column;
  `}
`;

const Username = styled.h2`
  color: var(--red);
  text-align: left;
  font-size: 2rem;
  margin: 0;
  line-height: 1;
  padding: 4px 0;

  ${utilities.media.phone`
    text-align: center;
    margin: 0 auto;
    max-width: calc(100vw - 40px);
  `}
`;

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      isModalOpen: false,
      hasAvatarChanged: false,
      chosenAvatar: null,
      userId: null,
      userName: null,
      currentAvatar: auth.user.avatar,
      avatars: {}
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.loadAvatars = this.loadAvatars.bind(this);
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
      if (this.state.hasAvatarChanged === true) {
        window.location.reload();
      }
    });
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  handleClick(index, e) {
    let { currentAvatar } = this.state;
    const hasAvatarChanged = e.currentTarget.dataset.originalavatar !== "true";
    const chosenAvatar =
      hasAvatarChanged === true ? e.currentTarget.dataset.img : currentAvatar;
    this.setState({ chosenAvatar, selectedIndex: index, hasAvatarChanged });
  }

  render() {
    const {
      loading,
      isModalOpen,
      avatars,
      chosenAvatar,
      userId,
      userName
    } = this.state;

    const self = auth.user.userid === userId;

    const UserInfo = () => {
      return (
        <UserInfoText>
          <Username className="ellipsize">{userName}</Username>
          <UserRecord id={userId} />
        </UserInfoText>
      );
    };

    const ProfileHeaderContent = () => {
      return (
        <>
          <AvatarContainer
            onClick={() => {
              if (self) this.openModal();
            }}
            chosenAvatar={chosenAvatar}
            userId={userId}
            width="150px"
            height="150px"
          />
          <UserInfo />
        </>
      );
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
      const { currentAvatar, selectedIndex } = this.state;

      for (let a in avatars) {
        buttons.push(
          <button
            key={`${++index}-${a}`}
            data-img={a}
            onClick={this.handleClick.bind(this, index)}
            className="avatarButton"
            data-selected={index === selectedIndex}
            data-originalavatar={a === currentAvatar}
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
          <>
            <ProfileHeader>
              <ProfileHeaderContent />
            </ProfileHeader>
            {self && <MyHatchets />}
          </>
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
