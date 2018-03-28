import React from 'react';

const FancyFileInput = props => (
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
);

export default FancyFileInput;
