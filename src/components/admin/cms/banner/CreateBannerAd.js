import React, { useState, useEffect } from 'react'
import { Header, Button, Form, Input, Grid, Dropdown } from 'semantic-ui-react'
import propTypes from 'prop-types'
import DropZone from 'react-drop-zone'
import _ from 'lodash'
import { Link, useHistory } from 'react-router-dom'
import dayjs from 'dayjs'
import { useToasts } from 'react-toast-notifications'
import S3FileUpload from 'react-s3'
import PagiRightArrow from '../../../../svgs/PagiRightArrow'
import Close from '../../../../svgs/Close'
import Upload from '../../../../svgs/Upload'
import PieChart from '../../../../svgs/PieChart'
import LinkIcon from '../../../../svgs/Link'
import Doc from '../../../../svgs/Doc'
import Like from '../../../../svgs/Like'
import Ad from '../../../../svgs/Ad'

import {
  AWS_CONFIG,
  urlRegex,
  numberRegx,
  onlyAlphaNumericValues,
} from '../../../../utils/constants'
import {
  bannerAdImageSizeLimit,
  notValidImage,
  invalidSegment,
  emptyAdvertiseImpression,
  invalidAdvertiseImpression,
  MinLength,
  emptyAdvertiseMetaData,
  emptyAdvertisementName,
  invalidAdvertiseMetadata,
  invalidAdvertiseUrl,
  createBannerSuccess,
  updateBannerSuccess,
} from '../../../../utils/messages'
import * as placeholder from '../../../../utils/placeholders'
import * as url from '../../../../utils/urls'
import Loader from '../../../../utils/Loader'
import CMSService from '../../../../api/services/CMSService'
import { renderFieldError } from '../../../../utils/helper'

const CreateBannerAd = (props) => {
  const { segmentDetail, adDetails, emptyBannerDetails } = props
  const history = useHistory()
  const { addToast } = useToasts()
  const [errors, setErrors] = useState({})
  const [advertisementName, setAdverisementName] = useState('')
  const [advertiseMetadata, setAdvertiseMetadata] = useState('')
  const [advertiseUrl, setAdvertiseUrl] = useState('')
  const [advertiseImpression, setAdvertiseImpression] = useState('')
  const [segmentArray, setSegmentArray] = useState(null)
  const [webImage, setWebImage] = useState('')
  const [mobileImage, setMobileImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editForm, setEditForm] = useState(false)
  const [bannerAdId, setBannerAdId] = useState('')

  const segmentOptions = segmentDetail.map((segmentData) => ({
    text: segmentData.name,
    value: segmentData.id,
    key: segmentData.id,
  }))
  useEffect(() => {
    if (Object.keys(adDetails).length) {
      const {
        id,
        impression,
        mobileImage,
        webImage,
        name,
        segments,
        url,
        metaData,
      } = adDetails
      setEditForm(true)
      setBannerAdId(id)
      setWebImage(webImage)
      setMobileImage(mobileImage)
      setAdverisementName(name)
      setAdvertiseImpression(impression)
      setAdvertiseUrl(url)
      setAdvertiseMetadata(metaData)
      const segmentSelectedArray = []
      segments.forEach((data) => {
        segmentSelectedArray.push(data.id)
      })
      segmentSelectedArray.length > 0 && setSegmentArray(segmentSelectedArray)
    }
  }, [adDetails])
  const uploadImageOnS3 = async (file, from) => {
    if (!file.type.includes('image')) {
      addToast(notValidImage, { appearance: 'error' })
      return
    }
    const size = file.size / 1000 / 1000
    if (size > 5) {
      addToast(bannerAdImageSizeLimit, { appearance: 'error' })
      return
    }
    setIsLoading(true)
    try {
      const data = await S3FileUpload.uploadFile(file, AWS_CONFIG)
      if (from === 'web') setWebImage(data.location)
      else setMobileImage(data.location)
      setIsLoading(false)
    } catch (err) {
      console.warn('Create Merchant(uploadImageOnS3):', err)
      setIsLoading(false)
    }
  }

  const removeFileFromS3 = async (from) => {
    let fileName = ''
    if (from === 'web') {
      fileName = webImage.split('/').pop()
    } else {
      fileName = mobileImage.split('/').pop()
    }
    S3FileUpload.deleteFile(fileName, AWS_CONFIG)
      .then((response) => {
        console.warn(response, 'remove from s3')
      })
      .catch((err) => console.warn(err))

    if (from === 'web') setWebImage('')
    else setMobileImage('')
  }

  const switchText = (over, overDocument) => {
    const Text = (
      <div>
        {placeholder.advertise.deskImage}
        <div className="upload-size">
          Upload image having similar width and height of 770 X 160
        </div>
      </div>
    )
    if (over) return 'file is over element'
    else if (overDocument) return 'file is over document'
    else return Text
  }

  const switchMobText = (over, overDocument) => {
    const Text = (
      <div>
        {placeholder.advertise.mobImage}
        <div className="upload-size">
          Upload image having similar width and height of 414 X 180
        </div>
      </div>
    )
    if (over) return 'file is over element'
    else if (overDocument) return 'file is over document'
    else return Text
  }
  const createBannerFormSubmit = async (data) => {
    try {
      setIsLoading(true)
      const response = await CMSService.createBannerAd(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(createBannerSuccess, { appearance: 'success' })
        emptyBannerDetails()
        history.push('/admin/cms/banner')
      }
      setIsLoading(false)
    } catch (error) {
      console.warn('Create banner(createbannerOnSubmit):', error)
      setIsLoading(false)
    }
  }
  const editBannerFormSubmit = async (data) => {
    try {
      setIsLoading(true)
      const queryParam = `/${bannerAdId}`

      const response = await CMSService.updateBannerAd(data, queryParam)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(updateBannerSuccess, { appearance: 'success' })
        emptyBannerDetails()
        history.push('/admin/cms/banner')
      }
      setIsLoading(false)
    } catch (error) {
      console.warn('Update banner(updaatebannerOnSubmit):', error)
      setIsLoading(false)
    }
  }
  const handleFormData = () => {
    const obj = {
      name: advertisementName.trim(),
      impression: advertiseImpression.trim(),
      metaData: advertiseMetadata.trim(),
      segmentIds: segmentArray,
      webImage,
      mobileImage,
    }
    if (advertiseUrl !== '' && advertiseUrl) {
      let url = advertiseUrl.trim()
      if (!/^https?:\/\//i.test(url)) {
        url = `http://${url}`
      }
      obj.url = url
    }
    if (editForm) {
      editBannerFormSubmit(obj)
    } else {
      createBannerFormSubmit(obj)
    }
  }

  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    if (name === 'advertisementName') {
      if (value === '') {
        error.advertisementName = [emptyAdvertisementName]
      } else if (value.length < 3) {
        error.advertisementName = [MinLength]
      }
    }
    if (name === 'advertiseUrl') {
      if (value !== '' && !urlRegex.test(value)) {
        error.advertiseUrl = [invalidAdvertiseUrl]
      }
    }
    if (name === 'advertiseMetadata') {
      if (value === '') {
        error.advertiseMetadata = [emptyAdvertiseMetaData]
      } else if (!onlyAlphaNumericValues.test(value)) {
        error.advertiseMetadata = [invalidAdvertiseMetadata]
      } else if (value.length < 3) {
        error.advertiseMetadata = [MinLength]
      }
    }
    if (name === 'advertiseImpression') {
      if (value === '') {
        error.advertiseImpression = [emptyAdvertiseImpression]
      } else if (!numberRegx.test(value)) {
        error.advertiseImpression = [invalidAdvertiseImpression]
      }
    }
    if (name === 'segmentArray') {
      if (value.length === 0) {
        error.segmentArray = [invalidSegment]
      }
    }
    setErrors(error)
  }
  const isFormValid = () => !Object.keys(errors).length

  const areRequiredFilled = () => {
    const requiredFields = [
      'advertisementName',
      'advertiseMetadata',
      'advertiseImpression',
      'segmentArray',
      'webImage',
      'mobileImage',
    ]
    return requiredFields.find((i) => !eval(i)) === undefined
  }
  const handleChange = (e, { name, value }) => {
    name === 'advertisementName' && setAdverisementName(value)

    name === 'advertiseMetadata' && setAdvertiseMetadata(value)

    name === 'segmentArray' && setSegmentArray(value)

    name === 'advertiseImpression' && setAdvertiseImpression(value)
    name === 'advertiseUrl' && setAdvertiseUrl(value)

    validateField(name, value)
  }
  return (
    <div className="create-banner-page">
      {isLoading && <Loader className="screen-centered" />}

      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1" className="breadcrumb-wrapper">
            <span>
              <Link to={url.banner} onClick={() => emptyBannerDetails()}>
                Banner Ad
              </Link>
            </span>{' '}
            <PagiRightArrow /> {`${editForm ? 'Update' : 'Create'}`} Banner
            Advertisement
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
                placeholder={placeholder.advertise.name}
                name="advertisementName"
                value={advertisementName}
                onChange={handleChange}
                maxLength="50"
              >
                <Ad />
                <input />
              </Input>
              {renderFieldError([...(errors.advertisementName || [])])}
            </Form.Field>

            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.impression}
                name="advertiseImpression"
                onChange={handleChange}
                value={advertiseImpression}
                maxLength={7}
              >
                <Like />
                <input />
              </Input>
              {renderFieldError([...(errors.advertiseImpression || [])])}
            </Form.Field>

            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.metadata}
                name="advertiseMetadata"
                value={advertiseMetadata}
                onChange={handleChange}
                maxLength="50"
              >
                <Doc />
                <input />
              </Input>
              {renderFieldError([...(errors.advertiseMetadata || [])])}
            </Form.Field>

            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.advertise.url}
                name="advertiseUrl"
                onChange={handleChange}
                value={advertiseUrl}
              >
                <LinkIcon />
                <input />
              </Input>
              {renderFieldError([...(errors.advertiseUrl || [])])}
            </Form.Field>

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

          {/* <Grid.Column>
            <Form.Field>
              <div className="ui left icon select">
                <Flag />
                <Select
                  placeholder={placeholder.location}
                  options={userLevelOptions}
                  name="advertiseLocation"
                />
              </div>
            </Form.Field>
          </Grid.Column> */}

          <Grid.Column className="drop-zone-column">
            <Form.Field>
              {webImage !== '' ? (
                <div className="image-preview">
                  <img src={webImage} alt="Profile" />
                  <div
                    className="remove-image-preview-icon"
                    onKeyDown={() => removeFileFromS3('web')}
                    onClick={() => removeFileFromS3('web')}
                  >
                    {' '}
                    <Close />{' '}
                  </div>
                </div>
              ) : (
                <div>
                  <DropZone
                    accept=".svg,.jpg,.png"
                    onDrop={(file) => uploadImageOnS3(file, 'web')}
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
            </Form.Field>

            <Form.Field>
              {mobileImage !== '' ? (
                <div className="image-preview">
                  <img src={mobileImage} alt="Profile" />
                  <div
                    className="remove-image-preview-icon"
                    onKeyDown={() => removeFileFromS3('mobile')}
                    onClick={() => removeFileFromS3('mobile')}
                  >
                    {' '}
                    <Close />{' '}
                  </div>
                </div>
              ) : (
                <div>
                  <DropZone
                    accept=".svg,.jpg,.png"
                    onDrop={(file) => uploadImageOnS3(file, 'mobile')}
                  >
                    {({ over, overDocument }) => (
                      <div className="drop-zone">
                        <div className="upload-icon">
                          <Upload />
                        </div>
                        <div className="file-size-text">
                          {switchMobText(over, overDocument)}
                        </div>
                      </div>
                    )}
                  </DropZone>
                </div>
              )}
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
                  {`${editForm ? 'Update' : 'Create'}`}
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Link
                  to="/admin/cms/banner"
                  className="ui fluid secondary button"
                  onClick={() => emptyBannerDetails()}
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

export default CreateBannerAd
CreateBannerAd.propTypes = {
  segmentDetail: propTypes.objectOf(propTypes.object).isRequired,
  adDetails: propTypes.objectOf(propTypes.object).isRequired,
  emptyBannerDetails: propTypes.func.isRequired,
}
