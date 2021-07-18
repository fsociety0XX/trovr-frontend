import React, { useState, useEffect } from 'react'
import {
  Header,
  Button,
  Form,
  Input,
  Select,
  Dropdown,
  Grid,
  TextArea,
} from 'semantic-ui-react'
import dayjs from 'dayjs'
import { useHistory, Link } from 'react-router-dom'
import propTypes from 'prop-types'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import _ from 'lodash'

import PagiRightArrow from '../../../svgs/PagiRightArrow'
import User from '../../../svgs/User'
import SimpleEmail from '../../../svgs/SimpleEmail'
import Flag from '../../../svgs/Flag'
import Location from '../../../svgs/Location'
import Postcode from '../../../svgs/Postcode'
import Calendar from '../../../svgs/Calendar'
import Gender from '../../../svgs/Gender'
import Lock from '../../../svgs/Lock'
import Eye from '../../../svgs/Eye'
import PieChart from '../../../svgs/PieChart'
import StrikedEye from '../../../svgs/StrikedEye'
import Loader from '../../../utils/Loader'
import AdminService from '../../../api/services/AdminService'
import * as placeholder from '../../../utils/placeholders'

import {
  emailRegex,
  passwordRegex,
  nameRegex,
  onlyAlphaNumericValues,
} from '../../../utils/constants'
import {
  invalidEmail,
  invalidFirstName,
  invalidLastName,
  invalidAddress,
  maxLengthHundred,
  invalidTown,
  invalidCity,
  invalidCountry,
  invalidDOB,
  invalidGender,
  invalidSegment,
  maxLengthFifty,
  invalidPostcode,
  invalidPassword,
  createConsumerSuccess,
  updateConsumerSuccess,
} from '../../../utils/messages'
import { renderFieldError } from '../../../utils/helper'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'

const CreateConsumer = (props) => {
  const history = useHistory()
  const {
    addToast,
    segmentList,
    countryList,
    ConsumerList,
    emptyConsumerDetails,
  } = props
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [town, setTown] = useState('')
  const [city, setCity] = useState('')
  const [postCode, setPostCode] = useState('')
  const [country, setCountry] = useState('')
  const [dob, setDOB] = useState('')
  const [gender, setGender] = useState('')
  const [segmentArray, setSegment] = useState(null)
  const [password, setPassword] = useState('')
  const [pwdType, setPwdType] = useState('password')
  const [editForm, setEditForm] = useState(false)
  const [consumerId, setConsumerId] = useState('')
  const [disableEye, setDisableEye] = useState(false)

  const countryOptions = countryList.map((country) => ({
    text: country.name,
    value: country.name,
    key: country.code,
  }))

  useEffect(() => {
    if (Object.keys(ConsumerList).length) {
      const {
        email,
        country,
        firstName,
        city,
        lastName,
        dob,
        id,
        gender,
        postCode,
        town,
        address,
      } = ConsumerList
      setEditForm(true)
      setFirstName(firstName)
      setLastName(lastName)
      setTown(town)
      setAddress(address)
      setCity(city)
      setConsumerId(id)
      setCountry(country)
      setGender(gender)
      setPostCode(postCode)
      setPassword('*****')
      setPwdType('text')
      setDisableEye(true)
      dob && setDOB(dayjs(dob).toDate())
      setEmail(email)
      const segmentSelectedArray = []
      ConsumerList.role[0]?.segments.forEach((data) => {
        segmentSelectedArray.push(data.id)
      })
      segmentSelectedArray.length > 0 && setSegment(segmentSelectedArray)
    }
  }, [ConsumerList])

  const segmentOptions = segmentList.map((segmentData) => ({
    text: segmentData.name,
    value: segmentData.id,
    key: segmentData.id,
  }))

  const genderOptions = [
    { key: 'ml', value: 'male', text: 'Male' },
    { key: 'fm', value: 'female', text: 'Female' },
    { key: 'ot', value: 'other', text: 'Other' },
  ]
  const isFormValid = () => !Object.keys(errors).length
  const createConsumerOnSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await AdminService.createConsumer(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(createConsumerSuccess, { appearance: 'success' })
        emptyConsumerDetails()
        history.push('/admin/consumer')
      }
      setLoading(false)
    } catch (error) {
      console.warn('Create consumer(createConsumerOnSubmit):', error)
      setLoading(false)
    }
  }
  const updateConsumerOnSubmit = async (data) => {
    setLoading(true)
    const queryParam = `/${consumerId}`
    try {
      const response = await AdminService.editConsumer(data, queryParam)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(updateConsumerSuccess, { appearance: 'success' })
        emptyConsumerDetails()
        history.push('/admin/consumer')
      }
      setLoading(false)
    } catch (error) {
      console.warn('Update consumer(updateConsumerOnSubmit):', error)
      setLoading(false)
    }
  }
  // handle form submit
  const handleFormData = async () => {
    let obj = {
      email,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password,
      gender,
      dob: dayjs(dob).format('YYYY-MM-DD'),
      address: address.trim(),
      town: town.trim(),
      city: city.trim(),
      country,
      postCode: postCode.trim(),
      segmentIds: segmentArray,
    }
    if (editForm) {
      obj = _.omit(obj, 'email')

      if (obj.password === '' || obj.password === '*****') {
        obj = _.omit(obj, 'password')
      }

      updateConsumerOnSubmit(obj)
    } else createConsumerOnSubmit(obj)
  }

  const changeType = () => {
    if (pwdType === 'password') {
      setPwdType('text')
    } else {
      setPwdType('password')
    }
  }
  const handleEyeIcon = () => {
    if (editForm) {
      setDisableEye(false)
      setPassword('')
      setPwdType('password')
    }
  }
  const areRequiredFilled = () => {
    let requiredFields = [
      'firstName',
      'lastName',
      'postCode',
      'town',
      'email',
      'password',
      'address',
      'segmentArray',
      'gender',
      'dob',
      'country',
      'city',
    ]
    if (editForm) {
      requiredFields = requiredFields.filter((item) => item !== 'password')
    }
    return requiredFields.find((i) => !eval(i)) === undefined
  }
  // handle form validation
  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    if (name === 'firstName') {
      if (!nameRegex.test(value.trim())) {
        error.firstName = [invalidFirstName]
      }
    }
    if (name === 'lastName') {
      if (!nameRegex.test(value.trim())) {
        error.lastName = [invalidLastName]
      }
    }
    if (name === 'email') {
      if (!emailRegex.test(value)) {
        error.email = [invalidEmail]
      }
    }
    if (name === 'address') {
      if (value === '') {
        error.address = [invalidAddress]
      } else if (value.length > 100) {
        error.address = [maxLengthHundred]
      }
    }
    if (name === 'town') {
      if (value === '') {
        error.town = [invalidTown]
      } else if (value.length > 100) {
        error.town = [maxLengthHundred]
      }
    }
    if (name === 'city') {
      if (value === '') {
        error.city = [invalidCity]
      } else if (value.length > 50) {
        error.city = [maxLengthFifty]
      }
    }
    if (name === 'postCode') {
      // aplhanumeric no special character
      if (!onlyAlphaNumericValues.test(value)) {
        error.postCode = [invalidPostcode]
      }
    }
    if (name === 'password') {
      if (!passwordRegex.test(value)) {
        error.password = [invalidPassword]
      }
    }
    if (name === 'country') {
      if (value === '') {
        error.country = [invalidCountry]
      }
    }
    if (name === 'segmentArray') {
      if (value.length === 0) {
        error.segmentArray = [invalidSegment]
      }
    }
    if (name === 'dob') {
      if (value === '' || !value) {
        error.dob = [invalidDOB]
      }
    }
    if (name === 'gender') {
      if (value === '') {
        error.gender = [invalidGender]
      }
    }
    setErrors(error)
  }
  //
  const handleChange = (e, { name, value }) => {
    if (name === 'firstName') {
      setFirstName(value)
    }
    if (name === 'lastName') {
      setLastName(value)
    }
    if (name === 'segmentArray') {
      setSegment(value)
    }
    if (name === 'email') {
      setEmail(value)
    }
    if (name === 'address') {
      setAddress(value)
    }
    if (name === 'town') {
      setTown(value)
    }
    if (name === 'city') {
      setCity(value)
    }
    if (name === 'postCode') {
      setPostCode(value)
    }
    if (name === 'country') {
      setCountry(value)
    }
    if (name === 'dob') {
      setDOB(value)
    }
    if (name === 'gender') {
      setGender(value)
    }
    if (name === 'password') {
      setPassword(value)
    }

    validateField(name, value)
  }
  return (
    <div className="create-consumer-page">
      {loading && <Loader className="screen-centered" />}
      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1" className="breadcrumb-wrapper">
            <span>
              <Link to="/admin/consumer" onClick={() => emptyConsumerDetails()}>
                Consumer
              </Link>
            </span>{' '}
            <PagiRightArrow /> {`${editForm ? 'Update' : 'Create'}`} Consumer
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
                onChange={handleChange}
                value={firstName}
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
                onChange={handleChange}
                value={lastName}
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
                onChange={handleChange}
                value={email}
                disabled={editForm}
              >
                <SimpleEmail />
                <input />
              </Input>
              {renderFieldError([...(errors.email || [])])}
            </Form.Field>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.town}
                name="town"
                onChange={handleChange}
                value={town}
              >
                <Location />
                <input />
              </Input>
              {renderFieldError([...(errors.town || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <div className="ui left icon input textarea">
                <Location />
                <TextArea
                  iconPosition="left"
                  name="address"
                  placeholder={placeholder.address}
                  onChange={handleChange}
                  value={address}
                />
              </div>
              {renderFieldError([...(errors.address || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.city}
                name="city"
                onChange={handleChange}
                value={city}
              >
                <Location />
                <input />
              </Input>
              {renderFieldError([...(errors.city || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.postcode}
                name="postCode"
                onChange={handleChange}
                value={postCode}
                minLength="1"
                maxLength="10"
              >
                <Postcode />
                <input />
              </Input>
              {renderFieldError([...(errors.postCode || [])])}
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
                  onChange={handleChange}
                  value={country}
                />
              </div>
              {renderFieldError([...(errors.country || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <div className="ui left icon input calendar">
                <Calendar />
                <SemanticDatepicker
                  format="DD/MM/YY"
                  name="dob"
                  placeholder={placeholder.birthDate}
                  value={dob}
                  autoComplete="off"
                  filterDate={(date) => {
                    // const currentDate = new Date()
                    // currentDate.setDate(currentDate.getDate() - 1)
                    // return date < currentDate

                    const myDob = new Date(date)
                    const today = new Date()
                    const maxDob = new Date(
                      today.getFullYear() - 18,
                      today.getMonth(),
                      today.getDate()
                    )
                    return maxDob.getTime() > myDob.getTime()
                  }}
                  onChange={handleChange}
                />
              </div>
              {renderFieldError([...(errors.dob || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <div className="ui left icon select">
                <Gender />
                <Select
                  placeholder={placeholder.gender}
                  options={genderOptions}
                  name="gender"
                  onChange={handleChange}
                  value={gender}
                />
              </div>
              {renderFieldError([...(errors.gender || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <div className="ui left icon select">
                <PieChart />
                <Dropdown
                  placeholder={placeholder.segment}
                  name="segmentArray"
                  value={segmentArray}
                  fluid
                  multiple
                  selection
                  search
                  options={segmentOptions}
                  onChange={handleChange}
                />
              </div>
              {renderFieldError([...(errors.segmentArray || [])])}
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
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
                  onClick={handleEyeIcon}
                >
                  <div
                    className={`right-icon ${disableEye ? 'disabled' : ''}`}
                    onClick={changeType}
                    onKeyDown={changeType}
                  >
                    {pwdType === 'password' ? <Eye /> : <StrikedEye />}
                  </div>
                  <input />
                </Input>
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
                  to="/admin/consumer"
                  className="ui fluid secondary button"
                  onClick={() => emptyConsumerDetails()}
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

export default CreateConsumer

CreateConsumer.propTypes = {
  ConsumerList: propTypes.arrayOf(propTypes.array).isRequired,
  countryList: propTypes.objectOf(propTypes.object).isRequired,
  addToast: propTypes.func.isRequired,
  segmentList: propTypes.objectOf(propTypes.object).isRequired,
  emptyConsumerDetails: propTypes.func.isRequired,
}
