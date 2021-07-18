import React, { useState, useEffect } from 'react'
import propTypes from 'prop-types'
import {
  Header,
  Table,
  Popup,
  Modal,
  Form,
  Button,
  Message,
  Input,
} from 'semantic-ui-react'
import dayjs from 'dayjs'
import { Link, useHistory } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Search from '../../../../svgs/Search'
import CustomPagination from '../../../../utils/customPagination'
import Add from '../../../../svgs/Add'
import Delete from '../../../../svgs/Delete'
import Dots from '../../../../svgs/Dots'
import * as url from '../../../../utils/urls'
import NotificationService from '../../../../api/services/NotificationService'
import {
  noDataFound,
  deleteNotificationSuccess,
  approvedNotificationSuccess,
  rejectNotificationSuccess,
} from '../../../../utils/messages'
import Loader from '../../../../utils/Loader'
import { handleSearchOnKeyPress } from '../../../../utils/helper'

const UserAlertList = (props) => {
  const history = useHistory()
  const roles = ['systemAdmin', 'systemManager']
  const { isLoading, getNotificationDetails, addToast } = props
  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showDelete, setShowDelete] = useState(false)
  const [showAction, setShowAction] = useState(false)
  const [notificationList, setNotificationList] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [notificationId, setNotificationId] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const fetchNotificationList = async (search = null, pageNo = null) => {
    const queryParam = `?page=${pageNo || currentPage}&limit=${limit}${
      sortBy !== '' ? `&orderBy=${sortBy}:${sortOrder}` : ''
    }${search ? `&search=${search}` : ''}`
    setLoading(true)
    try {
      const response = await NotificationService.fetchNotificationList(
        queryParam
      )
      setNotificationList(response?.notifications)
      setTotalPages(response?.totalPages)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.warn('getAllNotifications:', error)
    }
  }

  useEffect(() => {
    fetchNotificationList(searchValue)
  }, [currentPage, limit, sortBy, sortOrder])

  useEffect(() => {
    window.addEventListener('keydown', handleSearchOnKeyPress)
    return () => window.removeEventListener('keydown', handleSearchOnKeyPress)
  }, [])

  const handlePagination = (currentPage, limit = 15) => {
    setCurrentPage(currentPage)
    setLimit(limit)
  }

  const updateAlert = (id) => {
    getNotificationDetails(id)
    history.push(`${url.userAlertUpdate}?id=${id}`)
  }

  const deleteAlert = (status, id) => {
    setNotificationId(id)
    setShowAction(false)
    setShowDelete(status)
  }

  const handleActionOpen = (status) => {
    setShowAction(status)
  }

  const handleApproveReject = async (action, id) => {
    const data = {
      notificationId: id,
      isApproved: action,
    }
    setLoading(true)
    try {
      const response = await NotificationService.approveRejectNotification(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else
        addToast(
          action ? approvedNotificationSuccess : rejectNotificationSuccess,
          { appearance: 'success' }
        )
      fetchNotificationList()
      setLoading(false)
    } catch (err) {
      console.warn(err, 'handleApproveReject')
      setLoading(false)
    }
  }

  const handleDeleteAlert = async () => {
    setLoading(true)
    try {
      const response = await NotificationService.deleteNotification(
        notificationId
      )
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else addToast(deleteNotificationSuccess, { appearance: 'success' })
      setShowDelete(false)
      fetchNotificationList()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.warn('handleDeleteAlert:', error)
    }
  }

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

  const handleSearch = (e) => {
    setCurrentPage(1)
    setSearchValue(e.target.value)
    fetchNotificationList(e.target.value, 1)
  }

  const noResults = () => <Message info content={noDataFound} />

  const renderNotificationTable = () => (
    <>
      <div className="table-wrapper">
        <PerfectScrollbar>
          <Table sortable singleLine>
            <Table.Header>
              <Table.Row>
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
                  Name
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
                <Table.HeaderCell
                  onClick={() => handleSort('location')}
                  onKeyDown={() => handleSort('location')}
                  className={`sortable ${
                    sortBy === 'location'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'location' ? sortOrder : null}
                >
                  Location
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('time')}
                  onKeyDown={() => handleSort('time')}
                  className={`sortable ${
                    sortBy === 'time'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'time' ? sortOrder : null}
                >
                  Target Date &amp; Time
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('description')}
                  onKeyDown={() => handleSort('description')}
                  className={`sortable ${
                    sortBy === 'description'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'description' ? sortOrder : null}
                >
                  Description
                </Table.HeaderCell>
                <Table.HeaderCell>Segment</Table.HeaderCell>
                {localStorage.getItem('role') !== 'systemUser' && (
                  <Table.HeaderCell>Action</Table.HeaderCell>
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {notificationList.map((data) => {
                const {
                  id,
                  name,
                  status,
                  type,
                  location,
                  triggerDate,
                  description,
                  notificationSegment,
                  isPending,
                  isApproved,
                } = data
                return (
                  <Table.Row>
                    <Table.Cell data-label="Name"> {name} </Table.Cell>
                    <Table.Cell data-label="Type">
                      {' '}
                      {type === 'uniquePush' ? 'Unique Push' : 'Broadcast'}{' '}
                    </Table.Cell>
                    <Table.Cell data-label="Location"> {location} </Table.Cell>
                    <Table.Cell data-label="Target Date &amp; Time">
                      {`${dayjs(new Date(`${triggerDate} UTC`)).format(
                        'DD/MM/YY'
                      )} - ${dayjs(new Date(`${triggerDate} UTC`)).format(
                        'hh:mm A'
                      )}`}
                    </Table.Cell>
                    <Table.Cell data-label="Description">
                      {description}
                    </Table.Cell>
                    <Table.Cell data-label="Segment">
                      {' '}
                      {notificationSegment?.map((segment, index) => {
                        const segmentName = []
                        segmentName.push(segment.name)
                        return `${segmentName}${
                          index === notificationSegment.length - 1 ? '' : `,`
                        }`
                      })}{' '}
                    </Table.Cell>
                    {status !== 2 &&
                      localStorage.getItem('role') !== 'systemUser' && (
                        <Table.Cell data-label="Actions" className="action-col">
                          <Popup
                            className="action-popup"
                            open={showAction}
                            onOpen={() => handleActionOpen(this, true)}
                            onClose={() => handleActionOpen(this, false)}
                            on="click"
                            pinned
                            position="bottom right"
                            trigger={
                              <div className="dots-action">
                                <Dots />
                              </div>
                            }
                          >
                            <div className="action-dropdown">
                              <ul>
                                {status === 0 && (
                                  <>
                                    {!isPending && !isApproved ? (
                                      ''
                                    ) : (
                                      <li>
                                        <div
                                          onClick={() => updateAlert(id)}
                                          onKeyDown={() => updateAlert(id)}
                                        >
                                          Edit
                                        </div>
                                      </li>
                                    )}
                                    {isPending &&
                                      roles.includes(
                                        localStorage.getItem('role')
                                      ) && (
                                        <>
                                          <li>
                                            <div
                                              onClick={() =>
                                                handleApproveReject(true, id)
                                              }
                                              onKeyDown={() =>
                                                handleApproveReject(true, id)
                                              }
                                            >
                                              Approve
                                            </div>
                                          </li>
                                          <li>
                                            <div
                                              onClick={() =>
                                                handleApproveReject(false, id)
                                              }
                                              onKeyDown={() =>
                                                handleApproveReject(false, id)
                                              }
                                            >
                                              Reject
                                            </div>
                                          </li>
                                        </>
                                      )}
                                  </>
                                )}
                                <li>
                                  <div
                                    onClick={() => deleteAlert(true, id)}
                                    onKeyDown={() => deleteAlert(true, id)}
                                  >
                                    Delete
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </Popup>
                        </Table.Cell>
                      )}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        </PerfectScrollbar>
      </div>
      <div className="bottom-actions-wrapper">
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
    <div className="voucher-list-page">
      <>
        <div className="page-header">
          <div className="page-left-header">
            <Header as="h1">User Alerts</Header>
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
              className="blurOnEnter"
              onChange={(e) => !e.target.value && handleSearch(e)}
            >
              <Search />
              <input maxLength="255" />
            </Input>
            <Link to={url.userAlertCreate} className="ui button primary icon">
              <Add />
              Create User Alert
            </Link>
          </div>
        </div>
        {loading || isLoading ? (
          <Loader className="screen-centered" />
        ) : (
          <>
            {notificationList?.length > 0
              ? renderNotificationTable()
              : noResults()}
            <Modal
              open={showDelete}
              onClose={() => setShowDelete(false)}
              onOpen={() => setShowDelete(true)}
              className="create-segment-popup"
            >
              <Form>
                <Modal.Content>
                  <div className="popupDeleteIcon">
                    <Delete />
                  </div>
                  <Header as="h2">
                    Are you sure you want to delete the user alert?
                  </Header>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    loading={loading}
                    primary
                    onClick={() => handleDeleteAlert()}
                  >
                    Delete
                  </Button>
                  <Button secondary onClick={() => deleteAlert(false)}>
                    Cancel
                  </Button>
                </Modal.Actions>
              </Form>
            </Modal>
          </>
        )}
      </>
    </div>
  )
}

UserAlertList.propTypes = {
  isLoading: propTypes.bool.isRequired,
  addToast: propTypes.func.isRequired,
  getNotificationDetails: propTypes.func.isRequired,
}

export default UserAlertList
