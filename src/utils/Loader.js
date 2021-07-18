import React from 'react'
import propTypes from 'prop-types'
import SmallLogo from '../svgs/SmallLogo'

function Loader({ className }) {
  return (
    <div className={className}>
      <SmallLogo />
    </div>
  )
}

export default Loader

Loader.propTypes = {
  className: propTypes.elementType.isRequired,
}
