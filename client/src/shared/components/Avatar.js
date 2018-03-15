import React from 'react';

function Avatar({
  imgpath,
  backgroundSize,
  width,
  height
}) {
  return (
    <div className="avatar">
      <div style={{
        backgroundSize: backgroundSize,
        width: width,
        height: height,
        borderRadius: '50%',
        display: 'inline-block',
        backgroundImage: `url(${imgpath})` }}>
      </div>
    </div>
  )
};

Avatar.defaultProps = {
  imgpath: '/question_mark.png',
  backgroundSize: 'cover',
  width: '100px',
  height: '100px'
};

export default Avatar;
