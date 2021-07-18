import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  Form,
  Icon,
  Input,
  Select,
  Header,
  Grid,
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import propTypes from 'prop-types'
import User from '../../svgs/User'
import SimpleEmail from '../../svgs/SimpleEmail'
import Lock from '../../svgs/Lock'
import StrikedEye from '../../svgs/StrikedEye'
import Eye from '../../svgs/Eye'
import Flag from '../../svgs/Flag'
import Folder from '../../svgs/Folder'
import BackArrow from '../../svgs/BackArrow'
import SocialLogin from './SocialLogin'
import { renderFieldError } from '../../utils/helper'
import { emailRegex, passwordRegex, nameRegex } from '../../utils/constants'
import {
  invalidEmail,
  invalidPassword,
  invalidFirstName,
  invalidLastName,
  confirmPasswordError,
} from '../../utils/messages'
import * as placeholder from '../../utils/placeholders'

const RegisterForm = (props) => {
  const { countryList } = props
  const countryOptions = countryList.map((country) => ({
    text: country.name,
    value: country.name,
    key: country.code,
  }))
  const { sendSocialLoginData, sendRegisterData } = props
  const [regStep2, setregStep2] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [country, setCountry] = useState('')
  const [errors, setErrors] = useState({})
  const [ageConfirmation, setAgeConfirmation] = useState(false)
  const [showMarketingMaterial, setShowMarketingMaterial] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPwdType, setConfirmPwdType] = useState(false)
  const [pwdType, setPwdType] = useState(false)
  const showNextStep = () => {
    window.scrollTo(0, 0)
    setregStep2(true)
  }
  const showPrevStep = () => {
    window.scrollTo(0, 0)
    setregStep2(false)
  }

  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    // password
    if (name === 'password') {
      if (!passwordRegex.test(value)) {
        error.password = [invalidPassword]
      }
    }
    // confirm password
    if (name === 'confirmPassword') {
      if (value !== password) {
        error.confirmPassword = [confirmPasswordError]
      }
    }

    // email
    if (name === 'email') {
      if (!emailRegex.test(value)) {
        error.email = [invalidEmail]
      }
    }
    // first name
    if (name === 'firstName') {
      if (!nameRegex.test(value)) {
        error.firstName = [invalidFirstName]
      }
    }
    // last name
    if (name === 'lastName') {
      if (!nameRegex.test(value)) {
        error.lastName = [invalidLastName]
      }
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
    if (name === 'firstName') {
      setFirstName(value)
    }
    if (name === 'lastName') {
      setLastName(value)
    }
    if (name === 'country') {
      setCountry(value)
    }
    if (name === 'confirmPassword') {
      setConfirmPassword(value)
    }

    validateField(name, value)
  }
  const isFormValid = () => !Object.keys(errors).length
  const changeType = (type) => {
    if (type === 'password') {
      setPwdType(!pwdType)
    } else {
      setConfirmPwdType(!confirmPwdType)
    }
  }
  const areRequiredFilled = () => {
    const requiredFields = [
      'email',
      'password',
      'firstName',
      'lastName',
      'country',
    ]

    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const areSubmitRequiredFilled = () => {
    const requiredFields = ['ageConfirmation']

    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const handleSubmit = () => {
    const reqObj = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      country,
      showMarketingMaterial,
    }
    sendRegisterData(reqObj)
  }
  return (
    <>
      {regStep2 === false ? (
        <Form>
          <Grid columns={1}>
            <Grid.Column>
              <Form.Field>
                <Input
                  iconPosition="left"
                  placeholder={placeholder.firstName}
                  name="firstName"
                  value={firstName}
                  onChange={handleChange}
                >
                  <User />
                  <input />
                </Input>
                {renderFieldError([...(errors.firstName || [])])}
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <Input
                  iconPosition="left"
                  placeholder={placeholder.lastName}
                  name="lastName"
                  value={lastName}
                  onChange={handleChange}
                >
                  <User />
                  <input />
                </Input>
                {renderFieldError([...(errors.lastName || [])])}
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <Input
                  iconPosition="left"
                  placeholder={placeholder.email}
                  name="email"
                  value={email}
                  onChange={handleChange}
                >
                  <SimpleEmail />
                  <input />
                </Input>
                {renderFieldError([...(errors.email || [])])}
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <Input iconPosition="left">
                  <Lock />
                  <Input
                    name="password"
                    placeholder={placeholder.password.enter}
                    value={password}
                    type={pwdType ? 'text' : 'password'}
                    onChange={handleChange}
                  />
                  <div
                    className="right-icon"
                    onClick={() => changeType('password')}
                    onKeyDown={() => changeType('password')}
                  >
                    {pwdType ? <StrikedEye /> : <Eye />}
                  </div>
                </Input>
                {renderFieldError([...(errors.password || [])])}
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <Input
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  iconPosition="left"
                  placeholder={placeholder.password.confirm}
                  type={confirmPwdType ? 'text' : 'password'}
                >
                  <Lock />
                  <input />
                  <div
                    className="right-icon"
                    onClick={() => changeType('confirmPassword')}
                    onKeyDown={() => changeType('confirmPassword')}
                  >
                    {confirmPwdType ? <StrikedEye /> : <Eye />}
                  </div>
                </Input>
                {renderFieldError([...(errors.confirmPassword || [])])}
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <div className="ui left icon select">
                  <Flag />
                  <Select
                    placeholder="Select Country"
                    options={countryOptions}
                    name="country"
                    value={country}
                    onChange={handleChange}
                  />
                </div>
              </Form.Field>
            </Grid.Column>
          </Grid>
          <Button
            fluid
            primary
            className="login-button"
            onClick={showNextStep}
            type="button"
            disabled={!isFormValid() || !areRequiredFilled()}
          >
            Next <Icon name="arrow right" />
          </Button>
        </Form>
      ) : (
        <div className="register-step-2">
          <Button basic className="go-back-link" onClick={showPrevStep}>
            <BackArrow />
            Go back
          </Button>
          <Header as="h2">Age &amp; Marketing Opt Confirmation</Header>
          <div className="register-step-2-checkbx-wrapper">
            <Checkbox
              label="By clicking on this, you are confirming that your legal age is 18 years or above."
              name="AgeConfirmation"
              checked={ageConfirmation}
              onChange={(e, { checked }) => setAgeConfirmation(checked)}
            />
            <Checkbox
              label="You agree to receive marketing material from us."
              name="showMarketingMaterial"
              checked={showMarketingMaterial}
              onChange={(e, { checked }) => setShowMarketingMaterial(checked)}
            />
          </div>

          <div className="t-c-text">
            By clicking on the Register button you are confirming that you agree
            to our
          </div>
          <Link
            target="_blank"
            to="/terms-conditions"
            className="ui fluid button secondary t-c-button"
          >
            <Folder />
            Terms &amp; Conditions
          </Link>
          <Button
            fluid
            primary
            className="register-button"
            type="submit"
            onClick={handleSubmit}
            disabled={!areSubmitRequiredFilled()}
          >
            Register <Icon name="arrow right" />
          </Button>
        </div>
      )}
      {regStep2 === false ? (
        <SocialLogin sendSocialLoginData={sendSocialLoginData} />
      ) : (
        ''
      )}
      <div className="show-xs mobile-extra-link">
        <p className="white-text">Already have an account…</p>
        <Link to="/" className="ui primary white basic fluid button">
          Login Now
        </Link>
      </div>
    </>
  )
}

export default RegisterForm

RegisterForm.propTypes = {
  countryList: propTypes.func.isRequired,
  sendSocialLoginData: propTypes.func.isRequired,
  sendRegisterData: propTypes.func.isRequired,
}
