import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import {
  Header,
  Button,
  Form,
  Input,
  Select,
  Grid,
  TextArea,
  Dropdown,
} from 'semantic-ui-react'
import DropZone from 'react-drop-zone'
import propTypes from 'prop-types'
import dayjs from 'dayjs'
import S3FileUpload from 'react-s3'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import Loader from '../../../utils/Loader'
import PagiRightArrow from '../../../svgs/PagiRightArrow'
import Postcode from '../../../svgs/Postcode'
import Message from '../../../svgs/Message'
import Upload from '../../../svgs/Upload'
import Voucher from '../../../svgs/Voucher'
import Calendar from '../../../svgs/Calendar'
import Building from '../../../svgs/Building'
import PieChart from '../../../svgs/PieChart'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import Close from '../../../svgs/Close'
import * as placeholder from '../../../utils/placeholders'
import {
  createVoucherSuccess,
  voucherLogoSizeLimit,
  emptyVoucherName,
  MinLength,
  invalidStartDate,
  invalidEndDate,
  updateVoucherSuccess,
  invalidPostcode,
  emptyVoucherExchangeValue,
  emptyVoucherQty,
  invalidVoucherQty,
  maxLength,
  notValidImage,
  emptyVoucherPercentage,
  invalidVoucherExchangeValue,
} from '../../../utils/messages'
import { renderFieldError } from '../../../utils/helper'
import AdminService from '../../../api/services/AdminService'
import {
  multiPostCodeRegx,
  imageURLRegx,
  numberRegx,
  AWS_CONFIG,
} from '../../../utils/constants'

const CreateVoucher = (props) => {
  const location = useLocation()
  const { addToast } = useToasts()
  const { segmentList, voucherDetails, emptyVoucherDetails, orgDetails } = props
  const history = useHistory()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [logo, setLogo] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [voucherName, setVoucherName] = useState('')
  const [voucherType, setVoucherType] = useState('')
  const [description, setDescription] = useState('')
  const [segmentArray, setSegmentArray] = useState(null)
  const [voucherQty, setVoucherQty] = useState('')
  const [voucherExcValue, setVoucherExcValue] = useState('')
  const [postCode, setPostCode] = useState('')
  const [voucherValue, setVoucherValue] = useState('')
  const [editForm, setEditForm] = useState(false)
  const [voucherId, setVoucherId] = useState('')
  const [voucherQRCode, setVoucherQRCode] = useState('')
  const [organisation, setOrganisation] = useState('')
  const voucherTypeOptions = [
    { key: 'Free', value: 'free', text: 'Free' },
    { key: 'Money off', value: 'moneyOff', text: 'Money off' },
    { key: 'Percentage off', value: 'percentageOff', text: 'Percentage off' },
  ]
  const segmentOptions = segmentList.map((segmentData) => ({
    text: segmentData.name,
    value: segmentData.id,
    key: segmentData.id,
  }))
  const orgOptions = orgDetails.map((org) => ({
    text: org.name,
    value: org.id,
    key: org.id,
  }))

  useEffect(() => {
    if (Object.keys(voucherDetails).length) {
      const {
        description,
        expiredAt,
        image,
        id,
        name,
        pointExchangeValue,
        quantity,
        startedAt,
        voucherAvailability,
        type,
        value,
        voucherSegment,
        qrCode,
        organisation,
      } = voucherDetails
      setEditForm(true)
      setVoucherId(id)
      startedAt && setStartDate(dayjs(startedAt).toDate())
      expiredAt && setEndDate(dayjs(expiredAt).toDate())
      if (image && imageURLRegx.test(image)) {
        setLogo(image)
      }
      setVoucherValue(value)
      description && setDescription(description)
      setVoucherQRCode(qrCode)
      setVoucherType(type)
      setVoucherName(name)
      setVoucherQty(quantity)
      organisation && setOrganisation(organisation.id)
      setVoucherExcValue(pointExchangeValue)
      const segmentSelectedArray = []
      voucherSegment.forEach((data) => {
        segmentSelectedArray.push(data.id)
      })
      setSegmentArray(segmentSelectedArray)
      setPostCode(voucherAvailability.join())
    }
  }, [voucherDetails])

  const uploadImageOnS3 = async (file) => {
    if (!file.type.includes('image')) {
      addToast(notValidImage, { appearance: 'error' })
      return
    }
    const size = file.size / 1000 / 1000
    if (size > 3) {
      addToast(voucherLogoSizeLimit, { appearance: 'error' })
      return
    }
    setIsLoading(true)
    try {
      const data = await S3FileUpload.uploadFile(file, AWS_CONFIG)
      setLogo(data.location)
      setIsLoading(false)
    } catch (err) {
      console.warn('Create Merchant(uploadImageOnS3):', err)
      setIsLoading(false)
    }
  }

  const removeFileFromS3 = async () => {
    const fileName = logo.split('/').pop()
    S3FileUpload.deleteFile(fileName, AWS_CONFIG)
      .then((response) => {
        console.warn(response, 'remove from s3')
      })
      .catch((err) => console.warn(err))
    setLogo('')
  }
  const createVoucherOnSubmit = async (data) => {
    try {
      setIsLoading(true)
      const response = await AdminService.createVoucher(data)
      if (response[0]?.message) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(createVoucherSuccess, { appearance: 'success' })
        emptyVoucherDetails()

        history.push('/admin/voucher')
      }
      setIsLoading(false)
    } catch (error) {
      console.warn('Create voucher(createVoucherOnSubmit):', error)
      setIsLoading(false)
    }
  }
  const updateVoucherOnSubmit = async (data) => {
    const queryParam = `/${voucherId}`
    try {
      setIsLoading(true)
      const response = await AdminService.editVoucher(data, queryParam)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(updateVoucherSuccess, { appearance: 'success' })
        emptyVoucherDetails()
        if (location.state !== undefined) {
          history.push({
            pathname: '/admin/voucher',
            state: { page: location.state.page },
          })
        } else {
          history.push('/admin/voucher')
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.warn('Update voucher(updateVoucherOnSubmit):', error)
      setIsLoading(false)
    }
  }

  // handle form submit
  const handleFormData = async () => {
    const obj = {
      name: voucherName.trim(),
      type: voucherType,
      pointExchangeValue: voucherExcValue,
      startedAt: dayjs(startDate).format('YYYY-MM-DD'),
      expiredAt: dayjs(endDate).format('YYYY-MM-DD'),
      quantity: voucherQty,
    }
    if (postCode !== '') {
      obj.postcode = postCode.trim().split(',')
    }
    if (voucherType === 'percentageOff') {
      obj.value = voucherValue
    }
    if (voucherType === 'moneyOff') {
      obj.value = 1
    }

    if (logo) {
      obj.image = logo
    }
    if (description.trim() !== '' && description) {
      obj.description = description.trim()
    }
    if (voucherQRCode.trim() !== '' && voucherQRCode) {
      obj.qrCode = voucherQRCode.trim()
    }
    if (organisation !== '') {
      obj.organisationId = organisation
    }
    if (localStorage.getItem('role') === 'systemAdmin' && segmentArray) {
      if (segmentArray.length > 0) obj.segmentIds = segmentArray
    }
    if (editForm) {
      updateVoucherOnSubmit(obj)
    } else createVoucherOnSubmit(obj)
  }
  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    if (name === 'voucherName') {
      if (value === '') {
        error.voucherName = [emptyVoucherName]
      } else if (value.length < 3) {
        error.voucherName = [MinLength]
      }
    }
    if (name === 'startDate') {
      if (value === '' || !value) {
        error.startDate = [invalidStartDate]
      }
    }
    if (name === 'endDate') {
      if (value === '' || !value) {
        error.endDate = [invalidEndDate]
      }
    }

    if (name === 'postCode') {
      if (value !== '') {
        const valueArr = value.trim().split(',')
        const filter = valueArr.map((item) => {
          if (item.length > 10) {
            return 'false'
          }
          return 'true'
        })
        if (!multiPostCodeRegx.test(value.trim())) {
          error.postCode = [invalidPostcode]
        } else if (filter.includes('false')) {
          error.postCode = [invalidPostcode]
        }
      }
    }
    if (name === 'voucherExcValue') {
      if (value === '') {
        error.voucherExcValue = [emptyVoucherExchangeValue]
      } else if (!numberRegx.test(value)) {
        error.voucherExcValue = [invalidVoucherExchangeValue]
      }
    }
    if (name === 'voucherQty') {
      if (value === '') {
        error.voucherQty = [emptyVoucherQty]
      } else if (!numberRegx.test(value)) {
        error.voucherQty = [invalidVoucherQty]
      }
    }

    if (name === 'voucherValue' && voucherType === 'percentageOff') {
      if (value === '') {
        error.voucherValue = [emptyVoucherPercentage]
      } else if (!numberRegx.test(value)) {
        error.voucherValue = [invalidVoucherExchangeValue]
      } else if (Number(value) > 100 || Number(value) < 1) {
        error.voucherValue = [maxLength]
      }
    }

    setErrors(error)
  }

  const handleChange = (e, { name, value }) => {
    name === 'voucherName' && setVoucherName(value)
    name === 'voucherType' && setVoucherType(value)
    name === 'description' && setDescription(value)
    name === 'endDate' && setEndDate(value)
    name === 'segmentArray' && setSegmentArray(value)
    name === 'postCode' && setPostCode(value)
    name === 'voucherQty' && setVoucherQty(value)
    name === 'voucherExcValue' && setVoucherExcValue(value)
    name === 'voucherValue' && setVoucherValue(value)
    name === 'voucherQRCode' && setVoucherQRCode(value)
    name === 'organisation' && setOrganisation(value)

    if (name === 'startDate') {
      setStartDate(value)
      if (value > endDate) {
        setEndDate('')
      }
    }

    validateField(name, value)
  }

  const isFormValid = () => !Object.keys(errors).length

  const areRequiredFilled = () => {
    const requiredFields = [
      'voucherName',
      'voucherType',
      'voucherQty',
      'voucherExcValue',
      'organisation',
      'startDate',
      'endDate',
    ]
    voucherType === 'percentageOff' && requiredFields.push('voucherValue')
    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const switchText = (over, overDocument) => {
    const Text = placeholder.voucher.image
    if (over) return 'file is over element'
    else if (overDocument) return 'file is over document'
    else return Text
  }

  return (
    <div className="create-voucher-page">
      {isLoading && <Loader className="screen-centered" />}

      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1" className="breadcrumb-wrapper">
            <span>
              {location.state !== undefined ? (
                <Link
                  to={{
                    pathname: '/admin/voucher',
                    state: { page: location.state.page },
                  }}
                  onClick={() => emptyVoucherDetails()}
                >
                  Voucher
                </Link>
              ) : (
                <Link to="/admin/voucher" onClick={() => emptyVoucherDetails()}>
                  Voucher
                </Link>
              )}
            </span>{' '}
            <PagiRightArrow /> {`${editForm ? 'Update' : 'Create'}`} Voucher
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
              <div className="ui left icon select">
                <Building />
                <Select
                  placeholder="Select Company Name"
                  options={orgOptions}
                  name="organisation"
                  onChange={handleChange}
                  value={organisation}
                />
              </div>
              {renderFieldError([...(errors.organisation || [])])}
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.voucher.qrCode}
                name="voucherQRCode"
                value={voucherQRCode}
                onChange={handleChange}
                maxLength="255"
              >
                <Voucher />
                <input />
              </Input>
              {renderFieldError([...(errors.voucherQRCode || [])])}
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.voucher.name}
                name="voucherName"
                value={voucherName}
                onChange={handleChange}
                maxLength="40"
              >
                <Voucher />
                <input />
              </Input>
              {renderFieldError([...(errors.voucherName || [])])}
            </Form.Field>
            <Form.Field>
              <div className="ui left icon select">
                <Voucher />
                <Select
                  placeholder={placeholder.voucher.type}
                  options={voucherTypeOptions}
                  name="voucherType"
                  value={voucherType}
                  onChange={handleChange}
                />
              </div>
            </Form.Field>
            {voucherType === 'percentageOff' && (
              <Form.Field>
                <Input
                  iconPosition="left"
                  placeholder="Enter percentage"
                  name="voucherValue"
                  value={voucherValue}
                  onChange={handleChange}
                >
                  <Voucher />
                  <input />
                </Input>
                {renderFieldError([...(errors.voucherValue || [])])}
              </Form.Field>
            )}
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <div className="ui left icon input textarea">
                <Message />
                <TextArea
                  iconPosition="left"
                  name="description"
                  value={description}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  maxLength="250"
                />
              </div>
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.voucher.quantity}
                name="voucherQty"
                value={voucherQty}
                onChange={handleChange}
                maxLength="7"
              >
                <Voucher />
                <input />
              </Input>
              {renderFieldError([...(errors.voucherQty || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column className="drop-zone-column">
            {logo !== '' ? (
              <div className="image-preview">
                <img src={logo} alt="Profile" />
                <div
                  className="remove-image-preview-icon"
                  onKeyDown={() => removeFileFromS3()}
                  onClick={() => removeFileFromS3()}
                >
                  {' '}
                  <Close />{' '}
                </div>
              </div>
            ) : (
              <div>
                <DropZone
                  accept=".svg,.jpg,.png"
                  onDrop={(file) => uploadImageOnS3(file)}
                >
                  {({ over, overDocument }) => (
                    <div className="drop-zone">
                      <div className="upload-icon">
                        <Upload />
                      </div>
                      <div className="file-size-text">
                        {switchText(over, overDocument)}
                      </div>
                    </div>
                  )}
                </DropZone>
              </div>
            )}
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <div className="ui left icon input calendar">
                <Calendar />
                <SemanticDatepicker
                  placeholder={placeholder.voucher.startDate}
                  value={startDate}
                  name="startDate"
                  onChange={handleChange}
                  autoComplete="off"
                  filterDate={(date) => {
                    const currentDate = new Date()
                    currentDate.setDate(currentDate.getDate() - 1)
                    return date > currentDate
                  }}
                />
              </div>
              {renderFieldError([...(errors.startDate || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <div className="ui left icon input calendar">
                <Calendar />
                <SemanticDatepicker
                  placeholder={placeholder.voucher.endDate}
                  value={endDate}
                  name="endDate"
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={startDate === '' || !startDate}
                  filterDate={(date) => {
                    const endDate = new Date()
                    endDate.setDate(endDate.getDate() - 1)
                    return date >= startDate
                  }}
                />
              </div>
              {renderFieldError([...(errors.endDate || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder="Voucher Points Credit Exchange Value"
                name="voucherExcValue"
                value={voucherExcValue}
                onChange={handleChange}
                maxLength="5"
              >
                <Voucher />
                <input />
              </Input>
              {renderFieldError([...(errors.voucherExcValue || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.postcode}
                name="postCode"
                value={postCode}
                onChange={handleChange}
              >
                <Postcode />
                <input />
              </Input>
              {renderFieldError([...(errors.postCode || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            {localStorage.getItem('role') === 'systemAdmin' && (
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
            )}
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
                {location.state !== undefined ? (
                  <Link
                    to={{
                      pathname: '/admin/voucher',
                      state: { page: location.state.page },
                    }}
                    className="ui fluid secondary button"
                    onClick={() => emptyVoucherDetails()}
                  >
                    Cancel
                  </Link>
                ) : (
                  <Link
                    to="/admin/voucher"
                    className="ui fluid secondary button"
                    onClick={() => emptyVoucherDetails()}
                  >
                    Cancel
                  </Link>
                )}
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </Form>
    </div>
  )
}

export default CreateVoucher
CreateVoucher.propTypes = {
  segmentList: propTypes.objectOf(propTypes.object).isRequired,
  emptyVoucherDetails: propTypes.func.isRequired,
  voucherDetails: propTypes.objectOf(propTypes.object).isRequired,
  orgDetails: propTypes.objectOf(propTypes.object).isRequired,
}
