import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Popup } from 'semantic-ui-react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import Notification from '../../../svgs/Notification'
import Setting from '../../../svgs/Setting'
import * as url from '../../../utils/urls'
import * as userAction from '../../../redux/actions/userAction'

const HeaderIcons = (props) => {
  const { pathname, notificationCount, fetchNotificationCount } = props
  const [showSubmenu, setShowSubmenu] = useState(false)

  const handleSubmenuOpen = (status) => {
    setShowSubmenu(status)
  }

  useEffect(() => {
    fetchNotificationCount()
  }, [])

  const roles = ['systemAdmin', 'systemManager', 'systemUser']
  return roles.includes(localStorage.getItem('role')) ? (
    <>
      <div className="notification-icon-wrapper">
        <NavLink className="notification-icon" to={url.adminNotifications}>
          <Notification />
          {notificationCount?.unreadNotificationCount > 0 && (
            <span className="blue-dot">
              {' '}
              {notificationCount?.unreadNotificationCount}{' '}
            </span>
          )}
        </NavLink>
      </div>
      <div
        className={`setting-icon-wrapper ${
          pathname !== undefined &&
          (pathname.children === 'personal-settings' ||
            pathname.children === 'settings')
            ? 'active'
            : ''
        }`}
      >
        <Popup
          open={showSubmenu}
          onOpen={() => handleSubmenuOpen(true)}
          onClose={() => handleSubmenuOpen(false)}
          className="admin-setting-submenu-popup"
          on="click"
          pinned
          position="bottom right"
          trigger={
            <div>
              <Setting />
            </div>
          }
        >
          <div className="admin-setting-submenu">
            <ul>
              <li>
                <NavLink
                  to={url.adminPersonalSettings}
                  onClick={() => handleSubmenuOpen(false)}
                >
                  Profile settings
                </NavLink>
              </li>
              {localStorage.getItem('role') !== 'systemUser' ? (
                <li>
                  <NavLink
                    to={
                      localStorage.getItem('role') === 'systemManager'
                        ? url.systemManagerSettings
                        : url.adminSettings
                    }
                    onClick={() => handleSubmenuOpen(false)}
                  >
                    Admin settings
                  </NavLink>
                </li>
              ) : (
                ''
              )}
            </ul>
          </div>
        </Popup>
      </div>
    </>
  ) : (
    <>
      <div className="notification-icon-wrapper">
        <NavLink className="notification-icon" to={url.notifications}>
          <Notification />
          {notificationCount?.unreadNotificationCount > 0 && (
            <span className="blue-dot">
              {' '}
              {notificationCount?.unreadNotificationCount}{' '}
            </span>
          )}
        </NavLink>
      </div>
      <div className="setting-icon-wrapper">
        <NavLink exact to={url.settings}>
          <Setting />
        </NavLink>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  users: state.users,
  userLoginInfo: state.userLoginInfo,
  notificationCount: state.user.notificationCount,
})

export default connect(mapStateToProps, { ...userAction })(HeaderIcons)

HeaderIcons.propTypes = {
  pathname: propTypes.objectOf(propTypes.object).isRequired,
  fetchNotificationCount: propTypes.func.isRequired,
  notificationCount: propTypes.number.isRequired,
}
