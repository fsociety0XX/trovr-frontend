import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import {
  Header,
  Table,
  Form,
  Button,
  Dropdown,
  Modal,
  Grid,
  Checkbox,
  Input,
  Message,
} from 'semantic-ui-react'
import propTypes from 'prop-types'
import dayjs from 'dayjs'
import { DatesRangeInput } from 'semantic-ui-calendar-react'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
// import propTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useToasts } from 'react-toast-notifications'
import Search from '../../../svgs/Search'
import CustomPagination from '../../../utils/customPagination'
import ArrowRight from '../../../svgs/ArrowRight'
import {
  withToast,
  renderFieldError,
  formatDataForXLSandCSV,
  downloadCsvFiles,
  handleSearchOnKeyPress,
} from '../../../utils/helper'
import Calendar from '../../../svgs/Calendar'
import Download from '../../../svgs/Download'
import Postcode from '../../../svgs/Postcode'
import * as placeholder from '../../../utils/placeholders'
import Merchant from '../../../svgs/Merchant'
import SearchFilter from '../../../svgs/SearchFilter'
import PieChart from '../../../svgs/PieChart'
import Loader from '../../../utils/Loader'
import {
  noVoucherReedemptiomDataFound,
  invalidPostcode,
  emptyPostcode,
  validDate,
} from '../../../utils/messages'

import { onlyAlphaNumericValues } from '../../../utils/constants'

const VoucherRedemptionReport = (props) => {
  const {
    fetchVoucherReedemption,
    totalPages,
    voucherReedemptionDownloadDetails,
    orgDetails,
    segmentList,
    loading,
    voucherReedemptionDetails,
    fetchAllVoucherReedemption,
  } = props
  const { addToast } = useToasts()
  const curr = new Date()
  const first = curr.getDate() - 6
  const firstday = new Date(curr.setDate(first))
  const pastYearDate = new Date()
  const pastYear = pastYearDate.getFullYear() - 1
  pastYearDate.setFullYear(pastYear)
  const [errors, setErrors] = useState({})
  const [proximity, setProximity] = useState(false)
  const [postcode, setPostcode] = useState('')
  const [checkMerchant, setCheckMerchant] = useState(false)
  const [voucherType, setVoucherType] = useState(false)
  const [checkSegment, setCheckSegemnt] = useState(false)
  const [freeRadioBtn, setFreeRadioBtn] = useState(false)
  const [disableFilterFormBtn, setDisableFilterFormBtn] = useState(true)
  const [moneyOffRadioBtn, setMoneyOffRadioBtn] = useState(false)
  const [lessThanFiftyPercent, setLessThanFiftyPercent] = useState(false)
  const [moreThanFiftyPercent, setMoreThanFiftyPercent] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [filterFlag, setFilterFlag] = useState(false)
  const [startDate, setStartDate] = useState(
    dayjs(firstday).format('YYYY-MM-DD')
  )
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [merchant, setMerchant] = useState(null)
  const [segment, setSegment] = useState(null)
  const [filterPopup, setFilterPopup] = useState(false)
  const [date, setDate] = useState(
    `${dayjs(firstday).format('YYYY-MM-DD')} - ${dayjs().format('YYYY-MM-DD')}`
  )
  const [voucherReedemDownloadData, setVoucherReedemDownloadData] = useState([])
  const [refreshList, setRefreshList] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filter, setFilter] = useState(true)
  const handlePagination = (currentPage, limit = 15) => {
    setCurrentPage(currentPage)
    setLimit(limit)
  }
  const noResults = () => (
    <Message info content={noVoucherReedemptiomDataFound} />
  )

  const segmentOptions = segmentList.map((segment) => ({
    text: segment.name,
    value: segment.id,
    key: segment.id,
  }))

  const orgOptions = orgDetails.map((org) => ({
    text: org.name,
    value: org.id,
    key: org.id,
  }))
  const columns = [
    {
      Header: 'Voucher Name',
      id: 'voucherName',
    },
    {
      Header: 'QR code value/details',
      id: 'voucherQRCode',
    },
    {
      Header: 'Timestamp',
      id: 'reedemAt',
    },
    {
      Header: 'Email',
      id: 'email',
    },
    {
      Header: 'User',
      id: 'consumerName',
    },
    {
      Header: 'Segment',
      id: 'segment',
    },
    {
      Header: 'Type',
      id: 'voucherType',
    },
    {
      Header: 'Merchant',
      id: 'voucherMerchant',
    },
  ]
  const downloadFileOptions = [
    { key: 'csv', value: 'csv', text: 'CSV' },
    { key: 'pdf', value: 'pdf', text: 'PDF' },
  ]

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

  const clearAndApplyFilter = () => {
    setErrors({})
    setDisableFilterFormBtn(false)
    setCheckMerchant(false)
    setCheckSegemnt(false)
    setSegment('')
    setMerchant('')
    setMoreThanFiftyPercent(false)
    setLessThanFiftyPercent(false)
    setMoneyOffRadioBtn(false)
    setFreeRadioBtn(false)
    setPostcode('')
    setVoucherType(false)
    setProximity(false)
    setRefreshList(!refreshList)
    handleFilter(false)
    setFilterFlag(false)
    setCurrentPage(1)
  }

  const handleFilterVouchersForm = (page) => {
    setCurrentPage(page)
    const obj = {}
    const filterObj = {}
    const free = freeRadioBtn ? 'free' : ''
    const moneyOff = moneyOffRadioBtn ? 'moneyOff' : ''
    const lessThanFifty = lessThanFiftyPercent ? 'percentageOff-50%' : ''
    const moreThanFifty = moreThanFiftyPercent ? 'percentageOff-100%' : ''
    const moneyDiscount = [free, moneyOff, lessThanFifty, moreThanFifty]
    const moneyDiscountArray = moneyDiscount.filter((d) => d !== '')
    setFilterFlag(true)
    if (proximity && postcode !== '') {
      Object.assign(obj, { postcode })
      Object.assign(filterObj, { proximity, postcode })
    }
    if (checkSegment && segment !== '') {
      Object.assign(obj, { segmentIds: segment })
      Object.assign(filterObj, { checkSegment, segmentIds: segment })
    }
    if (checkMerchant && merchant !== '') {
      Object.assign(obj, { organisationIds: merchant })
      Object.assign(filterObj, { checkMerchant, organisationIds: merchant })
    }
    if (voucherType && moneyDiscountArray.length) {
      Object.assign(obj, { type: moneyDiscountArray })
      Object.assign(filterObj, { voucherType, type: moneyDiscountArray })
    }
    const data = {
      page,
      limit,
      from: startDate,
      to: endDate,
    }
    if (sortBy !== '') {
      data.orderBy = `${sortBy}:${sortOrder}`
    }
    const params = { ...data, ...obj }
    fetchVoucherReedemption(params)
    fetchAllVoucherReedemption(params)
    handleFilter(false)
  }
  const handleChange = (event, { name, value }) => {
    if (name === 'datesRange') {
      const dateValue = value.split(' - ')
      if (
        dateValue[0] !== '' &&
        dateValue[0] < dayjs(pastYearDate).format('YYYY-MM-DD')
      ) {
        addToast(validDate, { appearance: 'error' })
      } else {
        setDate(value)

        setStartDate(dateValue[0])
        setEndDate(dateValue[1])
      }
    }
    name === 'proximity' && setProximity(!proximity)
    name === 'postcode' && setPostcode(value)
    name === 'voucherType' && setVoucherType(!voucherType)
    name === 'freeRadioBtn' && setFreeRadioBtn(!freeRadioBtn)
    name === 'moneyOffRadioBtn' && setMoneyOffRadioBtn(!moneyOffRadioBtn)
    name === 'lessThanFiftyPercent' &&
      setLessThanFiftyPercent(!lessThanFiftyPercent)
    name === 'moreThanFiftyPercent' &&
      setMoreThanFiftyPercent(!moreThanFiftyPercent)
    name === 'merchant' && setMerchant(value)
    name === 'segment' && setSegment(value)
    name === 'checkSegment' && setCheckSegemnt(!checkSegment)
    name === 'checkMerchant' && setCheckMerchant(!checkMerchant)
    validateField(name, value)
  }
  const disableFilterButton = () => {
    // proximity check
    if (proximity) {
      if (postcode !== '') {
        setDisableFilterFormBtn(false)
      } else setDisableFilterFormBtn(true)
    } else {
      setDisableFilterFormBtn(true)
    }

    // reward type check
    if (voucherType) {
      if (
        freeRadioBtn ||
        moneyOffRadioBtn ||
        lessThanFiftyPercent ||
        moreThanFiftyPercent
      ) {
        setDisableFilterFormBtn(false)
      } else setDisableFilterFormBtn(true)
    }

    // merchant check
    if (checkMerchant) {
      if (merchant && merchant.length > 0) {
        setDisableFilterFormBtn(false)
      } else {
        setDisableFilterFormBtn(true)
      }
    }
    // merchant check
    if (checkSegment) {
      if (segment && segment.length > 0) {
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
    checkSegment,
    voucherType,
    postcode,
    checkMerchant,
    freeRadioBtn,
    segment,
    merchant,
    moneyOffRadioBtn,
    lessThanFiftyPercent,
    moreThanFiftyPercent,
  ])
  const handleSort = (value) => {
    setCurrentPage(1)
    if (value === sortBy) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC')
      } else {
        setSortOrder('ASC')
      }
    } else {
      setSortBy(value)
      setSortOrder('ASC')
    }
  }
  const handleFilter = (status) => {
    setFilterPopup(status)
  }
  const handleDateClick = () => {
    setFilter(!filter)
  }

  const fetchVoucherReedemptionData = (obj) => {
    fetchVoucherReedemption(obj)
    fetchAllVoucherReedemption(obj)
  }

  useEffect(() => {
    const obj = {
      page: currentPage,
      limit,
      from: startDate,
      to: endDate,
    }
    searchValue && Object.assign(obj, { search: searchValue })
    if (sortBy !== '') {
      obj.orderBy = `${sortBy}:${sortOrder}`
    }

    if (searchValue) {
      fetchVoucherReedemptionData(obj)
    } else if (!filterFlag) {
      fetchVoucherReedemption(obj)
      fetchAllVoucherReedemption(obj)
    } else handleFilterVouchersForm(currentPage)
  }, [currentPage, limit, filter, sortOrder, sortBy, refreshList, searchValue])

  useEffect(() => {
    const voucherReedemptionArray = []
    voucherReedemptionDownloadDetails?.forEach((data) => {
      const array = [
        data.voucher.name,
        data.voucher.qrCode,
        dayjs(new Date(`${data.redeemAt} UTC`)).format('DD/MM/YY - hh:mm A'),
        data.email,
        data.consumerName,
        data.segment.join(),
        data.voucher.type,
        data.voucher?.organisation?.name,
      ]
      voucherReedemptionArray.push(array)
    })
    setVoucherReedemDownloadData(voucherReedemptionArray)
  }, [voucherReedemptionDownloadDetails])

  useEffect(() => {
    window.addEventListener('keydown', handleSearchOnKeyPress)
    return () => window.removeEventListener('keydown', handleSearchOnKeyPress)
  }, [])

  const handleSearch = (e) => {
    setCurrentPage(1)
    setSearchValue(e.target.value)
  }

  const handleDownloadClick = (event, { value }) => {
    if (value === 'pdf') {
      const Doc = new JsPDF('landscape')

      Doc.autoTable({
        head: [
          [
            'Voucher Name',
            'QR Code Value/Details',
            'Timestamp',
            'Email',
            'User',
            'Segment',
            'Type',
            'Merchant',
          ],
        ],
        body: voucherReedemDownloadData,
      })

      Doc.save(`voucherReedemptionReport-${dayjs().format('YYYY-MM-DD')}.pdf`)
    }
    if (value === 'csv') {
      const FileName = `voucherReedemptionReport-${dayjs().format(
        'YYYY-MM-DD'
      )}`
      const customdata = formatDataForXLSandCSV(
        voucherReedemptionDownloadDetails,
        columns
      ).dataToDownload
      const header = formatDataForXLSandCSV(
        voucherReedemptionDownloadDetails,
        columns
      ).headerForData
      downloadCsvFiles(customdata, header, FileName)
    }
  }
  const tableRows = () => (
    <>
      <div className="table-wrapper">
        <PerfectScrollbar>
          <Table sortable singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  onClick={() => handleSort('voucherName')}
                  onKeyDown={() => handleSort('voucherName')}
                  className={`sortable ${
                    sortBy === 'voucherName'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'voucherName' ? sortOrder : null}
                >
                  Voucher Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('qrCode')}
                  onKeyDown={() => handleSort('qrCode')}
                  className={`sortable ${
                    sortBy === 'qrCode'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'qrCode' ? sortOrder : null}
                >
                  QR Code Value/Details
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('createdAt')}
                  onKeyDown={() => handleSort('createdAt')}
                  className={`sortable ${
                    sortBy === 'createdAt'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'createdAt' ? sortOrder : null}
                >
                  Timestamp
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('email')}
                  onKeyDown={() => handleSort('email')}
                  className={`sortable ${
                    sortBy === 'email'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'email' ? sortOrder : null}
                >
                  Email
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('name')}
                  onKeyDown={() => handleSort('name')}
                  className={`sortable ${
                    sortBy === 'name'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'name' ? sortOrder : null}
                >
                  User
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('segment')}
                  onKeyDown={() => handleSort('segment')}
                >
                  Segment
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('type')}
                  onKeyDown={() => handleSort('type')}
                  className={`sortable ${
                    sortBy === 'type'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'type' ? sortOrder : null}
                >
                  Type
                </Table.HeaderCell>
                <Table.HeaderCell>Merchant</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {voucherReedemptionDetails?.map((detail) => (
                <Table.Row>
                  <Table.Cell data-label="Voucher Name">
                    {detail.voucher.name}
                  </Table.Cell>
                  <Table.Cell data-label="QR code value/details">
                    {detail.voucher.qrCode}
                  </Table.Cell>
                  <Table.Cell data-label="Timestamp">
                    {`${dayjs(new Date(`${detail.redeemAt} UTC`)).format(
                      'DD/MM/YY - hh:mm A'
                    )}`}
                  </Table.Cell>
                  <Table.Cell data-label="Email">{detail.email}</Table.Cell>
                  <Table.Cell data-label="User">
                    {detail.consumerName}
                  </Table.Cell>
                  <Table.Cell data-label="Segment">
                    <div className="table-segment-data">
                      {detail.segment.join()}
                    </div>
                  </Table.Cell>
                  <Table.Cell data-label="Type">
                    {detail.voucher.type === 'free'
                      ? 'Free'
                      : detail.voucher.type === 'moneyOff'
                      ? 'Money Off'
                      : 'Percentage Off'}
                  </Table.Cell>
                  <Table.Cell data-label="Merchant">
                    {detail.voucher?.organisation?.name}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </PerfectScrollbar>
      </div>
      <div className="bottom-actions-wrapper with-export-btn">
        <div className="export-dropdown-wrapper">
          <div className="ui right icon select">
            <Dropdown
              text={placeholder.exportLabel}
              name="consumerHistroyArray"
              fluid
              selection
              options={downloadFileOptions}
              onChange={handleDownloadClick}
            />
            <Download />
          </div>
        </div>
        <div className="pagination-wrapper">
          <CustomPagination
            handlePagination={handlePagination}
            currentPage={currentPage}
            limit={limit}
            totalPages={totalPages}
          />
        </div>
      </div>
    </>
  )

  return (
    <div className="voucher-redemption-report-page">
      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1">Voucher Redemption Report</Header>
          <div className="date">
            <span> {`${dayjs().format('dddd')}`}, </span>{' '}
            {`${dayjs().format('D MMMM YYYY')}`}
          </div>
        </div>
        <div className="page-right-header">
          <Input
            iconPosition="left"
            onBlur={(e) => e.target.value && handleSearch(e)}
            placeholder="Search"
            className="blurOnEnter search-box"
            onChange={(e) => !e.target.value && handleSearch(e)}
          >
            <Search />
            <input maxLength="255" />
          </Input>
          <div className="calendar-fields">
            <Form.Field>
              <div className="ui left icon input calendar">
                <Calendar />

                <DatesRangeInput
                  name="datesRange"
                  placeholder="From - To"
                  dateFormat="YYYY-MM-DD"
                  value={date}
                  iconPosition="left"
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
            </Form.Field>
            <div
              onKeyDown={() => handleFilter(true)}
              onClick={() => handleFilter(true)}
              className="only-filter-wrapper"
            >
              <SearchFilter /> Filter
            </div>
          </div>
          <Button
            primary
            className={`arrow-button ${
              startDate === '' || endDate === '' ? 'disabled' : ''
            }`}
            onClick={handleDateClick}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
      {loading && <Loader className="screen-centered" />}
      {voucherReedemptionDetails?.length > 0
        ? tableRows()
        : !loading
        ? noResults()
        : ''}
      <Modal open={filterPopup} className="multiple-filter-popup">
        <Modal.Header className="a-center">
          Filter Voucher Redemption Report by
        </Modal.Header>
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
                  minLength="1"
                  maxLength="10"
                  value={postcode}
                  onChange={handleChange}
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
                  name="voucherType"
                  label="Voucher Type"
                  checked={voucherType}
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
                  name="checkSegment"
                  label="Segment"
                  checked={checkSegment}
                  onChange={handleChange}
                />
              </Form.Field>
              <Form.Field>
                <div className="ui left icon select">
                  <PieChart />
                  <Dropdown
                    placeholder={placeholder.segmentName}
                    name="segment"
                    value={segment || []}
                    fluid
                    multiple
                    selection
                    search
                    options={segmentOptions}
                    onChange={handleChange}
                  />
                </div>
              </Form.Field>
            </Grid.Column>

            <Grid.Column>
              <Form.Field className="checbox-field">
                <Checkbox
                  name="checkMerchant"
                  label="Merchant"
                  checked={checkMerchant}
                  onChange={handleChange}
                />
              </Form.Field>
              <Form.Field>
                <div className="ui left icon select">
                  <Merchant />
                  <Dropdown
                    placeholder={placeholder.selectMerchants}
                    name="merchant"
                    value={merchant || []}
                    fluid
                    multiple
                    selection
                    search
                    options={orgOptions}
                    onChange={handleChange}
                  />
                </div>
              </Form.Field>
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => handleFilterVouchersForm(1)}
            disabled={disableFilterFormBtn}
            primary
          >
            Show Results
          </Button>
          <Button onClick={clearAndApplyFilter} basic>
            Clear & Apply filters
          </Button>
          <Button
            secondary
            onKeyDown={() => handleFilter(false)}
            onClick={() => handleFilter(false)}
          >
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}
VoucherRedemptionReport.propTypes = {
  fetchVoucherReedemption: propTypes.func.isRequired,
  loading: propTypes.bool.isRequired,
  voucherReedemptionDownloadDetails: propTypes.arrayOf(propTypes.array)
    .isRequired,
  voucherReedemptionDetails: propTypes.arrayOf(propTypes.array).isRequired,
  totalPages: propTypes.string.isRequired,
  orgDetails: propTypes.arrayOf(propTypes.array).isRequired,
  segmentList: propTypes.arrayOf(propTypes.array).isRequired,
  fetchAllVoucherReedemption: propTypes.func.isRequired,
}
export default withToast(VoucherRedemptionReport)
