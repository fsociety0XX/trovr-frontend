import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { handleLogOut } from '../../../utils/helper'
import * as loginAction from '../../../redux/actions/loginAction'

const HeaderProfile = (props) => {
  const history = useHistory()
  const { userLoginSuccess, userData } = props
  return (
    <div className="profile-popup-inner">
      <div className="user-name">
        <span>{userData?.firstName}</span>
        {userData?.lastName ? <span>{userData?.lastName}</span> : ''}
      </div>
      <div className="user-email"> {userData?.email} </div>
      <div className="logout-link-wrapper">
        <div
          className="logout-link"
          onClick={() => handleLogOut(userLoginSuccess, history)}
          onKeyDown={() => handleLogOut(userLoginSuccess, history)}
        >
          Logout
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  userLoginInfo: state.userLoginInfo,
})
export default connect(mapStateToProps, { ...loginAction })(HeaderProfile)

HeaderProfile.propTypes = {
  userLoginSuccess: propTypes.func.isRequired,
  userData: propTypes.objectOf(propTypes.object).isRequired,
}
