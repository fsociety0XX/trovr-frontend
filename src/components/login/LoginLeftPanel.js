import React from 'react'
import { Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import propTypes from 'prop-types'
import Logo from '../../svgs/Logo'
import QRCode from '../../svgs/QRCode'
import ArrowRight from '../../svgs/ArrowRight'
import Trophy from '../../svgs/Trophy'
import Coupon from '../../svgs/Coupon'
import * as url from '../../utils/urls'
import { getParameterByName } from '../../utils/helper'

const { register, forgotPassword } = url

const LoginLeftPanel = ({ pathname }) => {
  const switchText = () => {
    switch (pathname) {
      case register:
        return (
          <>
            <Header as="h1">
              Register to <strong>Recycle</strong> &amp;{' '}
              <strong>Earn Rewards</strong>
            </Header>
            <div className="xs-hide">
              <p className="primary-text">Already have an account…</p>
              <Link to="/" className="ui primary basic fluid button">
                Login Now
              </Link>
            </div>
          </>
        )
      case forgotPassword: {
        const emailId = getParameterByName('email')
        const token = getParameterByName('token')
        const fromLogin = getParameterByName('fromLogin')
        let forgotText = ''
        if ((emailId && token) || fromLogin === 'true') {
          forgotText = 'Reset'
        } else {
          forgotText = 'Forgot'
        }
        return (
          <>
            <Header as="h1">
              {forgotText} <strong>Password</strong> &amp;
              <br />
              <strong>Login</strong>
            </Header>
            <div className="xs-hide">
              <p className="primary-text">
                If you already remember the password…
              </p>
              <Link to="/" className="ui primary basic fluid button">
                Login Now
              </Link>
            </div>
          </>
        )
      }
      default:
        return (
          <>
            <Header as="h1">
              Sign in to <strong>Recycle</strong> <br />
              &amp; <strong>Earn Rewards</strong>
            </Header>
            <div className="xs-hide">
              <p className="primary-text">If you don’t have an account…</p>
              <Link to="/register" className="ui primary basic fluid button">
                Register Now
              </Link>
            </div>
          </>
        )
    }
  }
  return (
    <div>
      <div className="login-inner-column">
        <div className="login-logo-wrapper">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        {switchText()}
      </div>
      {pathname !== forgotPassword ? (
        <div className="login-process-block-wrapper">
          <div className="login-process-block">
            <div className="title">Scan</div>
            <div className="circle-icon">
              <QRCode />
            </div>
          </div>

          <div className="login-process-arrow">
            <ArrowRight />
          </div>

          <div className="login-process-block">
            <div className="title">Earn Rewards</div>
            <div className="circle-icon">
              <Trophy />
            </div>
          </div>

          <div className="login-process-arrow">
            <ArrowRight />
          </div>

          <div className="login-process-block">
            <div className="title">Get Discounts</div>
            <div className="circle-icon">
              <Coupon />
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

LoginLeftPanel.propTypes = {
  pathname: propTypes.string.isRequired,
}

export default LoginLeftPanel
