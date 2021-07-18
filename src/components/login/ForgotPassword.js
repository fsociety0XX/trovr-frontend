import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import propTypes from 'prop-types'
import { Button, Form, Icon, Input, Grid } from 'semantic-ui-react'
import Lock from '../../svgs/Lock'
import StrikedEye from '../../svgs/StrikedEye'
import Eye from '../../svgs/Eye'
import SimpleEmail from '../../svgs/SimpleEmail'
import { getParameterByName, renderFieldError } from '../../utils/helper'
import { emailRegex, passwordRegex } from '../../utils/constants'
import {
  invalidEmail,
  invalidPassword,
  confirmPasswordError,
} from '../../utils/messages'
import * as placeholder from '../../utils/placeholders'

const ForgotPassword = (props) => {
  const {
    handleForgotPassword,
    isLoading,
    handleResetPassword,
    setUserPassword,
  } = props
  const [resetPassword, setResetPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [emailFromUrl, setEmailFromUrl] = useState(null)
  const [tokenFromUrl, setTokenFromUrl] = useState(null)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fromLogin, setFromLogin] = useState('')

  useEffect(() => {
    const emailId = getParameterByName('email')
    const token = getParameterByName('token')
    const fromLogin = getParameterByName('fromLogin')
    setEmailFromUrl(emailId)
    setTokenFromUrl(token)
    setFromLogin(fromLogin)
    if ((emailId && token) || fromLogin === 'true') {
      setResetPassword(true)
    }
  }, [])

  const handleForgotPasswordData = () => {
    const obj = { email: email.trim() }
    handleForgotPassword(obj)
  }

  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    if (resetPassword) {
      // new password
      if (name === 'newPassword') {
        const strongRegex = new RegExp(passwordRegex)

        if (!strongRegex.test(value)) {
          error.newPassword = [invalidPassword]
        }
      }
      // confirm password
      if (name === 'confirmPassword') {
        if (value !== newPassword) {
          error.confirmPassword = [confirmPasswordError]
        }
      }
    } else if (name === 'email') {
      // email
      if (!emailRegex.test(value)) {
        error.email = [invalidEmail]
      }
    }
    setErrors(error)
  }

  const handleForgotPasswordOnChange = (e, { name, value }) => {
    if (name === 'email') setEmail(value)
    validateField(name, value)
  }

  const areRequiredFilled = () => {
    let requiredFields = []
    requiredFields = resetPassword
      ? ['confirmPassword', 'newPassword']
      : ['email']
    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const isFormValid = () => !Object.keys(errors).length

  /**
   * @author Kushagra
   * @use this form will be used when user clicks on forgot password
   * @returns this form will render only email field andsubmit button
   */
  const renderForgotPasswordForm = () => (
    <Form error={!isFormValid()} onSubmit={handleForgotPasswordData}>
      <Grid columns={1}>
        <Grid.Column>
          <Form.Field>
            <Input
              name="email"
              value={email}
              onChange={handleForgotPasswordOnChange}
              iconPosition="left"
              error={!!errors.email}
              placeholder={placeholder.email}
            >
              <SimpleEmail />
              <input />
            </Input>
            {renderFieldError([...(errors.email || [])])}
          </Form.Field>
        </Grid.Column>
      </Grid>
      <Grid columns={1} className="form-button-wrapper">
        <Grid.Column>
          <Button
            fluid
            primary
            type="submit"
            loading={isLoading}
            disabled={!isFormValid() || !areRequiredFilled()}
          >
            Submit <Icon name="arrow right" />
          </Button>
        </Grid.Column>
      </Grid>
    </Form>
  )

  const handleResetPasswordData = () => {
    if (fromLogin === 'true') {
      const obj = { password: confirmPassword }
      setUserPassword(obj)
    } else {
      const obj = {
        email: emailFromUrl,
        token: tokenFromUrl,
        password: confirmPassword,
      }
      handleResetPassword(obj)
    }
  }

  const handleResetPasswordOnChange = (e, { name, value }) => {
    if (name === 'newPassword') setNewPassword(value)
    if (name === 'confirmPassword') setConfirmPassword(value)
    validateField(name, value)
  }

  /**
   * @author Kushagra Garg
   * @param {*} type
   * @use {this method will change the field type to text from password and vice-versa when user wants to see/hide password}
   */
  const showPassword = (type = null) => {
    if (type === 'newPassword') {
      setShowNewPassword(!showNewPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  /**
   * @author Kushagra
   * @use this form will be used when user is redirected from reset-password email
   * @returns this form will render fields required for reseting password
   */
  const renderResetPasswordForm = () => (
    <Form error={!isFormValid()} onSubmit={handleResetPasswordData}>
      <Grid columns={1}>
        <Grid.Column>
          <Form.Field>
            <Input
              name="newPassword"
              iconPosition="left"
              onChange={handleResetPasswordOnChange}
              error={!!errors.newPassword}
              value={newPassword}
              placeholder={placeholder.password.new}
              type={showNewPassword ? 'text' : 'password'}
            >
              <Lock />
              <input />
              <div
                className="right-icon"
                onClick={() => showPassword('newPassword')}
                onKeyDown={() => showPassword('newPassword')}
              >
                {showNewPassword ? <StrikedEye /> : <Eye />}
              </div>
            </Input>
            {renderFieldError([...(errors.newPassword || [])])}
          </Form.Field>
        </Grid.Column>
        <Grid.Column>
          <Form.Field>
            <Input
              name="confirmPassword"
              iconPosition="left"
              onChange={handleResetPasswordOnChange}
              error={!!errors.confirmPassword}
              value={confirmPassword}
              placeholder={placeholder.password.confirm}
              type={showConfirmPassword ? 'text' : 'password'}
            >
              <Lock />
              <input />
              <div
                className="right-icon"
                onClick={showPassword}
                onKeyDown={showPassword}
              >
                {showConfirmPassword ? <Eye /> : <StrikedEye />}
              </div>
            </Input>
            {renderFieldError([...(errors.confirmPassword || [])])}
          </Form.Field>
        </Grid.Column>
      </Grid>
      <Grid columns={1} className="form-button-wrapper">
        <Grid.Column>
          <Button
            fluid
            primary
            className="login-button"
            loading={isLoading}
            disabled={!isFormValid() || !areRequiredFilled()}
            type="submit"
          >
            Submit <Icon name="arrow right" />
          </Button>
        </Grid.Column>
      </Grid>
    </Form>
  )
  return (
    <>
      {resetPassword ? renderResetPasswordForm() : renderForgotPasswordForm()}
    </>
  )
}
export default ForgotPassword

ForgotPassword.propTypes = {
  handleForgotPassword: propTypes.func.isRequired,
  handleResetPassword: propTypes.func.isRequired,
  isLoading: propTypes.bool.isRequired,
  setUserPassword: propTypes.func.isRequired,
}
