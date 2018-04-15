import React from 'react'

const Logo = () => {
  return (
    <React.Fragment>
      <img
        className='logo'
        src='/logo.png'
        srcSet='/logo.png 1x, /logo@2x.png 2x, /logo@3x.png 3x'
        alt='Bury The Hatchet logo'
      />
    </React.Fragment>
  )
}

export default Logo;
