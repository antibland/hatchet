import React, { Component } from 'react';
import { auth } from './Auth.js';
import { Link } from 'react-router-dom';
import Loading from './Loading.js';
import Moment from 'react-moment';
import Avatar from './shared/components/Avatar';
import './css/Flash.css';
import './css/ProfileFightList.css';
import './css/Accordion.css';
import './css/ImagePreview.css';

const FancyFileInput = (props) => (
  <div>
    <input
      className="inputfile inputfile-1"
      type="file"
      onChange={props.updatePreviewImage}
      name="avatar"
      id="avatar" />
    <label htmlFor="avatar">
    <svg aria-hidden="true" className="upload-icon">
      <use xlinkHref="./symbols/svg-defs.svg#upload-icon" />
    </svg>
    <span>Choose a file&hellip;</span>
    </label>
  </div>
)
class AvatarContainer extends Component {
  constructor() {
    super();
    this.state = {
      file: '',
      imagePreviewUrl: '',
      errors: [],
      flash: {
        type: null,
        message: null
      },
      currentAvatarUrl: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  setAvatar() {
    fetch(`/api/${auth.user.userid}/avatar`)
      .then(res => res.json())
      .then(data => {
        if (data.type === 'success' && data.avatar !== null) {
          this.setState({
            currentAvatarUrl: data.avatar,
            imagePreviewUrl: ''
          });
        }
      });
  }

  componentDidMount() {
    this.setAvatar();
  }

  handleSubmit(e) {
    e.preventDefault();

    const url = `/api/${auth.user.userid}/avatar`;

    let formData = new FormData();
    let { file } = this.state;

    formData.append('avatar', file);

    fetch(url, {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(data => {
        if (data.type === 'success') {
          this.setState({
            flash: {
              message: data.message,
              type: 'success'
            }
          });
          this.setAvatar();
        } else if (data.type === 'failure') {
          this.setState({
            flash: {
              message: data.message,
              type: 'error'
            }
          });
        }
      });
  }

  handleChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    const fileType = file.type;
    const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif'];
    const maxFileSize = 130000; // 130KB
    let ext = fileType.substr(fileType.lastIndexOf('/')+1);
    let message = '';
    this.setState({ errors: []});
    let errors = [];

    if (!allowedFileTypes.includes(ext)) {
      message = `👽 ${ext} is an alien file extension. Stick with 'jpg', 'png', or 'gif'`;
      errors.push(message);
    }

    if (file.size > maxFileSize) {
      message = '🐳 We don\'t mean to fat-shame your file size, but it\'s too big. 130KB is the max.';
      errors.push(message);
    }

    if (errors.length) {
      this.setState({
        errors: errors,
        imagePreviewUrl: ''
      });
    } else {
      reader.onloadend = () => {
        this.setState({
          file,
          imagePreviewUrl: reader.result,
          errors: []
        });
      };

      reader.readAsDataURL(file);
    }
  }

  render() {
    const form_action = `/api/${auth.user.userid}/avatar`;

    let { imagePreviewUrl, currentAvatarUrl, errors } = this.state;
    let imagePreview = null;

    let defaultUser = '/user.png';

    let styles = {
      previewContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      }
    };

    if (imagePreviewUrl) {
      imagePreview = (
        <div style={styles.previewContainer}>
          <Avatar imgpath={imagePreviewUrl} width='120px' height='120px' />

          <button className="submitButton" type="submit">
            Replace it!
          </button>
        </div>
      );
    } else {
      imagePreview = '';
    }

    let imagePreviewErrors = errors.length
      ? errors.map((error, index) => {
          return <li key={index}>{ error }</li>
        })
      : '';

    let currentAvatar = currentAvatarUrl
      ? <Avatar imgpath={currentAvatarUrl} width='120px' height='120px' />
      : <Avatar imgpath={defaultUser} width='120px' height='120px' />

    let flashClasses = this.state.flash.type !== null
      ? `flash ${this.state.flash.type} bottom-margin`
      : '';

    let flashMessage = this.state.flash.message !== null
      ? <div className={flashClasses}>
          { this.state.flash.message }
        </div>
      : '';

    return (
      <div className="previewComponent">
        <form
          method="POST"
          encType="multipart/form-data"
          action={ form_action }
          onSubmit={this.handleSubmit}>

          { flashMessage }

          { currentAvatar }

          <FancyFileInput updatePreviewImage={this.handleChange} />

          { imagePreview }
          <ul className="inlineErrorList">
            { imagePreviewErrors }
          </ul>
        </form>
      </div>
    )
  }
}
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      fights: [],
      loading: true
    }
  }
  componentDidMount() {
    let url = `/api/${auth.user.userid}/fights`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({
          fights: data.fights,
          loading: false
        });
      });
  }

  render() {
    let fight_noun = '';
    let fight_len = this.state.fights.length;
    if (fight_len === 1) {
      fight_noun = 'fight';
    } else if (fight_len > 1) {
      fight_noun = 'fights';
    }

    return (
      <div>
        { this.state.loading === true
          ? <Loading />
          : <div>
              <h1 className="profileH1">Hey, {auth.user.username}!</h1>
              <AvatarContainer />
              { fight_len
                ? <h2 className="profileH2">{ fight_len } { fight_noun } found</h2>
                : ''
              }
              <div className="fightlist tablist">
              { this.state.fights.length
                ? this.state.fights.map((fight, index) => {
                  return (
                    <div className="tab" key={fight._id}>
                      <input id={"tab-" + index} type="checkbox" name="tabs" />
                      <label className="tab-label" htmlFor={"tab-" + index}>{fight.title}</label>
                      <div className="tab-content">
                        <div className="tab-content-inner">
                          <div className="meta">
                            <span className="created">
                              <strong>Created: </strong>
                              <Moment fromNow format='MMMM Do YYYY'>{fight.created_at}</Moment>
                            </span>
                            <span className="type"><strong>Type: </strong>A {fight.type} fight.</span>
                            <span className="text">{fight.text.for}</span>
                            { fight.isLive
                              ? <Link className="button" to={'/fight/' + fight._id}>View the fight</Link>
                              : <div>
                                  <p className="system-message">
                                  <svg aria-hidden="true" className="system-tip">
                                    <use xlinkHref="./symbols/svg-defs.svg#system-tip" />
                                  </svg>
                                    We are still waiting to hear from that coward to respond. Remain patient.
                                  </p>
                                  <Link className="button" to={'/fight/' + fight._id}>View fight</Link>
                                </div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
                : <p>You have no fights just yet. <Link to='/create'>Start one</Link></p>
              }
              </div>
            </div>
        }
      </div>
    )
  }
}

export default Profile;
