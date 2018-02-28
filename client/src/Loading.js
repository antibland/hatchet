import React from 'react';

const Loading = (props) => (
  <h1 className="loading-text">
    {props.text}
  </h1>
)

Loading.defaultProps = {
  text: 'Loading...'
};

export default Loading;
