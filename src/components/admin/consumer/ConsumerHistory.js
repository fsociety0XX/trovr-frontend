import React, { useState, useEffect } from 'react'
import {
  Header,
  Table,
  Form,
  Button,
  Dropdown,
  Message,
  Input,
} from 'semantic-ui-react'
import dayjs from 'dayjs'
import propTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { DatesRangeInput } from 'semantic-ui-calendar-react'
import JsPDF from 'jspdf'
import { useToasts } from 'react-toast-notifications'
import Search from '../../../svgs/Search'
import CustomPagination from '../../../utils/customPagination'
import ArrowRight from '../../../svgs/ArrowRight'
import Loader from '../../../utils/Loader'
import {
  handleSearchOnKeyPress,
  withToast,
  formatDataForXLSandCSV,
  downloadCsvFiles,
} from '../../../utils/helper'

import Calendar from '../../../svgs/Calendar'
import Download from '../../../svgs/Download'
import * as placeholder from '../../../utils/placeholders'
import { noDataFound, validDate } from '../../../utils/messages'
import 'jspdf-autotable'

const ConsumerHistory = (props) => {
  const {
    fetchConsumerHistory,
    consumerHistoryDetails,
    loading,
    totalPages,
    consuemrHistoryDownloadDetails,
    fetchAllConsumerHistory,
  } = props
  const { addToast } = useToasts()

  const curr = new Date()
  const first = curr.getDate() - 6
  const firstday = new Date(curr.setDate(first))
  const pastYearDate = new Date()
  const pastYear = pastYearDate.getFullYear() - 1
  pastYearDate.setFullYear(pastYear)
  const [date, setDate] = useState(
    `${dayjs(firstday).format('YYYY-MM-DD')} - ${dayjs().format('YYYY-MM-DD')}`
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [startDate, setStartDate] = useState(
    dayjs(firstday).format('YYYY-MM-DD')
  )
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [filter, setFilter] = useState(true)
  const [limit, setLimit] = useState(15)
  // const [pastYearsDate,setPastYearsDate] = useState(dayjs(pastYearDate).format('YYYY-MM-DD'))
  const [
    consumerHistoryDownloadData,
    setConsumerHistoryDownloadData,
  ] = useState([])

  const columns = [
    {
      Header: 'Timestamp',
      id: 'createdAt',
    },
    {
      Header: 'Email',
      id: 'email',
    },
    {
      Header: 'User',
      id: 'name',
    },
    {
      Header: 'Activity',
      id: 'activity',
    },
    {
      Header: 'Ip address',
      id: 'ipAddress',
    },
    {
      Header: 'Status',
      id: 'status',
    },
  ]

  const handlePagination = (currentPage, limit = 15) => {
    setCurrentPage(currentPage)
    setLimit(limit)
  }
  const downloadFileOptions = [
    { key: 'csv', value: 'csv', text: 'CSV' },
    { key: 'pdf', value: 'pdf', text: 'PDF' },
  ]

  const handleChange = (event, { value }) => {
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
  const handleDownloadClick = (event, { value }) => {
    if (value === 'pdf') {
      const Doc = new JsPDF()

      Doc.autoTable({
        head: [
          ['Timestamp', 'Email', 'User', 'Activity', 'Ip address', 'Status'],
        ],
        body: consumerHistoryDownloadData,
      })

      Doc.save(`consumerHistory-${dayjs().format('YYYY-MM-DD')}.pdf`)
    }
    if (value === 'csv') {
      const FileName = `consumerHistory-${dayjs().format('YYYY-MM-DD')}`
      const customdata = formatDataForXLSandCSV(
        consuemrHistoryDownloadDetails,
        columns
      ).dataToDownload
      const header = formatDataForXLSandCSV(
        consuemrHistoryDownloadDetails,
        columns
      ).headerForData
      downloadCsvFiles(customdata, header, FileName)
    }
  }
  const handleDateClick = () => {
    setFilter(!filter)
  }
  useEffect(() => {
    const obj = {
      page: currentPage,
      limit,
      from: startDate,
      to: endDate,
    }
    searchValue && Object.assign(obj, { search: searchValue })
    fetchConsumerHistory(obj)
    fetchAllConsumerHistory(obj)
  }, [currentPage, limit, filter, searchValue])

  useEffect(() => {
    const consumerHistoryArray = []
    consuemrHistoryDownloadDetails?.forEach((data) => {
      const array = [
        dayjs(new Date(`${data.createdAt} UTC`)).format('DD/MM/YY - hh:mm A'),
        data.email,
        data.name,
        data.activity,
        data.ipAddress,
        data.status ? 'success' : 'fail',
      ]
      consumerHistoryArray.push(array)
    })
    setConsumerHistoryDownloadData(consumerHistoryArray)
  }, [consuemrHistoryDownloadDetails])

  const noResults = () => <Message info content={noDataFound} />

  useEffect(() => {
    window.addEventListener('keydown', handleSearchOnKeyPress)
    return () => window.removeEventListener('keydown', handleSearchOnKeyPress)
  }, [])

  const handleSearch = (e) => {
    setCurrentPage(1)
    setSearchValue(e.target.value)
  }

  const tableRows = () => (
    <>
      <div className="table-wrapper">
        <PerfectScrollbar>
          <Table sortable singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Timestamp</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>User</Table.HeaderCell>
                <Table.HeaderCell>Activity</Table.HeaderCell>
                <Table.HeaderCell>IP address</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {consumerHistoryDetails?.map((detail) => (
                <Table.Row>
                  <Table.Cell data-label="Timestamp">
                    {`${dayjs(new Date(`${detail.createdAt} UTC`)).format(
                      'DD/MM/YY - hh:mm A'
                    )}`}
                  </Table.Cell>
                  <Table.Cell data-label="Email">{detail.email}</Table.Cell>
                  <Table.Cell data-label="User">{detail.name}</Table.Cell>
                  <Table.Cell data-label="Activity">
                    {detail.activity}
                  </Table.Cell>
                  <Table.Cell data-label="IP address">
                    {detail.ipAddress}
                  </Table.Cell>
                  <Table.Cell data-label="Status">
                    <span
                      className={`status ${detail.status ? 'success' : 'fail'}`}
                    />
                    {detail.status ? 'success' : 'fail'}
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
    <div className="consumer-history-page">
      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1">Consumer History</Header>
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
                  // minDate={pastYearDate}
                  maxDate={new Date()}
                  // initialDate={date}
                />
              </div>
            </Form.Field>
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
      {consumerHistoryDetails?.length > 0
        ? tableRows()
        : !loading
        ? noResults()
        : ''}
    </div>
  )
}
export default withToast(ConsumerHistory)
ConsumerHistory.propTypes = {
  fetchConsumerHistory: propTypes.func.isRequired,
  consumerHistoryDetails: propTypes.arrayOf(propTypes.array).isRequired,
  totalPages: propTypes.string.isRequired,
  loading: propTypes.bool.isRequired,
  fetchAllConsumerHistory: propTypes.func.isRequired,
  consuemrHistoryDownloadDetails: propTypes.arrayOf(propTypes.array).isRequired,
}
