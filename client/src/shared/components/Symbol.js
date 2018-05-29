import React from 'react'
import PropTypes from 'prop-types'

const Symbol = props => {
  return (
    <svg aria-hidden="true" className={props.name}>
      <use xlinkHref={`/symbols/svg-defs.svg#${props.name}`} />
    </svg>
  )
};

Symbol.propTypes = {
  name: PropTypes.string.isRequired
};

export default Symbol;
