import React from 'react';
import PropTypes from 'prop-types';

const Logo = props => {
  return (
    <>
      <img
        className={(`logo ${props.direction}`)}
        src={
          props.direction === 'horizontal'
            ? 'logo.png'
            : 'logo-vertical.png'
        }
        srcSet={
          props.direction === 'horizontal'
            ? '/logo.png 1x, /logo@2x.png 2x, /logo@3x.png 3x'
            : '/logo-vertical.png 1x, /logo-vertical@2x.png 2x'
        }
        alt='Bury The Hatchet logo'
      />
    </>
  )
};

Logo.defaultProps = {
  direction: 'horizontal'
};

Logo.propTypes = {
  direction: PropTypes.string
};

export default Logo;
