import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Grid, Modal, Header } from 'semantic-ui-react'
import S3FileUpload from 'react-s3'
import propTypes from 'prop-types'
import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'
import AppleSignin from 'react-apple-signin-auth'
import SimpleEmail from '../../../svgs/SimpleEmail'
import User from '../../../svgs/User'
import AppleSvg from '../../../svgs/Apple'
import GoogleSvg from '../../../svgs/Google'
import GoogleSvgMob from '../../../svgs/GoogleMob'
import FacebookSvg from '../../../svgs/Facebook'
import Close from '../../../svgs/Close'
import LinkIcon from '../../../svgs/Link'
import {
  emailRegex,
  nameRegex,
  defaultImage,
  AWS_CONFIG,
} from '../../../utils/constants'
import {
  invalidEmail,
  invalidFirstName,
  invalidLastName,
  notValidImage,
  imageSizeLimit,
  profileUpdateError,
  profileUpdateSuccess,
} from '../../../utils/messages'
import {
  renderFieldError,
  withToast,
  handleThirdPartyResponse,
} from '../../../utils/helper'
import defaultAvatar from '../../../assets/images/profile-image.png'
import UserService from '../../../api/services/UserService'
import Loader from '../../../utils/Loader'
import * as placeholder from '../../../utils/placeholders'

window.Buffer = require('buffer').Buffer

const PersonalDetail = (props) => {
  const { isLoading, userData, fetchUserDetails, callUserAPI, res } = props
  const [firstName, setFirstName] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [socialName, setSocialName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [linkedSocialAccount, setLinkedSocialAccount] = useState([])
  useEffect(() => {
    fetchUserDetails()
  }, [])

  useEffect(() => {
    userData?.socialAccounts?.forEach((data) => {
      setLinkedSocialAccount((oldArray) => [...oldArray, data.type])
    })
    if (userData) {
      const { firstName, lastName, avatar, email } = userData

      if (avatar) {
        setImageUrl(avatar)
      } else {
        setImageUrl(defaultImage)
      }

      setFirstName(firstName)
      setLastName(lastName)
      setEmail(email)
    }
  }, [userData])
  const areRequiredFilled = () => {
    const requiredFields = ['email', 'firstName', 'lastName']

    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    if (name === 'email') {
      if (!emailRegex.test(value)) {
        error.email = [invalidEmail]
      }
    }

    if (name === 'firstName') {
      if (!nameRegex.test(value)) {
        error.firstName = [invalidFirstName]
      }
    }

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
    if (name === 'firstName') {
      setFirstName(value)
    }
    if (name === 'lastName') {
      setLastName(value)
    }
    validateField(name, value)
  }

  const isFormValid = () => !Object.keys(errors).length

  const handleFormData = async () => {
    const { addToast } = props
    setLoading(true)
    try {
      const obj = {
        email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatar: imageUrl,
      }
      const response = await UserService.updateUserProfile(obj)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        callUserAPI()
        addToast(profileUpdateSuccess, { appearance: 'success' })
      }
      setLoading(false)
    } catch (e) {
      console.warn('Personal Details(handleFormData):', e)
      setLoading(false)
      addToast(profileUpdateError, { appearance: 'error' })
    }
  }

  const handleImageSelection = async (e) => {
    const { addToast } = props
    if (!e.target.files[0].type.includes('image')) {
      addToast(notValidImage, { appearance: 'error' })
      return
    }
    const size = e.target.files[0].size / 1000 / 1000
    if (size > 10) {
      addToast(imageSizeLimit, { appearance: 'error' })
      return
    }
    setLoading(true)
    try {
      const data = await S3FileUpload.uploadFile(e.target.files[0], AWS_CONFIG)

      setImageUrl(data.location)
      setLoading(false)
    } catch (err) {
      console.warn('Personal Details(handleImageSelection):', err)
      setLoading(false)
    }
  }

  const RemoveFile = () => {
    const fileName = imageUrl.split('/').pop()
    S3FileUpload.deleteFile(fileName, AWS_CONFIG)
      .then((response) => {
        console.warn(response, 'remove from s3')
      })
      .catch((err) => console.warn(err))
    setImageUrl(defaultImage)
  }

  const handleSocialResponse = async (res, type) => {
    const { addToast } = props
    const response = await handleThirdPartyResponse(res, type)
    const { email, token, socialType } = response
    const obj = {
      token,
      socialType,
    }
    if (email) {
      Object.assign(obj, { email })
    }
    setLoading(true)
    try {
      const response = await UserService.linkSocialAccount(obj)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        linkedSocialAccount.push(socialType)
        fetchUserDetails()
      }
      setLoading(false)
    } catch (e) {
      console.warn('Personal Details(handleSocialResponse):', e)
      setLoading(false)
    }
  }

  const removeSocialAccount = async (type) => {
    const { addToast } = props
    const param = `/${type}`
    setLoading(true)
    try {
      const response = await UserService.removeSocialAccount(param)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        setShowDelete(false)
        setLinkedSocialAccount(
          linkedSocialAccount.filter((data) => data !== type)
        )
        fetchUserDetails()
      }
      setLoading(false)
    } catch (e) {
      console.warn('Personal Details(removeSocialAccount):', e)
      setLoading(false)
    }
  }
  const removeAccount = (socialMedia) => {
    setShowDelete(!showDelete)
    setSocialName(socialMedia)
  }
  const renderProfileForm = () => (
    <Form error={!isFormValid()} onSubmit={handleFormData}>
      <div className="profile-image-row">
        <div className="profile-image-wrapper">
          <img
            src={imageUrl}
            onError={(e) => (e.target.src = defaultAvatar)}
            alt="Profile"
          />
        </div>
        <div className="profile-btns">
          <input
            accept="image/png,image/jpeg"
            type="file"
            className="inputfile"
            id={
              res === 'mobile'
                ? 'embedpollfileinput'
                : 'embedpolldesktopfileinput'
            }
            onChange={handleImageSelection}
          />
          <label
            htmlFor={
              res === 'mobile'
                ? 'embedpollfileinput'
                : 'embedpolldesktopfileinput'
            }
            className="ui secondary button"
          >
            Upload
          </label>
          <Button
            type="button"
            secondary
            disabled={
              imageUrl ===
              'https://trovr-local.s3.amazonaws.com/uploads/profile-image.png'
            }
            onClick={RemoveFile}
          >
            Remove
          </Button>
        </div>
      </div>
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
              name="email"
              placeholder={placeholder.email}
              value={email}
              onChange={handleChange}
              disabled
            >
              <SimpleEmail />
              <input />
            </Input>
            {renderFieldError([...(errors.email || [])])}
          </Form.Field>
        </Grid.Column>
      </Grid>
      {localStorage.getItem('role') === 'consumer' ? (
        <div className="social-logins-wrapper">
          <div className="title">Linked Accounts </div>
          <div
            className={`item ${
              linkedSocialAccount?.includes('google') ? 'active' : ''
            }`}
          >
            <div className="icon">
              {res === 'desktop' ? <GoogleSvg /> : <GoogleSvgMob />}
            </div>

            <div className="link">
              {' '}
              {linkedSocialAccount?.includes('google')
                ? `@${firstName}`
                : `Not Connected`}{' '}
            </div>

            {linkedSocialAccount.includes('google') ? (
              <div
                className="btn"
                onClick={() => removeAccount('google')}
                onKeyPress={() => removeAccount('google')}
              >
                <Close />{' '}
              </div>
            ) : (
              <GoogleLogin
                clientId={process.env.GOOGLE_CLIENT_ID}
                onSuccess={(res) => handleSocialResponse(res, 'google')}
                cookiePolicy="single_host_origin"
                render={(renderProps) => (
                  <button
                    type="button"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="btn"
                  >
                    <LinkIcon />
                  </button>
                )}
              />
            )}
          </div>

          <div
            className={`item ${
              linkedSocialAccount.includes('facebook') ? 'active' : ''
            }`}
          >
            <div className="icon">
              <FacebookSvg />
            </div>
            <div className="link">
              {' '}
              {linkedSocialAccount.includes('facebook')
                ? `@${firstName}`
                : `Not Connected`}{' '}
            </div>
            {linkedSocialAccount.includes('facebook') ? (
              <div
                className="btn"
                onClick={() => removeAccount('facebook')}
                onKeyPress={() => removeAccount('facebook')}
              >
                <Close />{' '}
              </div>
            ) : (
              <div className="fb-btn-wrapper">
                <FacebookLogin
                  appId={process.env.FACEBOOK_APP_ID}
                  fields="name,email,picture"
                  callback={(res) => handleSocialResponse(res, 'facebook')}
                  textButton=""
                  cssClass="btn"
                  icon={<LinkIcon />}
                />
              </div>
            )}
          </div>
          <div
            className={`item ${
              linkedSocialAccount?.includes('apple') ? 'active' : ''
            }`}
          >
            <div className="icon">
              <AppleSvg />
            </div>
            <div className="link">
              {' '}
              {linkedSocialAccount.includes('apple')
                ? `@${firstName}`
                : `Not Connected`}{' '}
            </div>

            {linkedSocialAccount.includes('apple') ? (
              <div
                onClick={() => removeAccount('apple')}
                onKeyPress={() => removeAccount('apple')}
                className="btn"
              >
                <Close />{' '}
              </div>
            ) : (
              <AppleSignin
                authOptions={{
                  clientId: `${process.env.APPLE_CLIENT_ID}`,
                  scope: 'email name',
                  redirectURI: `${process.env.APPLE_REDIRECT_SETTING_URL}`,
                  nonce: 'nonce',
                  responseType: 'code id_token',
                  responseMode: 'form_post',
                  usePopup: true,
                }}
                onSuccess={(res) => handleSocialResponse(res, 'apple')}
                onError={(error) =>
                  console.warn(error, ': Apple SignIn Settings error')
                }
                className="apple-auth-btn"
                render={(prop) => (
                  <div className="btn" {...prop}>
                    {' '}
                    <LinkIcon />
                  </div>
                )}
              />
            )}
          </div>
        </div>
      ) : (
        ''
      )}

      <Button
        type="submit"
        disabled={!isFormValid() || !areRequiredFilled()}
        className="save-btn"
        primary
      >
        Save
      </Button>
    </Form>
  )

  return (
    <div className="personal-detail-tab">
      {(loading || isLoading) && <Loader className="screen-centered" />}
      {renderProfileForm()}
      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onOpen={() => setShowDelete(true)}
        className="create-segment-popup"
      >
        <Form>
          <Modal.Content>
            <div className="popupDeleteIcon">
              <LinkIcon />
            </div>
            <Header as="h2">
              Are you sure you want to disconnect your {socialName} account?
            </Header>
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={() => removeSocialAccount(socialName)}>
              Yes
            </Button>
            <Button secondary onClick={() => setShowDelete(false)}>
              No
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
    </div>
  )
}

PersonalDetail.propTypes = {
  fetchUserDetails: propTypes.func.isRequired,
  callUserAPI: propTypes.func.isRequired,
  userData: propTypes.objectOf(propTypes.object).isRequired,
  appleData: propTypes.objectOf(propTypes.object).isRequired,
  addToast: propTypes.func.isRequired,
  isLoading: propTypes.bool.isRequired,
  res: propTypes.string.isRequired,
}

export default withToast(PersonalDetail)
