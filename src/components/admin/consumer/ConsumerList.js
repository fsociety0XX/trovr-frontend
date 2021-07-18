import React, { useState, useEffect } from 'react'
import {
  Header,
  Table,
  Checkbox,
  Popup,
  Modal,
  Form,
  Button,
  Message,
  Input,
} from 'semantic-ui-react'
import dayjs from 'dayjs'
import propTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Search from '../../../svgs/Search'
import { noDataFound } from '../../../utils/messages'
import Loader from '../../../utils/Loader'
import Add from '../../../svgs/Add'
import Boy from '../../../svgs/Boy'
import Girl from '../../../svgs/Girl'
import Dots from '../../../svgs/Dots'
import CreateSegment from './segment/CreateSegment'
import CustomPagination from '../../../utils/customPagination'
import Delete from '../../../svgs/Delete'
import AdminService from '../../../api/services/AdminService'
import { withToast, handleSearchOnKeyPress } from '../../../utils/helper'
import * as urls from '../../../utils/urls'
import Other from '../../../svgs/Other'

const ConsumerList = (props) => {
  const { fetchConsumerDetails, segmentList, segmentDetail, loading } = props
  const history = useHistory()
  const [consumerData, setConsumerData] = useState([])
  const [showDelete, setShowDelete] = React.useState(false)
  const [showAction, setShowAction] = React.useState(false)
  const [limit, setLimit] = useState(15)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [item, setItem] = useState('')
  const [segmentId, setSegmentId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [allCheck, setCheckAll] = useState(false)
  const [consumerIdArray, setConsumerIdArray] = useState([])
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [callConsumerList, setCallConsumerList] = useState(false)
  const [searchValue, setSearchValue] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const deleteConsumer = (status, id = null, segmentId = null) => {
    setItem(id)
    setSegmentId(segmentId)
    setShowAction(false)
    setShowDelete(status)
  }
  const roles = ['systemAdmin', 'systemManager']
  const handleActionOpen = (status) => {
    setShowAction(status)
  }
  const fetchConsumerList = async (search = null, pageNo = null) => {
    const queryString = `?page=${pageNo || currentPage}&limit=${limit}${
      sortBy !== '' ? `&orderBy=${sortBy}:${sortOrder}` : ''
    }${search ? `&search=${search}` : ''}`
    setIsLoading(true)

    try {
      const response = await AdminService.fetchConsumer(queryString)

      setConsumerData(response?.consumers)

      setTotalPages(response?.totalPages)

      setIsLoading(false)
    } catch (e) {
      console.warn('Merchant List:', e)

      setIsLoading(false)
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
  useEffect(() => {
    fetchConsumerList(searchValue)
    segmentList()
  }, [currentPage, limit, sortBy, sortOrder, callConsumerList])

  const handlePagination = (page, recordLimit = 15) => {
    setCurrentPage(page)
    setLimit(recordLimit)
  }
  const handleDeleteConsumer = async (id, segmentId) => {
    const { addToast } = props
    setDeleteLoading(true)
    let response = null
    response = await AdminService.deleteUser(id)

    if (response.length > 0) {
      setDeleteLoading(false)
      setShowDelete(false)
      addToast(response[0].message, { appearance: 'error' })
    } else {
      const tempArray = consumerIdArray.filter((d) => d !== segmentId)
      setConsumerIdArray(tempArray)
      setDeleteLoading(false)
      setShowDelete(false)
      addToast('Consumer deleted successfully', { appearance: 'success' })
      fetchConsumerList()
    }
  }
  const handleActiveConsumer = async (id) => {
    const { addToast } = props
    setIsLoading(true)
    const obj = {
      userId: id,
      status: true,
    }
    let response = null
    response = await AdminService.activeConsumer(obj)
    setShowAction(false)
    if (response.length > 0) {
      setIsLoading(false)
      addToast(response[0].message, { appearance: 'error' })
    } else {
      setIsLoading(false)
      addToast('Consumer approved successfully', { appearance: 'success' })
      fetchConsumerList()
    }
  }
  const handleAllCheckbox = (event, data) => {
    if (data.checked) {
      const temp = consumerData.map((d) => d.role[0].id)
      setConsumerIdArray(temp)
      setCheckAll(true)
    } else {
      setConsumerIdArray([])
      setCheckAll(false)
    }
  }

  const handleCheckbox = (event, data) => {
    if (data.checked) {
      const temp = consumerIdArray.map((s) => s)
      temp.push(data.value.role[0].id)
      setConsumerIdArray(temp)
    } else {
      const temp = consumerIdArray.filter((s) => s !== data.value.role[0].id)
      setConsumerIdArray(temp)
      setCheckAll(false)
    }
  }

  const noResults = () => <Message info content={noDataFound} />

  const updateConsumer = (id) => {
    fetchConsumerDetails(id)
    history.push(`${urls.consumerUpdate}?id=${id}`)
  }
  const callConsumer = () => {
    setCallConsumerList(!callConsumerList)
    setCheckAll(false)
    setConsumerIdArray([])
  }

  useEffect(() => {
    window.addEventListener('keydown', handleSearchOnKeyPress)
    return () => window.removeEventListener('keydown', handleSearchOnKeyPress)
  }, [])

  const handleSearch = (e) => {
    setSearchValue(e.target.value)
    setCurrentPage(1)
    fetchConsumerList(e.target.value, 1)
  }

  const tableRows = () => (
    <>
      <div className="table-wrapper">
        <PerfectScrollbar>
          <Table sortable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Checkbox onClick={handleAllCheckbox} checked={allCheck} />
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
                  onClick={() => handleSort('firstName')}
                  onKeyDown={() => handleSort('firstName')}
                  className={`sortable ${
                    sortBy === 'firstName'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'firstName' ? sortOrder : null}
                >
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('address')}
                  onKeyDown={() => handleSort('address')}
                  className={`sortable ${
                    sortBy === 'address'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'address' ? sortOrder : null}
                >
                  Address
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('town')}
                  onKeyDown={() => handleSort('town')}
                  className={`sortable ${
                    sortBy === 'town'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'town' ? sortOrder : null}
                >
                  Town
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('city')}
                  onKeyDown={() => handleSort('city')}
                  className={`sortable ${
                    sortBy === 'city'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'city' ? sortOrder : null}
                >
                  City
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('postCode')}
                  onKeyDown={() => handleSort('postCode')}
                  className={`sortable ${
                    sortBy === 'postCode'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'postCode' ? sortOrder : null}
                >
                  Postcode
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('country')}
                  onKeyDown={() => handleSort('country')}
                  className={`sortable ${
                    sortBy === 'country'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'country' ? sortOrder : null}
                >
                  Country
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('dob')}
                  onKeyDown={() => handleSort('dob')}
                  className={`sortable ${
                    sortBy === 'dob'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'dob' ? sortOrder : null}
                >
                  DOB
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('gender')}
                  onKeyDown={() => handleSort('gender')}
                  className={`sortable ${
                    sortBy === 'gender'
                      ? sortOrder === 'ASC'
                        ? 'a-center ascending'
                        : sortOrder === 'DESC'
                        ? 'a-center descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'gender' ? sortOrder : null}
                >
                  Gender
                </Table.HeaderCell>
                <Table.HeaderCell>Segment</Table.HeaderCell>
                {roles.includes(localStorage.getItem('role')) && (
                  <Table.HeaderCell className="action-col">
                    Actions
                  </Table.HeaderCell>
                )}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {consumerData?.map((detail) => {
                const isChecked = consumerIdArray.includes(detail.role[0].id)
                let segmentString = ''
                detail.role[0]?.segments.forEach((segment, key) => {
                  segmentString +=
                    key === 0 ? segment.name : `, ${segment.name}`
                })

                return (
                  <Table.Row>
                    <Table.Cell>
                      <Checkbox
                        onClick={handleCheckbox}
                        value={detail}
                        checked={isChecked || allCheck}
                      />
                    </Table.Cell>
                    <Table.Cell data-label="Email">{detail.email}</Table.Cell>
                    <Table.Cell data-label="Name">{`${detail.firstName} ${
                      detail.lastName ?? ''
                    }`}</Table.Cell>
                    <Table.Cell data-label="Address">
                      {detail.address}
                    </Table.Cell>
                    <Table.Cell data-label="Town">{detail.town}</Table.Cell>
                    <Table.Cell data-label="City">{detail.city}</Table.Cell>
                    <Table.Cell data-label="Postcode">
                      {detail.postCode}
                    </Table.Cell>
                    <Table.Cell data-label="Country">
                      {detail.country}
                    </Table.Cell>
                    <Table.Cell data-label="DOB">
                      {dayjs(detail.dob).format('DD/MM/YY')}
                    </Table.Cell>
                    <Table.Cell data-label="Gender" className="a-center">
                      {detail.gender && (
                        <div className="gender-icon">
                          {detail.gender === 'female' ? (
                            <Girl />
                          ) : detail.gender === 'male' ? (
                            <Boy />
                          ) : detail.gender === 'other' ? (
                            <Other />
                          ) : (
                            ''
                          )}
                        </div>
                      )}
                    </Table.Cell>
                    <Table.Cell data-label="Segment">
                      <div className="table-segment-data">{segmentString}</div>
                    </Table.Cell>
                    {roles.includes(localStorage.getItem('role')) && (
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
                              <li>
                                <div
                                  onClick={() => updateConsumer(detail.id)}
                                  onKeyDown={() => updateConsumer(detail.id)}
                                >
                                  Edit
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() =>
                                    deleteConsumer(
                                      true,
                                      detail.id,
                                      detail?.role?.[0]?.id
                                    )
                                  }
                                  onKeyDown={() =>
                                    deleteConsumer(
                                      true,
                                      detail.id,
                                      detail?.role?.[0]?.id
                                    )
                                  }
                                >
                                  Delete
                                </div>
                              </li>

                              {!detail.status ? (
                                <li>
                                  <div
                                    onClick={() =>
                                      handleActiveConsumer(detail.id)
                                    }
                                    onKeyDown={() =>
                                      handleActiveConsumer(detail.id)
                                    }
                                  >
                                    Approve
                                  </div>
                                </li>
                              ) : (
                                ''
                              )}
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
    <>
      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1">Consumer</Header>
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
          {roles.includes(localStorage.getItem('role')) && (
            <CreateSegment
              segment={false}
              consumerIds={consumerIdArray}
              callConsumerList={callConsumer}
              segmentList={segmentDetail}
            />
          )}
          <Link to={urls.consumerCreate} className="ui button primary icon">
            <Add />
            Create Consumer
          </Link>
        </div>
      </div>
      <div className="consumer-list-page">
        {(isLoading || loading) && <Loader className="screen-centered" />}

        {consumerData?.length > 0 ? tableRows() : !isLoading ? noResults() : ''}

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
                Are you sure you want to delete the consumer?
              </Header>
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                loading={deleteLoading}
                onClick={() => handleDeleteConsumer(item, segmentId)}
              >
                Delete
              </Button>
              <Button secondary onClick={() => deleteConsumer(false)}>
                Cancel
              </Button>
            </Modal.Actions>
          </Form>
        </Modal>
      </div>
    </>
  )
}
export default withToast(ConsumerList)
ConsumerList.propTypes = {
  fetchConsumerDetails: propTypes.func.isRequired,
  addToast: propTypes.string.isRequired,
  segmentDetail: propTypes.objectOf(propTypes.object).isRequired,
  segmentList: propTypes.func.isRequired,
  loading: propTypes.bool.isRequired,
}
