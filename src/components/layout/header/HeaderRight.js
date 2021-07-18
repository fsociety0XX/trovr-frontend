import React, { useEffect } from 'react'
import { Popup } from 'semantic-ui-react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import defaultAvatar from '../../../assets/images/profile-icon.png'
import HeaderIcons from './HeaderIcons'
import HeaderProfile from './HeaderProfile'
import * as loginAction from '../../../redux/actions/loginAction'
import * as userAction from '../../../redux/actions/userAction'

const HeaderRight = (props) => {
  const { pathname, userHeaderData } = props

  useEffect(() => {
    const { fetchUserDetailsActionCreator } = props
    fetchUserDetailsActionCreator()
  }, [])

  return (
    <div className="header-right-section">
      <HeaderIcons pathname={pathname} />
      <div className="profile-icon-wrapper">
        <Popup
          className="profile-popup"
          on="click"
          pinned
          position="bottom right"
          trigger={
            <div className="profile-image">
              <img
                src={
                  userHeaderData?.avatar
                    ? userHeaderData?.avatar
                    : defaultAvatar
                }
                alt="Profile"
              />
            </div>
          }
        >
          <HeaderProfile userData={userHeaderData} />
        </Popup>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  userHeaderData: state.user.userHeaderData,
})
export default connect(mapStateToProps, { ...loginAction, ...userAction })(
  HeaderRight
)

HeaderRight.propTypes = {
  fetchUserDetailsActionCreator: propTypes.func.isRequired,
  pathname: propTypes.objectOf(propTypes.object).isRequired,
  userHeaderData: propTypes.objectOf(propTypes.object).isRequired,
}
