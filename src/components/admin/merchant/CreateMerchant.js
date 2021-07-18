import _ from 'lodash'
import React, { useState, useEffect, useRef } from 'react'
import propTypes from 'prop-types'
import { useHistory, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { useToasts } from 'react-toast-notifications'
import S3FileUpload from 'react-s3'
import {
  Header,
  Button,
  Form,
  Input,
  Select,
  Grid,
  TextArea,
} from 'semantic-ui-react'
import dayjs from 'dayjs'
import DropZone from 'react-drop-zone'
import PagiRightArrow from '../../../svgs/PagiRightArrow'
import User from '../../../svgs/User'
import SimpleEmail from '../../../svgs/SimpleEmail'
import Merchant from '../../../svgs/Merchant'
import Flag from '../../../svgs/Flag'
import Location from '../../../svgs/Location'
import Postcode from '../../../svgs/Postcode'
import Message from '../../../svgs/Message'
import StrikedEye from '../../../svgs/StrikedEye'
import Eye from '../../../svgs/Eye'
import Lock from '../../../svgs/Lock'
import Phone from '../../../svgs/Phone'
import Doc from '../../../svgs/Doc'
import Upload from '../../../svgs/Upload'
import Building from '../../../svgs/Building'
import Close from '../../../svgs/Close'
import * as loginAction from '../../../redux/actions/loginAction'
import {
  emailRegex,
  phoneRegex,
  passwordRegex,
  nameRegex,
  onlyAlphaNumericValues,
  defaultImage,
  AWS_CONFIG,
} from '../../../utils/constants'
import { renderFieldError } from '../../../utils/helper'
import {
  invalidEmail,
  invalidPassword,
  invalidFirstName,
  invalidLastName,
  emptyFirstName,
  emptyLastName,
  emptyEmail,
  emptyCompanyName,
  emptyPrimaryCompanyAddress,
  invalidPostcode,
  emptyPostcode,
  invalidPhoneNo,
  notValidImage,
  imageSizeLimit,
  createMerchantSuccess,
  updateMerchantSuccess,
} from '../../../utils/messages'
import Loader from '../../../utils/Loader'
import MerchantService from '../../../api/services/MerchantService'
import * as placeholder from '../../../utils/placeholders'

window.Buffer = require('buffer').Buffer

/**
 * @author Kushagra Garg
 * @param {*} value
 * @returns it'll return previous value of any state
 */
const prevStateValue = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const CreateMerchant = (props) => {
  let secondaryAddressArray = []
  const { addToast } = useToasts()
  const history = useHistory()
  const {
    countryList,
    userLoginInfo,
    merchantDetails,
    emptyMerchantDetails,
  } = props
  const [showPassword, setshowPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [primaryCompanyAddress, setPrimaryCompanyAddress] = useState('')
  const [postcode, setPostcode] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [entity1, setEntity1] = useState('')
  const [entity2, setEntity2] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [branchNo, setBranchNo] = useState(0)
  const [logo, setLogo] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [entity1FileName, setEntity1FileName] = useState('')
  const [entity2FileName, setEntity2FileName] = useState('')
  const [phoneCode, setPhoneCode] = useState('+356')
  const [merchantType, setMerchantType] = useState('')
  const [company, setCompany] = useState('')
  const [organisationList, setOrganisationList] = useState([])
  const [merchantOrgId, setMerchantOrgId] = useState('')
  const [merchantId, setMerchantId] = useState('')
  const [merchantBranchList, setMerchantBranchList] = useState([])
  const [editForm, setEditForm] = useState(false)
  const [disableEye, setDisableEye] = useState(false)
  const [disableMerchantFields, setdisableMerchantFields] = useState(false)
  const prevMerchantType = prevStateValue({ merchantType })

  useEffect(() => {
    countryList()
  }, [])

  const countryOptions = userLoginInfo?.countryList?.map((country) => ({
    text: country.name,
    value: country.name,
    key: country.code,
    telephoneCode: country.telephoneCode,
  }))

  useEffect(() => {
    if (Object.keys(merchantDetails).length) {
      const { country, email, firstName, id, lastName, role } = merchantDetails
      setEditForm(true)
      setFirstName(firstName)
      lastName && setLastName(lastName)
      setCountry(country)
      setEmail(email)
      setMerchantId(id)
      setPassword('*****')
      setshowPassword(true)
      setDisableEye(true)
      if (Object.keys(role).length) {
        setMerchantType(role[0].name)
        role[0].name === 'merchantUser' && setdisableMerchantFields(true)
        setMerchantOrgId(role[0].organisationId)
        role[0].organisation.description &&
          setCompanyDescription(role[0].organisation.description)
        role[0].organisation.logo && setLogo(role[0].organisation.logo)
        setCompanyName(role[0].organisation.name)
        setCompany(role[0].organisation.name)
        role[0].organisation.noOfBranch &&
          setBranchNo(role[0].organisation.noOfBranch)
        setPostcode(role[0].organisation.postcode)
        setPrimaryCompanyAddress(role[0].organisation.primaryAddress)
        setEntity1(role[0].organisation.proof1)
        setEntity2(role[0].organisation.proof2)
        role[0].organisation.telephone.includes('-')
          ? setPhone(role[0].organisation.telephone.split('-')[1])
          : setPhone(role[0].organisation.telephone)
        role[0].organisation.telephone.includes('-')
          ? setPhoneCode(role[0].organisation.telephone.split('-')[0])
          : phoneCode
        role[0].organisation.branches &&
          setMerchantBranchList(role[0].organisation.branches)

        const splitEntity1Url = role[0].organisation.proof1.split('%')
        const entity1File = splitEntity1Url.pop()
        role[0].organisation.proof1 && setEntity1FileName(entity1File)

        const splitEntity2Url = role[0].organisation.proof2.split('%')
        const entity2File = splitEntity2Url.pop()
        role[0].organisation.proof2 && setEntity2FileName(entity2File)
      }
    }
  }, [merchantDetails])

  useEffect(() => {
    merchantBranchList?.forEach((data, i) => {
      if (document.getElementById(`secondaryCompanyAddress${i}`)) {
        document.getElementById(`secondaryCompanyAddress${i}`).value =
          data.address
      }
    })
  }, [merchantBranchList])

  const fetchOrganisationList = async () => {
    setIsLoading(true)
    try {
      const response = await MerchantService.getOrganisationList()
      setOrganisationList(response)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.warn('Create Merchant(fetchOrganisationList):', error)
    }
  }
  const handleEyeIcon = () => {
    if (editForm) {
      setDisableEye(false)
      setPassword('')
      setshowPassword(false)
    }
  }
  const resetFormValues = () => {
    setCompanyName('')
    setPrimaryCompanyAddress('')
    setPostcode('')
    setCountry('')
    setPhone('')
    setEntity1('')
    setEntity2('')
    setCompanyDescription('')
    setBranchNo('')
    setLogo('')
    setEntity1FileName('')
    setEntity2FileName('')
    setPhoneCode('+356')
    setCompany('')
    setMerchantOrgId('')
    setMerchantBranchList([])
    setErrors({})
  }

  useEffect(() => {
    merchantType === 'merchantUser' && fetchOrganisationList()
    if (prevMerchantType?.merchantType !== '') {
      merchantType === 'merchantAdmin' && resetFormValues()
    }
  }, [merchantType])

  const companyOptions = organisationList?.map((data) => ({
    text: data.name,
    value: data.name,
    key: Math.random(),
  }))

  const merchantOptions = [
    {
      text: 'Standard Merchant',
      value: 'merchantUser',
      key: 'merchantUser',
    },
    {
      text: 'Admin Merchant',
      value: 'merchantAdmin',
      key: 'merchantAdmin',
    },
  ]

  const telephoneOptions = userLoginInfo?.countryList?.map((country) => ({
    text: country.telephoneCode,
    value: country.telephoneCode,
    key: country.code,
  }))

  const togglePassword = (type = null) => {
    if (type === 'newPassword') {
      setshowPassword(!showPassword)
    }
  }

  const switchText = (over, overDocument) => {
    const Text = placeholder.company.logo
    if (over) return 'file is over element'
    else if (overDocument) return 'file is over document'
    else return Text
  }

  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    if (name === 'password') {
      if (editForm) {
        if (value.trim() !== '') {
          if (!passwordRegex.test(value)) {
            error.password = [invalidPassword]
          }
        }
      } else if (!passwordRegex.test(value)) {
        error.password = [invalidPassword]
      }
    }

    if (name === 'email') {
      if (value === '') {
        error.email = [emptyEmail]
      } else if (!emailRegex.test(value)) {
        error.email = [invalidEmail]
      }
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

    if (name === 'companyName') {
      if (value.trim() === '') {
        error.companyName = [emptyCompanyName]
      }
    }

    if (name === 'primaryCompanyAddress') {
      if (value.trim() === '') {
        error.primaryCompanyAddress = [emptyPrimaryCompanyAddress]
      }
    }

    if (name === 'postcode') {
      if (value === '') {
        error.postcode = [emptyPostcode]
      } else if (!onlyAlphaNumericValues.test(value)) {
        error.postcode = [invalidPostcode]
      }
    }

    if (name === 'phone') {
      if (!phoneRegex.test(value)) {
        error.phone = [invalidPhoneNo]
      }
    }

    setErrors(error)
  }

  const uploadImageOnS3 = async (field, file) => {
    if (!file.type.includes('image')) {
      addToast(notValidImage, { appearance: 'error' })
      return
    }
    const size = file.size / 1000 / 1000
    if (size > 10) {
      addToast(imageSizeLimit, { appearance: 'error' })
      return
    }
    field === 'entity1' && setEntity1FileName(file.name)
    field === 'entity2' && setEntity2FileName(file.name)
    setIsLoading(true)
    try {
      const data = await S3FileUpload.uploadFile(file, AWS_CONFIG)
      field === 'entity1' && setEntity1(data.location)
      field === 'entity2' && setEntity2(data.location)
      field === 'logo' && setLogo(data.location)
      setIsLoading(false)
    } catch (err) {
      console.warn('Create Merchant(uploadImageOnS3):', err)
      setIsLoading(false)
    }
  }

  const removeFileFromS3 = async (field) => {
    let fileName = ''
    if (field === 'entity1') {
      fileName = entity1FileName.split('/').pop()
    } else if (field === 'entity2') {
      fileName = entity2FileName.split('/').pop()
    } else if (field === 'logo') {
      fileName = logo.split('/').pop()
    }

    S3FileUpload.deleteFile(fileName, AWS_CONFIG)
      .then((response) => {
        console.warn(response, 'remove from s3')
      })
      .catch((err) => console.warn(err))

    if (field === 'entity1') {
      setEntity1('')
      setEntity1FileName('')
    }
    if (field === 'entity2') {
      setEntity2('')
      setEntity2FileName('')
    }
    if (field === 'logo') {
      setLogo('')
    }
  }

  const fillMerchantDetails = (value) => {
    const merchantOrganisation = organisationList.filter(
      (data) => data.name === value
    )
    const {
      id,
      country,
      description,
      logo,
      name,
      noOfBranch,
      postcode,
      primaryAddress,
      proof1,
      proof2,
      telephone,
      branches,
    } = merchantOrganisation[0]
    id && setMerchantOrgId(id)
    country && setCountry(country)
    description && setCompanyDescription(description)
    logo && setLogo(logo)
    name && setCompanyName(name)
    noOfBranch && setBranchNo(noOfBranch)
    postcode && setPostcode(postcode)
    primaryAddress && setPrimaryCompanyAddress(primaryAddress)
    proof1 && setEntity1(proof1)
    proof2 && setEntity2(proof2)
    telephone &&
      (telephone.includes('-')
        ? setPhone(telephone.split('-')[1])
        : setPhone(telephone))
    telephone &&
      (telephone.includes('-')
        ? setPhoneCode(telephone.split('-')[0])
        : phoneCode)
    branches && setMerchantBranchList(branches)
    const splitEntity1Url = proof1.split('%')
    const entity1File = splitEntity1Url.pop()
    proof1 && setEntity1FileName(entity1File)

    const splitEntity2Url = proof2.split('%')
    const entity2File = splitEntity2Url.pop()
    proof2 && setEntity2FileName(entity2File)
    setdisableMerchantFields(true)
  }

  const handleChange = (e, { name, value }) => {
    name === 'firstName' && setFirstName(value)
    name === 'lastName' && setLastName(value)
    name === 'email' && setEmail(value)
    name === 'password' && setPassword(value)
    name === 'companyName' && setCompanyName(value)
    name === 'country' && setCountry(value)
    name === 'primaryCompanyAddress' && setPrimaryCompanyAddress(value)
    name === 'postcode' && setPostcode(value)
    name === 'phone' && setPhone(value)
    name === 'phoneCode' && setPhoneCode(value)
    name === 'companyDescription' && setCompanyDescription(value)
    name === 'company' && setCompany(value)

    if (name === 'merchantType') {
      value === 'merchantAdmin' && setdisableMerchantFields(false)
      setMerchantType(value)
    }

    if (name === 'entity1' || name === 'entity2') {
      uploadImageOnS3(name, e.target.files[0])
    }
    if (name === 'branchNo') {
      setBranchNo(value)
      if (value === '') {
        secondaryAddressArray = []
      }
    }
    if (name === 'company') {
      fillMerchantDetails(value)
    }

    validateField(name, value)
  }

  const isFormValid = () => !Object.keys(errors).length

  const areRequiredFilled = () => {
    const requiredFields = [
      'email',
      'firstName',
      'lastName',
      'country',
      'companyName',
      'primaryCompanyAddress',
      'postcode',
      'phone',
      'entity1',
      'entity2',
      'merchantType',
    ]
    !editForm && requiredFields.push('password')
    merchantType === 'merchantUser' && requiredFields.push('company')
    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const createMerchantOnSubmit = async (data) => {
    try {
      const response = await MerchantService.createMerchant(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(createMerchantSuccess, { appearance: 'success' })
        emptyMerchantDetails()
        history.push('/admin/merchant')
      }
      setIsLoading(false)
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      console.warn('Create Merchant(createMerchantOnSubmit):', error)
      setIsLoading(false)
    }
  }

  const updateMerchantOnSubmit = async (data) => {
    const queryParam = `/${merchantId}`
    try {
      const response = await MerchantService.updateMerchant(data, queryParam)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(updateMerchantSuccess, { appearance: 'success' })
        emptyMerchantDetails()
        history.push('/admin/merchant')
      }
      setIsLoading(false)
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      console.warn('Update Merchant(updateMerchantOnSubmit):', error)
      setIsLoading(false)
    }
  }

  const handleMerchantFormData = async () => {
    setIsLoading(true)
    const obj = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      companyName: companyName.trim(),
      primaryCompanyAddress: primaryCompanyAddress.trim(),
      postCode: postcode.trim(),
      country,
      primaryCompanyTelephoneNumber: `${phoneCode}-${phone}`,
      proof1: entity1,
      proof2: entity2,
      type: merchantType,
    }

    if (email && !editForm) {
      Object.assign(obj, { email: email.trim() })
    }

    if (password !== '' && password !== '*****') {
      Object.assign(obj, { password })
    }

    if (branchNo) {
      const numberOfBranches = {
        numberOfBranches: branchNo.trim(),
      }
      Object.assign(obj, numberOfBranches)
    } else Object.assign(obj, { numberOfBranches: 0 })

    if (companyDescription) {
      Object.assign(obj, { companyDescription: companyDescription.trim() })
    }

    if (logo) {
      Object.assign(obj, { logo })
    } else {
      Object.assign(obj, { logo: '' })
    }

    if (branchNo) {
      let branchAddress = []
      for (let i = 0; i <= branchNo; i += 1) {
        if (document.getElementById(`secondaryCompanyAddress${i}`)) {
          branchAddress.push(
            document.getElementById(`secondaryCompanyAddress${i}`).value
          )
        }
      }
      branchAddress = branchAddress.filter((d) => d.trim() !== '')
      Object.assign(obj, { branchAddress })
    }

    if (merchantType === 'merchantUser') {
      const tempObj = {
        organisationId: merchantOrgId,
      }
      Object.assign(obj, tempObj)
    }

    if (editForm) {
      updateMerchantOnSubmit(obj)
    } else createMerchantOnSubmit(obj)
  }

  const renderSecondaryAddress = (branchNo) => {
    const limit = branchNo - 1
    for (let i = 0; i <= limit; i += 1) {
      secondaryAddressArray.push(
        <Grid.Column>
          <Form.Field>
            <div className="ui left icon input textarea">
              <TextArea
                iconPosition="left"
                id={`secondaryCompanyAddress${i}`}
                name={`secondaryCompanyAddress${i}`}
                placeholder={placeholder.company.secondaryAddress}
                onChange={handleChange}
                disabled={disableMerchantFields}
              />
              <Location />
            </div>
          </Form.Field>
        </Grid.Column>
      )
    }
    return secondaryAddressArray
  }

  const renderCreateMerchantForm = () => {
    const extEntity1FileName = entity1FileName.substring(
      entity1FileName.lastIndexOf('.') + 1
    )
    const extEntity2FileName = entity2FileName.substring(
      entity2FileName.lastIndexOf('.') + 1
    )
    return (
      <Form error={!isFormValid()} onSubmit={handleMerchantFormData}>
        <Grid columns={2} className="create-merchant">
          <Grid.Column>
            <Form.Field>
              <div className="ui left icon select 13">
                <Select
                  placeholder={placeholder.merchantType}
                  options={merchantOptions}
                  name="merchantType"
                  value={merchantType || ''}
                  onChange={handleChange}
                  disabled={editForm}
                />
                <Merchant />
              </div>
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            {merchantType === 'merchantUser' && (
              <Form.Field>
                <div className="ui left icon select">
                  <Select
                    placeholder="Select Company Name"
                    options={companyOptions}
                    name="company"
                    value={company || ''}
                    onChange={handleChange}
                    disabled={editForm}
                  />
                  <Flag />
                </div>
              </Form.Field>
            )}
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.firstName}
                name="firstName"
                value={firstName || ''}
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
                value={lastName || ''}
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
                value={email || ''}
                onChange={handleChange}
                disabled={editForm}
              >
                <SimpleEmail />
                <input />
              </Input>
              {renderFieldError([...(errors.email || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <Input
                name="password"
                iconPosition="left"
                placeholder={placeholder.password.enter}
                type={showPassword ? 'text' : 'password'}
                value={password || ''}
                onChange={handleChange}
                onClick={handleEyeIcon}
              >
                <Lock />
                <input />
                <div
                  className={`right-icon ${disableEye ? 'disabled' : ''}`}
                  onClick={() => togglePassword('newPassword')}
                  onKeyDown={() => togglePassword('newPassword')}
                >
                  {showPassword ? <Eye /> : <StrikedEye />}
                </div>
              </Input>
              {renderFieldError([...(errors.password || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.company.name}
                name="companyName"
                value={companyName || ''}
                minLength="3"
                maxLength="25"
                onChange={handleChange}
                disabled={disableMerchantFields}
              >
                <Building />
                <input />
              </Input>
              {renderFieldError([...(errors.companyName || [])])}
            </Form.Field>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.postcode}
                name="postcode"
                value={postcode || ''}
                minLength="1"
                maxLength="10"
                onChange={handleChange}
                disabled={disableMerchantFields}
              >
                <Postcode />
                <input />
              </Input>
              {renderFieldError([...(errors.postcode || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <div className="ui left icon input textarea">
                <TextArea
                  iconPosition="left"
                  name="primaryCompanyAddress"
                  value={primaryCompanyAddress || ''}
                  onChange={handleChange}
                  placeholder={placeholder.company.primaryAddress}
                  minLength="1"
                  maxLength="60"
                  disabled={disableMerchantFields}
                />
                <Location />
              </div>
              {renderFieldError([...(errors.primaryCompanyAddress || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <div className="ui left icon select">
                <Select
                  placeholder="Select Country"
                  options={countryOptions}
                  name="country"
                  value={country || ''}
                  onChange={handleChange}
                  disabled={disableMerchantFields}
                />
                <Flag />
              </div>
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            <Form.Field>
              <div className="phone-field">
                <div className="ui left icon select">
                  <Select
                    className="phone-code"
                    options={telephoneOptions}
                    name="phoneCode"
                    value={phoneCode || ''}
                    onChange={handleChange}
                    disabled={disableMerchantFields}
                  />
                  <Phone />
                </div>
                <Input
                  iconPosition="left"
                  placeholder={placeholder.company.phone}
                  name="phone"
                  className="phone"
                  value={phone || ''}
                  onChange={handleChange}
                  disabled={disableMerchantFields}
                >
                  <input />
                </Input>
              </div>
              {renderFieldError([...(errors.phone || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field className="file-input-field">
              <Input
                type="file"
                onChange={handleChange}
                disabled={disableMerchantFields}
                iconPosition="left"
                name="entity1"
                className="file"
                accept="image/png,image/jpeg"
              >
                <Doc />
                <input type="file" />
                <span className="fileInputText">
                  {placeholder.uploadProof.one}
                </span>
                <div className="right-icon">
                  <Upload />
                </div>
              </Input>
              {entity1 !== '' && (
                <div
                  className={`filename-wrapper ${
                    disableMerchantFields ? 'merchant-disable-fields' : ''
                  }`}
                >
                  <span className="file-circle">{extEntity1FileName}</span>
                  <div className="name">{entity1FileName} </div>
                  <div
                    className="remove-file-icon"
                    onKeyDown={() => removeFileFromS3('entity1')}
                    onClick={() => removeFileFromS3('entity1')}
                  >
                    <Close />
                  </div>
                </div>
              )}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field className="file-input-field">
              <Input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleChange}
                disabled={disableMerchantFields}
                iconPosition="left"
                name="entity2"
                className="file"
              >
                <Doc />
                <input type="file" />
                <span className="fileInputText">
                  {placeholder.uploadProof.two}
                </span>
                <div className="right-icon">
                  <Upload />
                </div>
              </Input>
              {entity2 !== '' && (
                <div
                  className={`filename-wrapper ${
                    disableMerchantFields ? 'merchant-disable-fields' : ''
                  }`}
                >
                  <span className="file-circle">{extEntity2FileName}</span>
                  <div className="name">{entity2FileName} </div>
                  <div
                    className="remove-file-icon"
                    onKeyDown={() => removeFileFromS3('entity2')}
                    onClick={() => removeFileFromS3('entity2')}
                  >
                    <Close />
                  </div>
                </div>
              )}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <div className="ui left icon input textarea">
                <TextArea
                  iconPosition="left"
                  name="companyDescription"
                  placeholder={placeholder.company.description}
                  value={companyDescription || ''}
                  onChange={handleChange}
                  disabled={disableMerchantFields}
                  maxLength="250"
                />
                <Message />
              </div>
            </Form.Field>
          </Grid.Column>
          <Grid.Column className="drop-zone-column">
            {logo !== '' ? (
              <div
                className={`image-preview ${
                  disableMerchantFields ? 'merchant-disable-fields' : ''
                }`}
              >
                <img
                  onError={(e) => (e.target.src = defaultImage)}
                  src={logo}
                  alt="Profile"
                />
                <div
                  className="remove-image-preview-icon"
                  onKeyDown={() => removeFileFromS3('logo')}
                  onClick={() => removeFileFromS3('logo')}
                >
                  {' '}
                  <Close />{' '}
                </div>
              </div>
            ) : (
              <div
                className={`${
                  disableMerchantFields ? 'merchant-disable-fields' : ''
                }`}
              >
                <DropZone
                  accept=".svg,.jpg,.png,.jpeg"
                  onDrop={(file) => uploadImageOnS3('logo', file)}
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
              <Input
                iconPosition="left"
                placeholder={placeholder.company.branch}
                name="branchNo"
                value={branchNo ?? ''}
                onChange={handleChange}
                disabled={disableMerchantFields}
              >
                <Building />
                <input />
              </Input>
            </Form.Field>
          </Grid.Column>
        </Grid>
        <Grid columns={2} className="company-secondary-address-wrapper">
          {branchNo >= 1 && renderSecondaryAddress(branchNo)}
        </Grid>
        <Grid columns="2" className="form-button-wrapper">
          <Grid.Column>
            <Grid columns="2">
              <Grid.Column>
                <Button
                  disabled={!isFormValid() || !areRequiredFilled()}
                  primary
                  fluid
                  type="submit"
                >
                  {editForm ? 'Update' : 'Create'}
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Link
                  to="/admin/merchant"
                  className="ui fluid secondary button"
                  onClick={() => emptyMerchantDetails()}
                >
                  Cancel
                </Link>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </Form>
    )
  }

  return (
    <div className="create-merchant-page">
      {isLoading && <Loader className="screen-centered" />}
      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1">
            <span>
              <Link to="/admin/merchant" onClick={() => emptyMerchantDetails()}>
                Merchant
              </Link>
            </span>{' '}
            <PagiRightArrow /> {`${editForm ? 'Update' : 'Create'}`} Merchant
          </Header>
          <div className="date">
            <span> {`${dayjs().format('dddd')}`}, </span>{' '}
            {`${dayjs().format('D MMMM YYYY')}`}
          </div>
        </div>
      </div>
      {renderCreateMerchantForm()}
    </div>
  )
}

const mapStateToProps = (state) => ({
  userLoginInfo: state.userLoginInfo,
})

export default connect(mapStateToProps, { ...loginAction })(CreateMerchant)

CreateMerchant.propTypes = {
  countryList: propTypes.func.isRequired,
  emptyMerchantDetails: propTypes.func.isRequired,
  merchantDetails: propTypes.arrayOf(propTypes.array).isRequired,
  userLoginInfo: propTypes.objectOf(propTypes.object).isRequired,
}
