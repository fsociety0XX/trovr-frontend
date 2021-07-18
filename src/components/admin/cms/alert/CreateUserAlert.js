import _ from 'lodash'
import React, { useState, useEffect, useRef } from 'react'
import {
  Header,
  Button,
  Form,
  Input,
  Select,
  Grid,
  TextArea,
  Radio,
  Dropdown,
} from 'semantic-ui-react'
import { useToasts } from 'react-toast-notifications'
import propTypes from 'prop-types'
import dayjs from 'dayjs'
import { DateTimeInput } from 'semantic-ui-calendar-react'
import { Link } from 'react-router-dom'
import Loader from '../../../../utils/Loader'
import PagiRightArrow from '../../../../svgs/PagiRightArrow'
import Message from '../../../../svgs/Message'
import Notification from '../../../../svgs/Notification'
import Location from '../../../../svgs/Location'
import Calendar from '../../../../svgs/Calendar'
import PieChart from '../../../../svgs/PieChart'
import Consumer from '../../../../svgs/Consumer'
import Merchant from '../../../../svgs/Merchant'
import User from '../../../../svgs/User'
import Close from '../../../../svgs/Close'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import * as placeholder from '../../../../utils/placeholders'
import * as url from '../../../../utils/urls'
import { renderFieldError, excludePastDate } from '../../../../utils/helper'
import NotificationService from '../../../../api/services/NotificationService'
import {
  emptyNotificationName,
  invalidNotificationName,
  dateTimeWarningMessage,
  dateTimeErrorMessage,
  pastDateTimeErrorMessage,
} from '../../../../utils/messages'
import { dateTimeRegex } from '../../../../utils/constants'

const prevStateValue = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const CreateUserAlert = (props) => {
  const { addToast } = useToasts()
  const todayDate = new Date()
  const {
    countryList,
    segmentList,
    createNotification,
    isLoading,
    notificationDetails,
    updateNotification,
    emptyAlertDetails,
  } = props
  const [errors, setErrors] = useState({})
  const [notificationName, setNotificationName] = useState('')
  const [description, setDescription] = useState('')
  const [alertLocation, setAlertLocation] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const [showUserTypes, setShowUserTypes] = useState(false)
  const [userType, setUserType] = useState('')
  const [showConsumerDropdown, setShowConsumerDropdown] = useState(false)
  const [showMerchantDropdown, setShowMerchantDropdown] = useState(false)
  const [showAdminDropdown, setShowAdminDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState([])
  const [consumerDropdownValue, setConsumerDropdownValue] = useState([])
  const [segmentDropdownValue, setSegmentDropdownValue] = useState([])
  const [merchantDropdownValue, setMerchantDropdownValue] = useState([])
  const [adminDropdownValue, setAdminDropdownValue] = useState([])
  const [editForm, setEditForm] = useState(false)
  const [notificationId, setNotificationId] = useState('')
  const prevAlertLocation = prevStateValue(alertLocation)
  const prevUserType = prevStateValue(userType)

  const alertTypeOptions = [
    { key: 'broadcast', value: 'broadcast', text: 'Broadcast' },
    { key: 'uniquePush', value: 'uniquePush', text: 'Unique Push' },
  ]

  const segmentOptions = segmentList?.map((segmentData) => ({
    text: segmentData.name,
    value: segmentData.id,
    key: segmentData.id,
  }))

  const countryOptions = countryList?.map((country) => ({
    text: country.name,
    value: country.name,
    key: country.code,
  }))

  const getUserListByType = async () => {
    setLoading(true)
    try {
      const request = {
        userSelection: userType,
      }
      alertLocation && Object.assign(request, { location: alertLocation })
      const response = await NotificationService.fetchUserListWithType(request)
      const userList = response?.map((data) => ({
        text: data.user.firstName.concat(
          ' ',
          data.user.lastName ? data.user.lastName : ''
        ),
        value: data.id,
        key: data.id,
      }))
      setUserList(userList)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.warn('getUserListByType:', err)
    }
  }

  const validateDateOnBlur = (value) => {
    if (!dateTimeRegex.test(value)) {
      addToast(dateTimeErrorMessage, { appearance: 'error' })
      setDateTime(dayjs(new Date()).format('YYYY-MM-DD HH:mm'))
    } else if (excludePastDate(value) === false) {
      addToast(pastDateTimeErrorMessage, { appearance: 'error' })
      setDateTime(dayjs(new Date()).format('YYYY-MM-DD HH:mm'))
    } else setDateTime(value)
  }

  useEffect(() => {
    if (notificationDetails) {
      const {
        name,
        description,
        id,
        location,
        triggerDate,
        type,
        userType,
        notificationSegment,
        notificationUser,
      } = notificationDetails
      const segments = []
      const users = []
      const dateTime = `${dayjs(new Date(`${triggerDate} UTC`)).format(
        'YYYY-MM-DD'
      )} ${dayjs(new Date(`${triggerDate} UTC`)).format('HH:mm')}`
      setEditForm(true)
      setNotificationName(name)
      setDescription(description)
      setNotificationId(id)
      setDateTime(dateTime)
      setAlertLocation(location)
      setNotificationType(type)
      setUserType(userType)
      type === 'uniquePush' && setShowUserTypes(true)
      notificationSegment?.forEach((segment) => {
        segments.push(segment.id)
        setSegmentDropdownValue(segments)
      })
      notificationUser?.forEach((user) => {
        users.push(user.role.id)
      })
      if (userType === 'consumer') {
        setShowConsumerDropdown(true)
        setConsumerDropdownValue(users)
      } else if (userType === 'merchant') {
        setShowMerchantDropdown(true)
        setMerchantDropdownValue(users)
      } else if (userType === 'admin') {
        setShowAdminDropdown(true)
        setAdminDropdownValue(users)
      }
    } else setEditForm(false)
  }, [notificationDetails])

  useEffect(() => {
    userType && getUserListByType()
    if (prevAlertLocation !== '' && prevUserType !== '') {
      setConsumerDropdownValue([])
      setMerchantDropdownValue([])
      setAdminDropdownValue([])
    }
  }, [userType, alertLocation])

  const isFormValid = () => !Object.keys(errors).length

  const disableSubmitBtn = () => {
    if (notificationType === 'uniquePush') {
      if (userType === '') {
        return true
      }

      if (userType === 'consumer') {
        if (
          consumerDropdownValue.length === 0 &&
          segmentDropdownValue.length === 0
        ) {
          return true
        }
      }

      if (userType === 'merchant') {
        if (merchantDropdownValue.length === 0) {
          return true
        }
      }

      if (userType === 'admin') {
        if (adminDropdownValue.length === 0) {
          return true
        }
      }
    }
    return false
  }

  const areRequiredFilled = () => {
    const requiredFields = ['notificationName', 'dateTime', 'notificationType']

    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const dateTimeToaster = () =>
    addToast(dateTimeWarningMessage, { appearance: 'info' })

  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    if (name === 'notificationName') {
      if (value.trim() === '') {
        error.notificationName = [emptyNotificationName]
      } else if (value.trim().length < 3) {
        error.notificationName = [invalidNotificationName]
      }
    }
    setErrors(error)
  }

  const resetCountryState = () => {
    setAlertLocation('')
  }

  const handleChange = (event, { name, value }) => {
    if (name === 'dateTime') {
      if (value === '') {
        dateTimeToaster()
        setDateTime(dayjs(new Date()).format('YYYY-MM-DD HH:mm'))
      } else setDateTime(value)
    }
    name === 'notificationName' && setNotificationName(value)
    name === 'description' && setDescription(value)
    name === 'alertLocation' && setAlertLocation(value)
    name === 'segementDropdown' && setSegmentDropdownValue(value)
    name === 'consumerDropdown' && setConsumerDropdownValue(value)
    name === 'merchantDropdown' && setMerchantDropdownValue(value)
    name === 'adminDropdown' && setAdminDropdownValue(value)

    if (name === 'notificationType') {
      setNotificationType(value)

      if (value === 'uniquePush') {
        setShowUserTypes(true)
      } else setShowUserTypes(false)
    }

    if (name === 'consumer' || name === 'merchant' || name === 'admin') {
      setUserType(value)
      if (value === 'consumer') {
        setShowConsumerDropdown(true)
      } else setShowConsumerDropdown(false)

      if (value === 'merchant') {
        setShowMerchantDropdown(true)
      } else setShowMerchantDropdown(false)

      if (value === 'admin') {
        setShowAdminDropdown(true)
      } else setShowAdminDropdown(false)
    }
    validateField(name, value)
  }

  const handleUserAlertFormSubmit = () => {
    const obj = {
      name: notificationName.trim(),
      alertType: notificationType,
      targetDate: dateTime,
    }
    alertLocation && Object.assign(obj, { location: alertLocation })
    description && Object.assign(obj, { description: description.trim() })
    if (notificationType === 'uniquePush') {
      userType && Object.assign(obj, { userSelection: userType })
      if (userType === 'consumer') {
        consumerDropdownValue.length &&
          Object.assign(obj, { roleIds: consumerDropdownValue })
        segmentDropdownValue.length &&
          Object.assign(obj, { segmentIds: segmentDropdownValue })
      }
      if (userType === 'admin') {
        adminDropdownValue.length &&
          Object.assign(obj, { roleIds: adminDropdownValue })
      }
      if (userType === 'merchant') {
        merchantDropdownValue.length &&
          Object.assign(obj, { roleIds: merchantDropdownValue })
      }
    }
    editForm ? updateNotification(obj, notificationId) : createNotification(obj)
  }

  const renderCreateUserAlertForm = () => (
    <Form error={!isFormValid()} onSubmit={handleUserAlertFormSubmit}>
      <Grid columns="2">
        <Grid.Column>
          <Form.Field>
            <Input
              iconPosition="left"
              placeholder={placeholder.notificationName}
              name="notificationName"
              value={notificationName || ''}
              onChange={handleChange}
              maxLength="10"
              minLength="3"
            >
              <Notification />
              <input />
            </Input>
            {renderFieldError([...(errors.notificationName || [])])}
          </Form.Field>
          <Form.Field>
            <div className="ui left icon select">
              <Select
                placeholder={placeholder.location}
                options={countryOptions || []}
                name="alertLocation"
                value={alertLocation || ''}
                onChange={handleChange}
              />
              <Location />
              <Button
                className="reset-country-dropdwn"
                disabled={!alertLocation}
                onClick={resetCountryState}
              >
                <Close />
              </Button>
            </div>
          </Form.Field>
        </Grid.Column>

        <Grid.Column>
          <Form.Field>
            <div className="ui left icon input textarea">
              <TextArea
                iconPosition="left"
                name="description"
                value={description || ''}
                onChange={handleChange}
                placeholder="Enter Description"
                maxLength="250"
              />
              <Message />
            </div>
          </Form.Field>
        </Grid.Column>

        <Grid.Column className="alert-type-column">
          <Form.Field>
            <div className="ui left icon select">
              <Select
                placeholder={placeholder.alertType}
                options={alertTypeOptions || []}
                name="notificationType"
                value={notificationType || ''}
                onChange={handleChange}
              />
              <Notification />
            </div>
          </Form.Field>
        </Grid.Column>

        <Grid.Column className="noti-time-column">
          <Form.Field>
            <div className="ui left icon input calendar">
              <Calendar />
              <DateTimeInput
                minDate={todayDate}
                dateFormat="YYYY-MM-DD"
                name="dateTime"
                placeholder="Select notification target time"
                value={dateTime || ''}
                iconPosition="right"
                onChange={handleChange}
                autoComplete="off"
                clearable
                onBlur={_.debounce(
                  (e) =>
                    validateDateOnBlur(
                      e?.target?.value ? e?.target?.value : dateTime
                    ),
                  20
                )}
              />
            </div>
          </Form.Field>
        </Grid.Column>

        {showUserTypes && (
          <>
            <Grid.Column className="unique-push-wrapper">
              <label htmlFor="selectUserType">Select User Types</label>
              <Form.Field>
                <Grid columns={3}>
                  <Grid.Column>
                    <Radio
                      id="selectUserType"
                      name="consumer"
                      className="rewards-radio-button"
                      label="Consumer"
                      value="consumer"
                      checked={userType === 'consumer'}
                      onChange={handleChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Radio
                      className="rewards-radio-button"
                      name="merchant"
                      label="Merchant"
                      value="merchant"
                      checked={userType === 'merchant'}
                      onChange={handleChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    {' '}
                    <Radio
                      className="rewards-radio-button"
                      name="admin"
                      label="Admin"
                      value="admin"
                      checked={userType === 'admin'}
                      onChange={handleChange}
                    />
                  </Grid.Column>
                </Grid>
              </Form.Field>
            </Grid.Column>
            <Grid.Column className="m-hide" />
          </>
        )}

        {showConsumerDropdown && showUserTypes && (
          <>
            <Grid.Column>
              <div className="label">Select Segment or Consumer</div>
              <Form.Field>
                <div className="ui left icon select">
                  <PieChart />
                  <Dropdown
                    placeholder={placeholder.segment}
                    name="segementDropdown"
                    className="useralert-segementDropdown"
                    value={segmentDropdownValue || ''}
                    fluid
                    multiple
                    selection
                    search
                    options={segmentOptions || []}
                    onChange={handleChange}
                  />
                </div>
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <div className="label labelOnly" />
              <Form.Field>
                <div className="ui left icon select">
                  <Consumer />
                  <Dropdown
                    id="selectConsumer"
                    placeholder="Select Consumer"
                    name="consumerDropdown"
                    value={consumerDropdownValue || ''}
                    fluid
                    multiple
                    selection
                    search
                    options={userList || []}
                    onChange={handleChange}
                  />
                </div>
              </Form.Field>
            </Grid.Column>
          </>
        )}

        {showMerchantDropdown && showUserTypes && (
          <Grid.Column>
            <label htmlFor="SelectMerchant">Select Merchant</label>
            <Form.Field>
              <div className="ui left icon select">
                <Merchant />
                <Dropdown
                  placeholder="Select Merchant"
                  name="merchantDropdown"
                  value={merchantDropdownValue || ''}
                  id="SelectMerchant"
                  fluid
                  multiple
                  selection
                  search
                  options={userList || []}
                  onChange={handleChange}
                />
              </div>
            </Form.Field>
          </Grid.Column>
        )}

        {showAdminDropdown && showUserTypes && (
          <Grid.Column>
            <label htmlFor="SelectUser">Select User</label>
            <Form.Field>
              <div className="ui left icon select">
                <User />
                <Dropdown
                  id="SelectUser"
                  placeholder="Select User"
                  name="adminDropdown"
                  value={adminDropdownValue || ''}
                  fluid
                  multiple
                  selection
                  search
                  options={userList || []}
                  onChange={handleChange}
                />
              </div>
            </Form.Field>
          </Grid.Column>
        )}
      </Grid>

      <Grid columns="2" className="form-button-wrapper">
        <Grid.Column>
          <Grid columns="2">
            <Grid.Column>
              <Button
                primary
                fluid
                type="submit"
                disabled={
                  !isFormValid() || !areRequiredFilled() || disableSubmitBtn()
                }
              >
                {editForm ? 'Update' : 'Create'}
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Link
                to={url.userAlert}
                className="ui fluid secondary button"
                onClick={() => emptyAlertDetails()}
              >
                Cancel
              </Link>
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </Form>
  )

  return (
    <div className="create-voucher-page">
      {(loading || isLoading) && <Loader className="screen-centered" />}
      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1" className="breadcrumb-wrapper">
            <span>
              <Link to={url.userAlert} onClick={() => emptyAlertDetails()}>
                User Alerts
              </Link>
            </span>{' '}
            <PagiRightArrow /> {`${editForm ? 'Update' : 'Create'}`} User Alert
          </Header>
          <div className="date">
            <span> {`${dayjs().format('dddd')}`}, </span>{' '}
            {`${dayjs().format('D MMMM YYYY')}`}
          </div>
        </div>
      </div>
      {renderCreateUserAlertForm()}
    </div>
  )
}

CreateUserAlert.propTypes = {
  countryList: propTypes.func.isRequired,
  segmentList: propTypes.func.isRequired,
  isLoading: propTypes.bool.isRequired,
  createNotification: propTypes.func.isRequired,
  updateNotification: propTypes.func.isRequired,
  emptyAlertDetails: propTypes.func.isRequired,
  notificationDetails: propTypes.objectOf(propTypes.object).isRequired,
}

export default CreateUserAlert
