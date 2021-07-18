import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Hamburger from '../../../svgs/Hamburger'
import * as url from '../../../utils/urls'

const SwitchNav = ({ pathname }) => {
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
              <NavLink exact to={url.adminSettings}>
                3rd Party Configurations
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/admin">
                Payout Variables
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/admin">
                Language Translation Table
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink to={url.staff}>Admin Staff</NavLink>
        </li>
        {localStorage.getItem('role') === 'systemAdmin' && (
          <li>
            <NavLink to={url.trigger}>Triggers</NavLink>
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
              <NavLink exact to={url.consumer}>
                Consumer
              </NavLink>
            </li>
            {localStorage.getItem('role') !== 'systemUser' && (
              <>
                <li>
                  <NavLink to={url.segment}>Segments</NavLink>
                </li>
                <li>
                  <NavLink to={url.consumerHistory}>Consumer History</NavLink>
                </li>
              </>
            )}
          </ul>
        )
      case 'merchant':
        return (
          <ul className="header-links">
            <li>
              <NavLink to={url.merchant}>Merchant</NavLink>
            </li>
          </ul>
        )
      case 'voucher':
        return (
          <ul className="header-links">
            <li>
              <NavLink to={url.voucher}>Voucher</NavLink>
            </li>
          </ul>
        )

      case 'cms':
        return (
          <ul className="header-links">
            <li>
              <NavLink to={url.banner}>Banner Ad</NavLink>
            </li>
            <li>
              <NavLink to={url.userAlert}>User Alerts</NavLink>
            </li>
          </ul>
        )
      case 'report':
        return (
          <ul className="header-links">
            <li>
              <NavLink to={url.transactionReport}>
                Transaction
                <br />
                Report
              </NavLink>
            </li>
            <li>
              <NavLink to={url.voucherRedemptionReport}>
                Voucher Redemption <br />
                Report
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
          <NavLink to={url.dashboard}>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to={url.rewards}>Rewards</NavLink>
        </li>
        <li>
          <NavLink to={url.wallet}>Wallet</NavLink>
        </li>
      </ul>
    )
  }
  return false
}

export default SwitchNav
