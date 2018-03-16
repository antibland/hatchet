import React from 'react';

function Avatar({
  imgpath,
  backgroundSize,
  width,
  height,
  styles
}) {
  return (
    <div className="avatar">
      <div style={{
        backgroundSize: backgroundSize,
        width: width,
        height: height,
        borderRadius: '50%',
        display: 'inline-block',
        backgroundImage: `url(${imgpath})`,
        ...styles }}>
      </div>
    </div>
  )
};

Avatar.defaultProps = {
  imgpath: '/question_mark.png',
  backgroundSize: 'cover',
  width: '100px',
  height: '100px',
  styles: ''
};

export default Avatar;
