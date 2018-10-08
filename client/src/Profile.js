import React, { Component } from "react";
import { auth } from "./Auth.js";
import Loading from "./Loading.js";
import AvatarContainer from "./AvatarContainer";
import MyHatchets from "./MyHatchets";
import Modal from "./shared/components/Modal";
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
      chosenAvatar: null,
      avatars: {}
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.loadAvatars = this.loadAvatars.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: false });
    this.loadAvatars();
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
    this.setState({ isModalOpen: false });
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  handleClick(e) {
    const chosenAvatar = e.currentTarget.dataset.img;
    this.setState({ chosenAvatar });
  }

  render() {
    let { loading, isModalOpen, avatars, chosenAvatar } = this.state;

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
            <h1 className="profileH1">Hey, {auth.user.username}!</h1>
            <AvatarContainer
              onClick={this.openModal}
              chosenAvatar={chosenAvatar}
            />
            <MyHatchets />
          </div>
        )}
        <Modal
          isOpen={isModalOpen}
          closeModal={this.closeModal}
          style={modalStyles.content}
        >
          <React.Fragment>
            <h2 style={modalStyles.title}>Choose an avatar</h2>
            <div style={modalStyles.buttonContainer}>
              <UserAvatarList />
            </div>
          </React.Fragment>
        </Modal>
      </div>
    );
  }
}

export default Profile;
