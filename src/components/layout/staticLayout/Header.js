import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../../svgs/Logo'
import SmallLogo from '../../../svgs/SmallLogo'

const Header = () => (
  <div className="static-header main-header">
    <div className="logo-section">
      <Link to="/">
        <Logo />
        <SmallLogo />
      </Link>
    </div>
  </div>
)

export default Header
