import React, { useState } from 'react'
import _ from 'lodash'
import propTypes from 'prop-types'
import { Button, Checkbox, Form, Icon, Input } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import SimpleEmail from '../../svgs/SimpleEmail'
import Lock from '../../svgs/Lock'
import StrikedEye from '../../svgs/StrikedEye'
import Eye from '../../svgs/Eye'
import SocialLogin from './SocialLogin'
import { renderFieldError } from '../../utils/helper'
import * as url from '../../utils/urls'
import * as placeholder from '../../utils/placeholders'

const LoginForm = (props) => {
  const [email, setEmail] = useState(
    localStorage.getItem('username') ? localStorage.getItem('username') : ''
  )
  const [password, setPassword] = useState(
    localStorage.getItem('password') ? localStorage.getItem('password') : ''
  )
  const [errors, setErrors] = useState({})
  const [keepMe, setKeepMe] = useState(
    localStorage.getItem('checkbox') ? localStorage.getItem('checkbox') : false
  )
  const [pwdType, setPwdType] = useState('password')
  const { sendSocialLoginData, sendLoginData } = props

  const validateField = (name) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }
    setErrors(error)
  }

  const handleChange = (e, { name, value }) => {
    if (name === 'email') {
      setEmail(value)
    }
    if (name === 'password') {
      setPassword(value)
    }
    validateField(name, value)
  }
  const isFormValid = () => !Object.keys(errors).length
  const changeType = () => {
    if (pwdType === 'password') {
      setPwdType('text')
    } else {
      setPwdType('password')
    }
  }
  const areRequiredFilled = () => {
    const requiredFields = ['email', 'password']

    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const handleSubmit = () => {
    const reqObj = {
      email: email.trim(),
      password,
    }
    localStorage.clear()
    if (keepMe) {
      localStorage.setItem('username', email)
      localStorage.setItem('password', password)
      localStorage.setItem('checkbox', keepMe)
    }
    sendLoginData(reqObj)
  }
  return (
    <div>
      <Form>
        <Form.Field>
          <Input
            iconPosition="left"
            name="email"
            placeholder={placeholder.email}
            onChange={handleChange}
            value={email}
          >
            <SimpleEmail />

            {keepMe ? <input autoComplete="username" /> : <input />}
          </Input>
        </Form.Field>
        {renderFieldError([...(errors.email || [])])}

        <Form.Field>
          <Input iconPosition="left">
            <Lock />
            <Input
              iconPosition="left"
              placeholder={placeholder.password.enter}
              type={pwdType}
              name="password"
              value={password}
              onChange={handleChange}
            >
              <div
                className="right-icon"
                onClick={changeType}
                onKeyDown={changeType}
              >
                {pwdType === 'password' ? <Eye /> : <StrikedEye />}
              </div>

              {keepMe ? (
                <input autoComplete="password" />
              ) : (
                <input autoComplete="one-time-code" />
              )}
            </Input>
          </Input>
        </Form.Field>
        {renderFieldError([...(errors.password || [])])}

        <Form.Field>
          <Checkbox
            label="Keep me logged in"
            checked={keepMe}
            value="keepMe"
            onChange={(e, { checked }) => setKeepMe(checked)}
          />
          <Link
            to={url.forgotPassword}
            className="forgot-password-link"
            title="Forgot Password?"
          >
            Forgot Password?
          </Link>
        </Form.Field>
        <Button
          fluid
          primary
          className="login-button"
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormValid() || !areRequiredFilled()}
        >
          Log In <Icon name="arrow right" />
        </Button>
      </Form>
      <SocialLogin sendSocialLoginData={sendSocialLoginData} />
      <div className="show-xs mobile-extra-link">
        <p className="white-text">If you don’t have an account…</p>
        <Link to="/register" className="ui primary basic fluid button">
          Register Now
        </Link>
      </div>
    </div>
  )
}

export default LoginForm

LoginForm.propTypes = {
  sendSocialLoginData: propTypes.func.isRequired,
  sendLoginData: propTypes.func.isRequired,
}
