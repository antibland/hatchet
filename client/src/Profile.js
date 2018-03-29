import React, { Component } from 'react';

import { auth } from './Auth.js';
import { Link } from 'react-router-dom';
import Loading from './Loading.js';
import Avatar from './shared/components/Avatar';
import FightsAccordion from './shared/components/FightsAccordion';
import FancyFileInput from './shared/components/FancyFileInput';
import './css/Flash.css';
import './css/ProfileFightList.css';
import './css/Accordion.css';
import './css/ImagePreview.css';

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
      pendingInvites: [],
      loading: true
    }
  }
  componentDidMount() {
    // /api/:userId/fights => getUserFights
    let url = `/api/${auth.user.userid}/fights`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({
          fights: data.fights,
          pendingInvites: data.pendingInvites,
          loading: false
        });
      });
  }

  render() {
    let pluralHelper = (len) => {
      return len === 1 ? 'fight' : 'fights';
    };
    let { fights, pendingInvites } = this.state;

    let fight_len = fights.length;
    let fight_noun = pluralHelper(fight_len);

    let pending_len = pendingInvites.length;
    let pending_noun = pluralHelper(pending_len);

    return (
      <div>
        { this.state.loading === true
          ? <Loading />
          : <div>
              <h1 className="profileH1">Hey, {auth.user.username}!</h1>
              <AvatarContainer />

              { pending_len
                ? <h2 className="profileH2">
                    You've been invited to { pending_len } { pending_noun }.
                  </h2>
                : ''
              }
              <FightsAccordion
                obj={pendingInvites}
                indexModifier='pending_invites'
                action='accept invite' />

              { fight_len
                ? <h2 className="profileH2">You've started { fight_len } { fight_noun }.</h2>
                : ''
              }
              <FightsAccordion
                obj={fights}
                indexModifier='fights_started'
                emptyResponse= {
                  <p className="noResults">You have no active fights right now. <Link className='inlineLink' to='/create'>Start one</Link></p>
                }
              />

            </div>
        }
      </div>
    )
  }
}

export default Profile;
