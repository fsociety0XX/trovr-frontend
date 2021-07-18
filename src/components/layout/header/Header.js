import React from 'react'
import propTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Logo from '../../../svgs/Logo'
import SmallLogo from '../../../svgs/SmallLogo'
import HeaderRight from './HeaderRight'
import SwitchNav from './SwitchNav'

const Header = ({ pathname }) => (
  <div
    className={`${
      localStorage.getItem('role') === 'consumer'
        ? 'consumer-header'
        : 'admin-header'
    } main-header m-hide`}
  >
    <div className="logo-section">
      <Link to="/">
        <Logo />
        <SmallLogo />
      </Link>
    </div>
    <div className="header-left-section">
      <SwitchNav pathname={pathname} />
    </div>
    <HeaderRight pathname={pathname} />
  </div>
)

export default Header

Header.propTypes = {
  pathname: propTypes.shape({
    parent: propTypes.string.isRequired, // shape it as reducer have multiple states which we need to address and this is for object
  }).isRequired,
}
