import React from 'react';
import Symbol from '../../shared/components/Symbol';

const FancyFileInput = props => (
  <div>
    <input
      className="inputfile inputfile-1"
      type="file"
      onChange={props.updatePreviewImage}
      name="avatar"
      id="avatar" />
    <label htmlFor="avatar">
      <Symbol name='upload-icon' />
      <span>Choose a file&hellip;</span>
    </label>
  </div>
);

export default FancyFileInput;
