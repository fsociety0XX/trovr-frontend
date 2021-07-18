import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import {
  Grid,
  Button,
  Modal,
  Header,
  Form,
  Checkbox,
  Input,
  Radio,
} from 'semantic-ui-react'
import QRCode from 'react-qr-code'
import propTypes from 'prop-types'
import { useToasts } from 'react-toast-notifications'
import { Link } from 'react-router-dom'
import RoundArrow from '../../../svgs/RoundArrow'
import Redeem from '../../../svgs/Redeem'
import Close from '../../../svgs/Close'
import Price from '../../../svgs/Price'
import Favorite from '../../../svgs/Favorite'
import FavoriteFilled from '../../../svgs/FavoriteFilled'

import Postcode from '../../../svgs/Postcode'
import * as placeholder from '../../../utils/placeholders'
import {
  enableLocation,
  invalidPostcode,
  emptyPostcode,
  redeemError,
} from '../../../utils/messages'
import { onlyAlphaNumericValues } from '../../../utils/constants'
import { renderFieldError } from '../../../utils/helper'
import ConsumerService from '../../../api/services/ConsumerService'
import Loader from '../../../utils/Loader'

// if same advertisement layout will be used in multiple place than we will move this componenet from here and put it in common place
const RewardsList = (props) => {
  const { addToast } = useToasts()
  const {
    columns,
    isFav,
    seemore,
    rewardData,
    saveforLaterReward,
    noOfItems,
    fetchMore,
    applyFilter,
    handleRewardsFilter,
    handleFilterFormData,
    refreshList,
    totalRecords,
    postalCode,
    loading,
    filterObjProps,
    clearFilter,
  } = props

  const [redeemPopup, setRedeemPopup] = React.useState({
    status: false,
    qrCode: '',
  })

  const [confirmQrPopup, setConfirmQrPopup] = React.useState(false)
  const [qrPopup, setQrPopup] = React.useState({ status: false, qrCode: '' })
  const [qrLoading, setQrLoading] = React.useState(false)
  const [rewardList, setRewardList] = React.useState(null)
  const [proximity, setProximity] = useState(!!postalCode)
  const [rewardType, setRewardType] = useState(false)
  const [postcode, setPostcode] = useState(postalCode !== '' ? postalCode : '')
  const [freeRadioBtn, setFreeRadioBtn] = useState(false)
  const [moneyOffRadioBtn, setMoneyOffRadioBtn] = useState(false)
  const [lessThanFiftyPercent, setLessThanFiftyPercent] = useState(false)
  const [moreThanFiftyPercent, setMoreThanFiftyPercent] = useState(false)
  const [soonToExpire, setSoonToExpire] = useState(false)
  const [durationFilter, setDurationFilter] = useState('')
  const [frequentlyUsed, setFrequentlyUsed] = useState(false)
  const [disableFilterFormBtn, setDisableFilterFormBtn] = useState(false)
  const [errors, setErrors] = useState({})

  // Maintain filter status
  useEffect(() => {
    if (filterObjProps !== undefined && !isFav) {
      const {
        frequentlyUsed,
        proximity,
        soonToExpire,
        rewardType,
        postcode,
        expiredWithin,
        type,
      } = filterObjProps

      if (proximity) {
        setProximity(proximity)
        setPostcode(postcode)
      } else {
        setProximity(false)
        setPostcode('')
      }

      if (soonToExpire) {
        setSoonToExpire(soonToExpire)
        setDurationFilter(expiredWithin)
      } else {
        setSoonToExpire(false)
        setDurationFilter('')
      }

      if (frequentlyUsed) {
        setFrequentlyUsed(frequentlyUsed)
      } else {
        setFrequentlyUsed(false)
      }

      if (rewardType) {
        setRewardType(rewardType)
        if (type.includes('free')) {
          setFreeRadioBtn(true)
        }
        if (type.includes('moneyOff')) {
          setMoneyOffRadioBtn(true)
        }
        if (type.includes('percentageOff-50%')) {
          setLessThanFiftyPercent(true)
        }
        if (type.includes('percentageOff-100%')) {
          setMoreThanFiftyPercent(true)
        }
      } else {
        setRewardType(false)
        setFreeRadioBtn(false)
        setMoneyOffRadioBtn(false)
        setLessThanFiftyPercent(false)
        setMoreThanFiftyPercent(false)
      }
      validateField('postcode', postcode)
    } else {
      setProximity(false)
      setPostcode('')
    }
  }, [filterObjProps, isFav])

  const disableFilterButton = () => {
    if (frequentlyUsed) {
      setDisableFilterFormBtn(false)
    } else {
      setDisableFilterFormBtn(true)
    }

    // proximity check
    if (proximity) {
      if (postcode !== '') {
        setDisableFilterFormBtn(false)
      } else setDisableFilterFormBtn(true)
    }

    // reward type check
    if (rewardType) {
      if (
        freeRadioBtn ||
        moneyOffRadioBtn ||
        lessThanFiftyPercent ||
        moreThanFiftyPercent
      ) {
        setDisableFilterFormBtn(false)
      } else setDisableFilterFormBtn(true)
    }

    // duration check
    if (soonToExpire) {
      if (durationFilter !== '') {
        setDisableFilterFormBtn(false)
      } else {
        setDisableFilterFormBtn(true)
      }
    }
  }

  useEffect(() => {
    disableFilterButton()
  }, [
    proximity,
    soonToExpire,
    rewardType,
    postcode,
    freeRadioBtn,
    moneyOffRadioBtn,
    lessThanFiftyPercent,
    moreThanFiftyPercent,
    durationFilter,
    frequentlyUsed,
  ])

  useEffect(() => {
    if (noOfItems > -1) {
      if (rewardData !== null && rewardData !== undefined) {
        let iteration = rewardData.length
        if (rewardData.length > noOfItems) {
          iteration = noOfItems
        }
        const items = []
        for (let i = 0; i < iteration; i += 1) {
          items.push(rewardData[i])
        }
        setRewardList(items)
      }
    } else {
      setRewardList(rewardData)
    }
  }, [rewardData, noOfItems])

  const clearRewardFilterForm = () => {
    setErrors({})
    setDisableFilterFormBtn(false)
    setFrequentlyUsed(false)
    setDurationFilter(false)
    setSoonToExpire(false)
    setMoreThanFiftyPercent(false)
    setLessThanFiftyPercent(false)
    setMoneyOffRadioBtn(false)
    setFreeRadioBtn(false)
    setPostcode('')
    setRewardType(false)
    setProximity(false)
    handleFilterFormData('')
    handleRewardsFilter(false)
  }

  const clearAndApplyFilter = () => {
    clearRewardFilterForm()
    // refreshList()
    clearFilter()
  }

  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    if (name === 'postcode') {
      if (value === '') {
        error.postcode = [emptyPostcode]
      } else if (!onlyAlphaNumericValues.test(value)) {
        error.postcode = [invalidPostcode]
      }
    }
    setErrors(error)
  }

  const handleChange = (e, { name, value }) => {
    name === 'proximity' && setProximity(!proximity)
    name === 'postcode' && setPostcode(value)
    name === 'rewardType' && setRewardType(!rewardType)
    name === 'freeRadioBtn' && setFreeRadioBtn(!freeRadioBtn)
    name === 'moneyOffRadioBtn' && setMoneyOffRadioBtn(!moneyOffRadioBtn)
    name === 'lessThanFiftyPercent' &&
      setLessThanFiftyPercent(!lessThanFiftyPercent)
    name === 'moreThanFiftyPercent' &&
      setMoreThanFiftyPercent(!moreThanFiftyPercent)
    name === 'soonToExpire' && setSoonToExpire(!soonToExpire)
    if (
      name === 'yearFilter' ||
      name === 'monthFilter' ||
      name === 'weekFilter'
    ) {
      setDurationFilter(value)
    }
    name === 'frequentlyUsed' && setFrequentlyUsed(!frequentlyUsed)
    validateField(name, value)
  }

  const handleFilterRewardsForm = () => {
    const obj = { frequentlyUsed }
    const filterObj = { frequentlyUsed }
    const free = freeRadioBtn ? 'free' : ''
    const moneyOff = moneyOffRadioBtn ? 'moneyOff' : ''
    const lessThanFifty = lessThanFiftyPercent ? 'percentageOff-50%' : ''
    const moreThanFifty = moreThanFiftyPercent ? 'percentageOff-100%' : ''
    const moneyDiscount = [free, moneyOff, lessThanFifty, moreThanFifty]
    const moneyDiscountArray = moneyDiscount.filter((d) => d !== '')
    if (proximity && postcode !== '') {
      Object.assign(obj, { postcode })
      Object.assign(filterObj, { proximity, postcode })
    }
    if (soonToExpire && durationFilter !== '') {
      Object.assign(obj, { expiredWithin: durationFilter })
      Object.assign(filterObj, { soonToExpire, expiredWithin: durationFilter })
    }
    if (rewardType && moneyDiscountArray.length) {
      Object.assign(obj, { type: moneyDiscountArray })
      Object.assign(filterObj, { rewardType, type: moneyDiscountArray })
    }
    handleFilterFormData(obj, filterObj)
    handleRewardsFilter(false)
  }

  const storeReward = (id) => {
    saveforLaterReward(id)
  }

  const redeem = async (status, qrCode) => {
    if (postalCode) {
      setRedeemPopup({ status, qrCode })
    } else {
      addToast(enableLocation, { appearance: 'error' })
    }
  }

  const qr = (status, qrCode) => {
    redeemVoucherByConsumer(status, qrCode)
    setQrPopup({ status, qrCode })
    redeem(false, qrCode)
  }

  const confirmQr = (status, confirmed) => {
    setConfirmQrPopup(status)
    if (confirmed) {
      setQrPopup({ status: false, qrCode: '' })
      setConfirmQrPopup(false)
    }
  }

  const redeemVoucherByConsumer = async (status, qrCode) => {
    if (status) {
      try {
        const data = {
          qrCode,
          postcode: postalCode,
        }
        setQrLoading(true)
        const response = await ConsumerService.redeemVoucherByConsumer(data)
        if (Object.keys(response).length === 0) {
          setQrLoading(false)
          refreshList(1, isFav, postalCode, false) // page ,isfav, postcode, fetchMore
        }
        if (response.length) {
          addToast(response[0].message, { appearance: 'error' })
          qr(false, '')
        }
      } catch (err) {
        console.warn('Reward List(redeem):', err)
        addToast(redeemError, { appearance: 'error' })
        qr(false, '')
      }
    }
  }

  const filter = (status) => {
    handleRewardsFilter(status)
  }

  const cancelFilter = () => {
    setProximity(filterObjProps.proximity)
    setFrequentlyUsed(filterObjProps.frequentlyUsed)
    setDurationFilter(filterObjProps.durationFilter)
    setSoonToExpire(filterObjProps.soonToExpire)
    setMoreThanFiftyPercent(filterObjProps.moreThanFiftyPercent)
    setLessThanFiftyPercent(filterObjProps.lessThanFiftyPercent)
    setMoneyOffRadioBtn(filterObjProps.moneyOffRadioBtn)
    setFreeRadioBtn(filterObjProps.freeRadioBtn)
    setPostcode(filterObjProps.postcode)
    setRewardType(filterObjProps.rewardType)
    handleRewardsFilter(false)
  }

  return (
    <>
      <div className="reward-list">
        {rewardList !== null ? (
          rewardList?.length > 0 ? (
            <>
              <Grid columns={columns}>
                {rewardList.map((item) => {
                  const {
                    id,
                    type,
                    name,
                    expiredAt,
                    pointExchangeValue,
                    qrCode,
                    image,
                    isRedeem,
                    value,
                  } = item
                  const finalQrCode = `${qrCode}`
                  let voucherType = ''
                  if (type === 'free') {
                    voucherType = 'Free'
                  } else if (type === 'moneyOff') {
                    voucherType = '1€ Off'
                  } else if (type === 'percentageOff') {
                    voucherType = `${value}% Off`
                  }
                  return (
                    <Grid.Column key={Math.random()}>
                      <div
                        className={`reward-card ${isRedeem && 'redeemed-card'}`}
                      >
                        <div className="image">
                          {image ? (
                            <img src={image} alt="reward" />
                          ) : (
                            <div className="caption">TrovR Reward</div>
                          )}
                          <div className="type">{voucherType}</div>
                        </div>
                        <div className="title-wrapper">
                          <Header as="h2">{name}</Header>
                          <div className="data-price-wrapper">
                            <div className="date">
                              Valid till: <strong>{expiredAt}</strong>
                            </div>
                            <div className="price">
                              <Price />
                              {pointExchangeValue}
                            </div>
                          </div>
                        </div>
                        <div className="button-wrapper">
                          {isRedeem ? (
                            <div className="ui button redeemed">Redeemed</div>
                          ) : (
                            <>
                              <Button
                                onClick={() => storeReward(id)}
                                className="save-for-later"
                              >
                                {!isFav ? (
                                  <>
                                    <Favorite /> Save for later
                                  </>
                                ) : (
                                  <>
                                    <FavoriteFilled /> Unsave
                                  </>
                                )}
                              </Button>

                              <Button
                                onClick={() => redeem(true, finalQrCode)}
                                className="redeem-now"
                              >
                                <Redeem />
                                Redeem now
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </Grid.Column>
                  )
                })}
              </Grid>
              <div className="read-more-btn-wrapper">
                {seemore && totalRecords > 2 ? (
                  <Link className="ui button" to={seemore}>
                    Show more
                    <RoundArrow />
                  </Link>
                ) : (
                  totalRecords > rewardList.length && (
                    <Button onClick={() => fetchMore()}>
                      Show more
                      <RoundArrow />
                    </Button>
                  )
                )}
              </div>
            </>
          ) : (
            <>
              {!loading ? (
                <div className="rewards-no-data">No data found</div>
              ) : (
                ''
              )}
            </>
          )
        ) : (
          ''
        )}
      </div>

      <Modal
        open={redeemPopup.status}
        onClose={() => redeem(false)}
        onOpen={() => redeem(true)}
        className="redeem-popup"
      >
        <Modal.Content>
          <div className="popupDeleteIcon">
            <Redeem />
          </div>
          <Header as="h2">Are you sure you want to redeem the voucher?</Header>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={() => qr(true, redeemPopup.qrCode)}>
            Redeem now
          </Button>
          <Button secondary onClick={() => redeem(false)}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal
        open={qrPopup.status}
        onClose={() => qr(false)}
        onOpen={() => qr(true)}
        className="qr-popup"
        closeOnDimmerClick={false}
      >
        <Modal.Content>
          {!confirmQrPopup && (
            <Button
              className="close-btn"
              onClick={() => confirmQr(true, false)}
            >
              <Close />
            </Button>
          )}
          <div className="popupDeleteIcon">
            <Redeem />
          </div>

          {confirmQrPopup ? (
            <>
              <Header as="h2">Please Confirm</Header>
              <p>
                If merchant has not scanned the QR code,
                <br />
                you will lose the benefits to redeem the voucher.
                <br />
                Are you sure you want to close?
              </p>
            </>
          ) : qrLoading ? (
            <Loader className="section-centered" />
          ) : (
            <div className="qr-code-wrapper">
              <QRCode className="qr-svg" value={qrPopup.qrCode} />
            </div>
          )}
        </Modal.Content>
        {confirmQrPopup && (
          <Modal.Actions>
            <Button primary onClick={() => confirmQr(true, true)}>
              Yes
            </Button>
            <Button secondary onClick={() => confirmQr(false, false)}>
              No
            </Button>
          </Modal.Actions>
        )}
      </Modal>

      <Modal
        open={applyFilter}
        onClose={() => filter(false)}
        onOpen={() => filter(true)}
        className="reward-filter-popup"
      >
        <Modal.Header className="a-center">Filter Vouchers by</Modal.Header>
        <Modal.Content>
          <Grid columns={2}>
            <Grid.Column>
              <Form.Field className="checbox-field">
                <Checkbox
                  label="Proximity"
                  name="proximity"
                  checked={proximity}
                  onChange={handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  iconPosition="left"
                  placeholder={placeholder.postcode}
                  name="postcode"
                  value={postcode}
                  onChange={handleChange}
                  minLength="1"
                  maxLength="10"
                >
                  <Postcode />
                  <input />
                </Input>
                {proximity
                  ? renderFieldError([...(errors.postcode || [])])
                  : ''}
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field className="checbox-field">
                <Checkbox
                  name="rewardType"
                  label="Type"
                  checked={rewardType}
                  onChange={handleChange}
                />
              </Form.Field>
              <Form.Field className="radio-buttons-wrapper">
                <Checkbox
                  name="freeRadioBtn"
                  className="rewards-radio-button"
                  label="Free"
                  checked={freeRadioBtn}
                  onChange={handleChange}
                />

                <Checkbox
                  className="rewards-radio-button"
                  name="moneyOffRadioBtn"
                  label="Money off"
                  onChange={handleChange}
                  checked={moneyOffRadioBtn}
                />

                <Checkbox
                  className="rewards-radio-button"
                  name="lessThanFiftyPercent"
                  label="0%-50% off"
                  onChange={handleChange}
                  checked={lessThanFiftyPercent}
                />

                <Checkbox
                  className="rewards-radio-button"
                  name="moreThanFiftyPercent"
                  label="50%-100% off"
                  onChange={handleChange}
                  checked={moreThanFiftyPercent}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field className="checbox-field">
                <Checkbox
                  name="soonToExpire"
                  label="Soon to expire"
                  checked={soonToExpire}
                  onChange={handleChange}
                />
              </Form.Field>
              <Form.Field className="radio-buttons-wrapper">
                <Radio
                  name="weekFilter"
                  className="rewards-radio-button"
                  label="Week"
                  value="week"
                  checked={durationFilter === 'week'}
                  onChange={handleChange}
                />

                <Radio
                  className="rewards-radio-button"
                  name="monthFilter"
                  label="Month"
                  value="month"
                  checked={durationFilter === 'month'}
                  onChange={handleChange}
                />

                <Radio
                  className="rewards-radio-button"
                  name="yearFilter"
                  label="Year"
                  value="year"
                  checked={durationFilter === 'year'}
                  onChange={handleChange}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <Checkbox
                  name="frequentlyUsed"
                  label="Frequently used"
                  checked={frequentlyUsed}
                  onChange={handleChange}
                />
              </Form.Field>
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={handleFilterRewardsForm}
            disabled={disableFilterFormBtn}
            primary
          >
            Show Results
          </Button>
          <Button onClick={clearAndApplyFilter} basic>
            Clear & Apply filters
          </Button>
          <Button secondary onClick={() => cancelFilter()}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}
export default RewardsList

RewardsList.propTypes = {
  rewardData: propTypes.objectOf(propTypes.object).isRequired,
  columns: propTypes.number.isRequired,
  noOfItems: propTypes.number.isRequired,
  seemore: propTypes.string.isRequired,
  loading: propTypes.bool.isRequired,
  saveforLaterReward: propTypes.func.isRequired,
  fetchMore: propTypes.func.isRequired,
  isFav: propTypes.bool.isRequired,
  handleFilterFormData: propTypes.func.isRequired,
  handleRewardsFilter: propTypes.func.isRequired,
  applyFilter: propTypes.bool.isRequired,
  totalRecords: propTypes.number.isRequired,
  refreshList: propTypes.func.isRequired,
  postalCode: propTypes.string.isRequired,
  clearFilter: propTypes.string.isRequired,
  filterObjProps: propTypes.objectOf(propTypes.object).isRequired,
}
