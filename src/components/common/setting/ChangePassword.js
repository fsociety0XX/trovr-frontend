import _ from 'lodash'
import React, { useState } from 'react'
import { Button, Form, Input, Grid } from 'semantic-ui-react'
import propTypes from 'prop-types'
import { useToasts } from 'react-toast-notifications'
import StrikedEye from '../../../svgs/StrikedEye'
import Eye from '../../../svgs/Eye'
import Lock from '../../../svgs/Lock'
import { renderFieldError } from '../../../utils/helper'
import { passwordRegex } from '../../../utils/constants'
import {
  invalidPassword,
  confirmPasswordError,
  setPasswordSuccess,
  changePasswordSuccess,
} from '../../../utils/messages'
import UserService from '../../../api/services/UserService'
import Loader from '../../../utils/Loader'
import * as placeholder from '../../../utils/placeholders'

const ChangePassword = (props) => {
  const { addToast } = useToasts()
  const { userData } = props
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const showPassword = (type = null) => {
    if (type === 'newPassword') {
      setShowNewPassword(!showNewPassword)
    } else if (type === 'currentPassword') {
      setShowCurrentPassword(!showCurrentPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  const areRequiredFilled = () => {
    let requiredFields = []
    requiredFields = userData?.isPasswordSet
      ? ['currentPassword', 'confirmPassword', 'newPassword']
      : ['confirmPassword', 'newPassword']

    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    if (name === 'newPassword') {
      const strongRegex = new RegExp(passwordRegex)

      if (!strongRegex.test(value)) {
        error.newPassword = [invalidPassword]
      }
    }
    if (name === 'confirmPassword') {
      if (value !== newPassword) {
        error.confirmPassword = [confirmPasswordError]
      }
    }
    setErrors(error)
  }

  const handlePasswordOnChange = (e, { name, value }) => {
    if (name === 'currentPassword') setCurrentPassword(value)
    if (name === 'newPassword') setNewPassword(value)
    if (name === 'confirmPassword') setConfirmPassword(value)
    validateField(name, value)
  }

  const changeUserPassword = async (data) => {
    setIsLoading(true)
    try {
      const response = await UserService.changeUserPassword(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(changePasswordSuccess, { appearance: 'success' })
        setConfirmPassword('')
        setCurrentPassword('')
        setNewPassword('')
      }
      setIsLoading(false)
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      console.warn('Settings Change Password:', error)
      setIsLoading(false)
    }
  }

  const setUserPassword = async (data) => {
    setIsLoading(true)
    try {
      const response = await UserService.setUserPassword(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(setPasswordSuccess, { appearance: 'success' })
      }
      setIsLoading(false)
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      console.warn('Settings Set Password:', error)
      setIsLoading(false)
    }
  }

  const handleChangePasswordData = () => {
    let obj = {}
    if (userData.isPasswordSet) {
      obj = {
        oldPassword: currentPassword,
        newPassword,
      }
      changeUserPassword(obj)
    } else {
      obj = { password: newPassword }
      setUserPassword(obj)
    }
  }

  const isFormValid = () => !Object.keys(errors).length

  const renderChangePasswordForm = () => (
    <Form
      error={!isFormValid()}
      onSubmit={handleChangePasswordData}
      className="change-password-tab"
    >
      <Grid columns={1}>
        <Grid.Column>
          {userData?.isPasswordSet && (
            <>
              <Form.Field>
                <Input
                  name="currentPassword"
                  value={currentPassword}
                  onChange={handlePasswordOnChange}
                  iconPosition="left"
                  placeholder={placeholder.password.current}
                  type={showCurrentPassword ? 'text' : 'password'}
                >
                  <Lock />
                  <input />
                  <div
                    className="right-icon"
                    onClick={() => showPassword('currentPassword')}
                    onKeyDown={() => showPassword('currentPassword')}
                  >
                    {showCurrentPassword ? <StrikedEye /> : <Eye />}
                  </div>
                </Input>
              </Form.Field>
            </>
          )}
        </Grid.Column>
        <Grid.Column>
          <Form.Field>
            <Input
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordOnChange}
              iconPosition="left"
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
              value={confirmPassword}
              onChange={handlePasswordOnChange}
              iconPosition="left"
              placeholder={placeholder.password.confirm}
              type={showConfirmPassword ? 'text' : 'password'}
            >
              <Lock />
              <input />
              <div
                className="right-icon"
                onClick={() => showPassword('confirmPassword')}
                onKeyDown={() => showPassword('confirmPassword')}
              >
                {showConfirmPassword ? <StrikedEye /> : <Eye />}
              </div>
            </Input>
            {renderFieldError([...(errors.confirmPassword || [])])}
          </Form.Field>
        </Grid.Column>
      </Grid>
      <Grid columns="1" className="form-button-wrapper">
        <Grid.Column>
          <Button
            primary
            loading={isLoading}
            disabled={!isFormValid() || !areRequiredFilled()}
            type="submit"
          >
            Save
          </Button>
        </Grid.Column>
      </Grid>
    </Form>
  )

  return (
    <>
      {isLoading && <Loader className="screen-centered" />}
      {renderChangePasswordForm()}
    </>
  )
}

export default ChangePassword

ChangePassword.propTypes = {
  userData: propTypes.objectOf(propTypes.object).isRequired,
}
