import React, { Component } from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import { Grid } from 'semantic-ui-react'
import * as userAction from '../../redux/actions/userAction'
import * as loginAction from '../../redux/actions/loginAction'
import LoginLeftPanel from './LoginLeftPanel'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ForgotPassword from './ForgotPassword'
import UserService from '../../api/services/UserService'
import LoginService from '../../api/services/LoginService'
import Loader from '../../utils/Loader'
import * as url from '../../utils/urls'
import {
  getParameterByName,
  restrictUrlChange,
  withToast,
} from '../../utils/helper'
import {
  emailSentSuccessfully,
  RegistrationFailed,
  RegisterSuccessfully,
  UserVerify,
  VerificationFailed,
  resetPasswordSuccess,
  setPasswordSuccess,
} from '../../utils/messages'

class index extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
    }
  }

  /**
   * @author Kushagra Garg
   * @use {this method will handle the response coming from Apple server after user log in with the help of eventlisteners}
   * @description after handeling response it'll send the requested info in API
   * @external https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple
   */
  componentDidMount() {
    const { history } = this.props
    restrictUrlChange(history)
    const userId = getParameterByName('userId')
    const activationKey = getParameterByName('activationKey')
    const { countryList } = this.props
    countryList()
    if (userId && activationKey) {
      const reqObj = { activationKey, userId }
      this.verifyConsumer(reqObj)
    }
  }

  /**
   * @author Kushagra
   * @use this will pass the social login response to socialLogin service
   * @param {*} data
   */
  sendSocialLoginData = (data) => {
    const { userLogin, addToast, history } = this.props
    if (data) {
      userLogin(data, addToast, history, 'social')
    }
  }

  handleForgotPassword = async (data) => {
    const { addToast } = this.props
    this.setState({ isLoading: true })
    try {
      const response = await UserService.forgotPassword(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else addToast(emailSentSuccessfully, { appearance: 'success' })
      this.setState({ isLoading: false })
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  handleResetPassword = async (data) => {
    const { addToast, history } = this.props
    this.setState({ isLoading: true })
    try {
      const response = await UserService.resetPassword(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(resetPasswordSuccess, { appearance: 'success' })
        history.push('/')
      }
      this.setState({ isLoading: false })
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  setUserPassword = async (data) => {
    const { addToast, history } = this.props

    this.setState({ isLoading: true })
    try {
      const response = await UserService.setUserPassword(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(setPasswordSuccess, { appearance: 'success' })
        history.push('/')
      }
      this.setState({ isLoading: false })
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      console.warn('Settings Set Password:', error)
      this.setState({ isLoading: false })
    }
  }

  sendLoginData = (data) => {
    const { userLogin, addToast, history } = this.props
    if (data) {
      userLogin(data, addToast, history, 'normal')
    }
  }

  sendRegisterData = async (data) => {
    const { addToast, history } = this.props
    this.setState({ isLoading: true })
    try {
      const response = await LoginService.consumerRegistration(data)

      if (response[0]?.message) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(RegisterSuccessfully, { appearance: 'success' })

        history.push('/')
      }
      this.setState({ isLoading: false })
    } catch (e) {
      addToast(RegistrationFailed, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  verifyConsumer = async (data) => {
    const { addToast, history } = this.props
    this.setState({ isLoading: true })
    try {
      const response = await LoginService.verifyConsumer(data)

      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(UserVerify, { appearance: 'success' })

        history.push('/')
      }
      this.setState({ isLoading: false })
    } catch (e) {
      addToast(VerificationFailed, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  switchComponent = (pathname) => {
    const { isLoading } = this.state
    const { userLoginInfo } = this.props
    window.scrollTo(0, 0)
    switch (pathname) {
      case url.register:
        return (
          <RegisterForm
            sendSocialLoginData={this.sendSocialLoginData}
            countryList={userLoginInfo.countryList}
            sendRegisterData={this.sendRegisterData}
          />
        )
      case url.forgotPassword:
        return (
          <ForgotPassword
            handleForgotPassword={this.handleForgotPassword}
            isLoading={isLoading}
            handleResetPassword={this.handleResetPassword}
            setUserPassword={this.setUserPassword}
          />
        )
      case url.verification:
        return (
          <LoginForm
            sendSocialLoginData={this.sendSocialLoginData}
            sendLoginData={this.sendLoginData}
          />
        )
      default:
        return (
          <LoginForm
            sendSocialLoginData={this.sendSocialLoginData}
            sendLoginData={this.sendLoginData}
          />
        )
    }
  }

  render() {
    const { location, userLoginInfo } = this.props
    const { isLoading } = this.state
    return (
      <div className="dark-page">
        {(isLoading || userLoginInfo.userLoginInfo.loading) && (
          <div className="loader-wrapper">
            <Loader active className="screen-centered" />
          </div>
        )}
        <div className="container">
          <Grid columns={2} className="login-columns">
            {/* Left column */}
            <Grid.Column>
              {location.pathname ? (
                <LoginLeftPanel pathname={location.pathname} />
              ) : (
                ''
              )}
            </Grid.Column>
            {/* Left column ends */}
            {/* Right column */}
            <Grid.Column className="login-form-column">
              <div className="login-inner-column">
                {this.switchComponent(location.pathname)}
              </div>
            </Grid.Column>
            {/* Right column ends */}
          </Grid>
        </div>
      </div>
    )
  }
}

index.propTypes = {
  history: propTypes.func.isRequired,
  userLoginInfo: propTypes.objectOf(propTypes.object).isRequired,
  addToast: propTypes.func.isRequired,
  userLogin: propTypes.func.isRequired,
  countryList: propTypes.func.isRequired,
  users: propTypes.shape({
    userList: propTypes.objectOf(propTypes.func).isRequired, // shape it as reducer have multiple states which we need to address and this is for object
  }).isRequired,
  location: propTypes.shape({
    pathname: propTypes.string.isRequired, // shape it as reducer have multiple states which we need to address and this is for object
  }).isRequired,
}

const mapStateToProps = (state) => ({
  users: state.users,
  userLoginInfo: state.userLoginInfo,
})

export default withToast(
  connect(mapStateToProps, { ...userAction, ...loginAction })(index)
)
