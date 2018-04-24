import React, { Component } from 'react';
import { auth } from './Auth.js';
import Avatar from './shared/components/Avatar';
import FancyFileInput from './shared/components/FancyFileInput';

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

export default AvatarContainer;
