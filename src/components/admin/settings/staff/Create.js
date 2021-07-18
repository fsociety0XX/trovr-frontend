/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react'
import { Header, Button, Form, Input, Select, Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import _ from 'lodash'
import propTypes from 'prop-types'
import { renderFieldError } from '../../../../utils/helper'
import PagiRightArrow from '../../../../svgs/PagiRightArrow'
import User from '../../../../svgs/User'
import SimpleEmail from '../../../../svgs/SimpleEmail'
import StrikedEye from '../../../../svgs/StrikedEye'
import Eye from '../../../../svgs/Eye'
import Lock from '../../../../svgs/Lock'
import * as placeholder from '../../../../utils/placeholders'
import * as url from '../../../../utils/urls'
import Loader from '../../../../utils/Loader'

import {
  emailRegex,
  passwordRegex,
  nameRegex,
} from '../../../../utils/constants'
import {
  invalidEmail,
  invalidFirstName,
  invalidLastName,
  invalidPassword,
  emptyFirstName,
  emptyPassword,
  emptyLastName,
  emptyEmail,
  emptyUserLevel,
} from '../../../../utils/messages'

const CreateStaff = (props) => {
  const {
    createStaffOnSubmit,
    updateStaffOnSubmit,
    isLoading,
    staffDetailbyId,
    emptyStaffDetails,
  } = props
  const [showPassword, setshowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [editForm, setEditForm] = useState(false)
  const [staffId, setStaffId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [userLevel, setUserLevel] = useState(
    localStorage.getItem('role') === 'systemManager' ? 'systemUser' : ''
  )
  const [password, setPassword] = useState('')
  const [disableEye, setDisableEye] = useState(false)
  useEffect(() => {
    if (Object.keys(staffDetailbyId).length) {
      const { id, email, firstName, lastName, role } = staffDetailbyId
      setEditForm(true)
      setPassword('*****')
      setshowPassword(true)
      setDisableEye(true)
      setStaffId(id)
      setFirstName(firstName)
      setLastName(lastName)
      setEmail(email)
      setUserLevel(role[0].name)
    }
  }, [staffDetailbyId])

  const userLevelOptions = [
    { key: 'System User', value: 'systemUser', text: 'System User' },
    { key: 'System Manager', value: 'systemManager', text: 'System Manager' },
  ]
  const isFormValid = () => !Object.keys(errors).length

  const areRequiredFilled = () => {
    const requiredFields = ['firstName', 'lastName', 'email']
    if (!editForm) {
      requiredFields.push('password')
    }
    if (localStorage.getItem('role') === 'systemAdmin') {
      requiredFields.push('userLevel')
    }
    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const togglePassword = (type = null) => {
    if (type === 'newPassword') {
      setshowPassword(!showPassword)
    }
  }

  const handleFormData = () => {
    let obj = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      userLevel,
    }
    if (editForm) {
      obj = _.omit(obj, 'email')

      if (obj.password === '' || obj.password === '*****') {
        obj = _.omit(obj, 'password')
      }
      obj.roleId = staffDetailbyId.role[0].id

      updateStaffOnSubmit(obj, staffId)
    } else {
      createStaffOnSubmit(obj)
    }
  }
  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    if (name === 'firstName') {
      if (value === '') {
        error.firstName = [emptyFirstName]
      } else if (!nameRegex.test(value)) {
        error.firstName = [invalidFirstName]
      }
    }
    if (name === 'lastName') {
      if (value === '') {
        error.lastName = [emptyLastName]
      } else if (!nameRegex.test(value)) {
        error.lastName = [invalidLastName]
      }
    }
    if (name === 'email') {
      if (value === '') {
        error.email = [emptyEmail]
      } else if (!emailRegex.test(value)) {
        error.email = [invalidEmail]
      }
    }
    if (name === 'userLevel') {
      if (value === '') {
        error.address = [emptyUserLevel]
      }
    }

    if (name === 'password') {
      if (value === '' && !editForm) {
        error.password = [emptyPassword]
      } else if (value !== '' && !passwordRegex.test(value)) {
        error.password = [invalidPassword]
      }
    }

    setErrors(error)
  }
  const handleChange = (e, { name, value }) => {
    if (name === 'firstName') {
      setFirstName(value)
    }
    if (name === 'lastName') {
      setLastName(value)
    }

    if (name === 'email') {
      setEmail(value)
    }
    if (name === 'userLevel') {
      setUserLevel(value)
    }
    if (name === 'password') {
      setPassword(value)
    }

    validateField(name, value)
  }
  const handleEyeIcon = () => {
    if (editForm) {
      setDisableEye(false)
      setPassword('')
      setshowPassword(false)
    }
  }
  return (
    <div className="create-staff-page">
      {isLoading && <Loader className="screen-centered" />}

      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1" className="breadcrumb-wrapper">
            <span>
              <Link to={url.staff} onClick={() => emptyStaffDetails()}>
                Admin Staff
              </Link>
            </span>{' '}
            <PagiRightArrow /> {`${editForm ? 'Update' : 'Create'}`} Staff
          </Header>
          <div className="date">
            <span> {`${dayjs().format('dddd')}`}, </span>{' '}
            {`${dayjs().format('D MMMM YYYY')}`}
          </div>
        </div>
      </div>

      <Form error={!isFormValid()} onSubmit={handleFormData}>
        <Grid columns="2">
          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.firstName}
                name="firstName"
                value={firstName}
                onChange={handleChange}
                maxLength="64"
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
                maxLength="64"
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
                disabled={editForm}
              >
                <SimpleEmail />
                <input />
              </Input>
              {renderFieldError([...(errors.email || [])])}
            </Form.Field>
          </Grid.Column>

          {localStorage.getItem('role') === 'systemAdmin' && (
            <Grid.Column>
              <Form.Field>
                <div className="ui left icon select">
                  <User />
                  <Select
                    placeholder={placeholder.userLevel}
                    options={userLevelOptions}
                    value={userLevel}
                    onChange={handleChange}
                    name="userLevel"
                  />
                </div>
                {renderFieldError([...(errors.userLevel || [])])}
              </Form.Field>
            </Grid.Column>
          )}

          <Grid.Column>
            <Form.Field>
              <Input
                name="password"
                iconPosition="left"
                placeholder={placeholder.password.enter}
                onChange={handleChange}
                onClick={handleEyeIcon}
                value={password}
                type={showPassword ? 'text' : 'password'}
              >
                <Lock />
                <input />
                <div
                  className={`right-icon ${disableEye ? 'disabled' : ''}`}
                  onClick={() => togglePassword('newPassword')}
                  onKeyDown={() => togglePassword('newPassword')}
                >
                  {showPassword ? <StrikedEye /> : <Eye />}
                </div>
              </Input>
              {renderFieldError([...(errors.password || [])])}
            </Form.Field>
          </Grid.Column>
        </Grid>
        <Grid columns="2" className="form-button-wrapper">
          <Grid.Column>
            <Grid columns="2">
              <Grid.Column>
                <Button
                  primary
                  fluid
                  type="submit"
                  disabled={!isFormValid() || !areRequiredFilled()}
                >
                  {editForm ? 'Update' : 'Create'}
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Link
                  to="/admin/settings/staff"
                  className="ui fluid secondary button"
                  onClick={() => emptyStaffDetails()}
                >
                  Cancel
                </Link>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </Form>
    </div>
  )
}

CreateStaff.propTypes = {
  createStaffOnSubmit: propTypes.func.isRequired,
  isLoading: propTypes.bool.isRequired,
  updateStaffOnSubmit: propTypes.func.isRequired,
  staffDetailbyId: propTypes.arrayOf(propTypes.array).isRequired,
  emptyStaffDetails: propTypes.func.isRequired,
}
export default CreateStaff
