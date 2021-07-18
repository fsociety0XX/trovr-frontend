import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Hamburger from '../../../svgs/Hamburger'
import * as url from '../../../utils/urls'

const MobileSwitchNav = ({ pathname, setShowMenu }) => {
  const [showHeaderLinks, setShowHeaderLinks] = useState(false)
  const roles = ['systemUser', 'systemManager', 'systemAdmin']

  const toggleHeaderLinks = () => {
    setShowHeaderLinks(!showHeaderLinks)
  }

  const adminSettingMenu = () => (
    <>
      <div
        className="header-links-toggle-btn"
        onClick={() => {
          toggleHeaderLinks()
        }}
        onKeyDown={() => {
          toggleHeaderLinks()
        }}
      >
        <Hamburger />
      </div>
      <ul className={`header-links two-lines ${showHeaderLinks ? 'show' : ''}`}>
        {localStorage.getItem('role') !== 'systemManager' && (
          <>
            <li>
              <NavLink
                onClick={() => setShowMenu()}
                onKeyDown={() => setShowMenu()}
                exact
                to={url.adminSettings}
              >
                3rd Party Configurations
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => setShowMenu()}
                onKeyDown={() => setShowMenu()}
                exact
                to="/admin"
              >
                Payout Variables
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => setShowMenu()}
                onKeyDown={() => setShowMenu()}
                exact
                to="/admin"
              >
                Language Translation Table
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink
            onClick={() => setShowMenu()}
            onKeyDown={() => setShowMenu()}
            exact
            to={url.staff}
          >
            Admin Staff
          </NavLink>
        </li>
        {localStorage.getItem('role') === 'systemAdmin' && (
          <li>
            <NavLink
              onClick={() => setShowMenu()}
              onKeyDown={() => setShowMenu()}
              exact
              to="/admin"
            >
              Triggers
            </NavLink>
          </li>
        )}
      </ul>
    </>
  )

  if (roles.includes(localStorage.getItem('role'))) {
    switch (pathname.children) {
      case 'consumer':
      case 'segments':
        return (
          <ul className="header-links">
            <li>
              <NavLink
                onClick={() => setShowMenu()}
                onKeyDown={() => setShowMenu()}
                exact
                to={url.consumer}
              >
                Consumer
              </NavLink>
            </li>
            {localStorage.getItem('role') !== 'systemUser' && (
              <>
                <li>
                  <NavLink
                    onClick={() => setShowMenu()}
                    onKeyDown={() => setShowMenu()}
                    to={url.segment}
                  >
                    Segments
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={() => setShowMenu()}
                    onKeyDown={() => setShowMenu()}
                    to={url.consumerHistory}
                  >
                    Consumer History
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        )
      case 'merchant':
        return (
          <ul className="header-links">
            <li>
              <NavLink
                onClick={() => setShowMenu()}
                onKeyDown={() => setShowMenu()}
                to={url.merchant}
              >
                Merchant
              </NavLink>
            </li>
          </ul>
        )
      case 'voucher':
        return (
          <ul className="header-links">
            <li>
              <NavLink
                onClick={() => setShowMenu()}
                onKeyDown={() => setShowMenu()}
                to={url.voucher}
              >
                Voucher
              </NavLink>
            </li>
          </ul>
        )

      case 'cms':
        return (
          <ul className="header-links">
            <li>
              <NavLink
                onClick={() => setShowMenu()}
                onKeyDown={() => setShowMenu()}
                to={url.banner}
              >
                Banner Ad
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => setShowMenu()}
                onKeyDown={() => setShowMenu()}
                to={url.userAlert}
              >
                User Alerts
              </NavLink>
            </li>
          </ul>
        )

      case 'report':
        return (
          <ul className="header-links">
            <li>
              <NavLink
                onClick={() => setShowMenu()}
                onKeyDown={() => setShowMenu()}
                to={url.transactionReport}
              >
                Transaction Report
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => setShowMenu()}
                onKeyDown={() => setShowMenu()}
                to={url.voucherRedemptionReport}
              >
                Voucher Redemption Report
              </NavLink>
            </li>
          </ul>
        )

      case 'settings':
        return adminSettingMenu()

      default:
        return ''
    }
  } else if (localStorage.getItem('role') === 'consumer') {
    return (
      <ul className="header-links">
        <li>
          <NavLink
            onClick={() => setShowMenu()}
            onKeyDown={() => setShowMenu()}
            to={url.dashboard}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={() => setShowMenu()}
            onKeyDown={() => setShowMenu()}
            to={url.rewards}
          >
            Rewards
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={() => setShowMenu()}
            onKeyDown={() => setShowMenu()}
            to={url.wallet}
          >
            Wallet
          </NavLink>
        </li>
      </ul>
    )
  }
  return false
}

export default MobileSwitchNav
