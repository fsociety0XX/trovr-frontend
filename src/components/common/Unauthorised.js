import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import NoAccess from '../../svgs/NoAccess'
import { handleLogOut } from '../../utils/helper'

const Unauthorized = () => {
  const history = useHistory()
  return (
    <div className="no-aceess-page">
      <div className="error-page-inner">
        <div className="main-svg">
          <NoAccess />
        </div>
        <p>
          You don’t have access
          <br /> for this page.
        </p>
        <div className="btn-wrapper">
          <Link to="/" className="basic ui button fluid">
            Continue Earning Rewards
          </Link>
          <div
            className="basic ui button fluid"
            onClick={() => handleLogOut('', history)}
            onKeyDown={() => handleLogOut('', history)}
          >
            Logout
          </div>
        </div>
      </div>
    </div>
  )
}
export default Unauthorized
