import React, { useState, useEffect } from 'react'
import propTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Logo from '../../../svgs/Logo'
import Hamburger from '../../../svgs/Hamburger'
import defaultAvatar from '../../../assets/images/profile-icon.png'
import Close from '../../../svgs/Close'
import MobileSwitchNav from './MobileSwitchNav'
import HeaderIcons from './HeaderIcons'
import HeaderProfile from './HeaderProfile'

const MobileHeader = (props) => {
  const { pathname } = props
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (showMenu) {
      document.body.classList.add('show-menu-html')
      document.querySelectorAll('html')[0].classList.add('show-menu-html')
    } else {
      document.body.classList.remove('show-menu-html')
      document.querySelectorAll('html')[0].classList.remove('show-menu-html')
    }
  }, [showMenu])

  const toggleNav = () => {
    setShowMenu(!showMenu)
  }

  return (
    <div
      className={`mobile-header-wrapper m-show ${
        showMenu ? 'show-menu-header' : ''
      }`}
    >
      <div className="admin-header main-header mobile-header">
        <div className="mobile-logo-section">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="header-left-section">
          <HeaderIcons />
          <div
            className="menu-toggle-btn"
            onClick={() => toggleNav()}
            onKeyDown={() => toggleNav()}
          >
            <Hamburger />
          </div>
        </div>
        <div className={`header-links-wrapper ${showMenu ? 'active' : ''}`}>
          <div className="mobile-menu-profile-block">
            <div
              className="close-icon-wrapper"
              onClick={() => toggleNav()}
              onKeyDown={() => toggleNav()}
            >
              <Close />
            </div>
            <div className="profile-image">
              <img src={defaultAvatar} alt="Profile" />
            </div>
            <HeaderProfile />
          </div>
          <MobileSwitchNav pathname={pathname} setShowMenu={setShowMenu} />
        </div>
      </div>
    </div>
  )
}

export default MobileHeader

MobileHeader.propTypes = {
  pathname: propTypes.shape({
    parent: propTypes.string.isRequired, // shape it as reducer have multiple states which we need to address and this is for object
  }).isRequired,
}
