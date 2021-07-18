import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import {
  Table,
  Popup,
  Modal,
  Input,
  Button,
  Message,
  Form,
  Header,
  Grid,
} from 'semantic-ui-react'
import dayjs from 'dayjs'
import PerfectScrollbar from 'react-perfect-scrollbar'
import propTypes from 'prop-types'
import Search from '../../../../svgs/Search'
import { invalidSegmentName, noDataFound } from '../../../../utils/messages'
import {
  renderFieldError,
  withToast,
  handleSearchOnKeyPress,
} from '../../../../utils/helper'
import Loader from '../../../../utils/Loader'
import PieChart from '../../../../svgs/PieChart'
import CustomPagination from '../../../../utils/customPagination'
import Dots from '../../../../svgs/Dots'
import Delete from '../../../../svgs/Delete'
import SegmentService from '../../../../api/services/SegmentService'
import * as placeholder from '../../../../utils/placeholders'

const SegmentList = (props) => {
  const [segmentData, setSegmentData] = useState([])
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [limit, setLimit] = useState(15)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [segmentName, setName] = useState('')
  const [errors, setErrors] = useState({})
  const [item, setItem] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [showAction, setShowAction] = React.useState(false)
  const [searchValue, setSearchValue] = useState('')

  const { callSegmentList } = props
  const openDeleteSegment = (id) => {
    setShowDelete(true)
    setItem(id)
    setShowAction(false)
  }
  const openEditSegment = (data) => {
    setShowEdit(true)
    setItem(data.id)
    setName(data.name)
    setShowAction(false)
  }

  const handleActionOpen = (status) => {
    setShowAction(status)
  }

  const fetchSegmentList = async (search = null, pageNo = null) => {
    setIsLoading(true)
    const queryString = `?page=${pageNo || currentPage}&limit=${limit}${
      sortBy !== '' ? `&orderBy=${sortBy}:${sortOrder}` : ''
    }${search ? `&search=${search}` : ''}`
    try {
      const response = await SegmentService.segmentList(queryString)
      setSegmentData(response?.segments)
      setTotalPages(response?.totalPages)
      setIsLoading(false)
    } catch (e) {
      console.warn('segment List:', e)
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchSegmentList(searchValue)
  }, [currentPage, limit, sortBy, sortOrder, callSegmentList])

  const deleteSegment = async (id) => {
    const { addToast } = props
    setIsLoading(true)
    let response = null
    response = await SegmentService.deleteSegment(id)

    if (response.length > 0) {
      setIsLoading(false)
      setShowDelete(false)
      addToast(response[0].message, { appearance: 'error' })
    } else {
      setIsLoading(false)
      setShowDelete(false)
      addToast('Segment deleted successfully', { appearance: 'success' })
      fetchSegmentList()
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
  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    // segment name
    if (name === 'name') {
      if (value.length > 255) {
        error.name = [invalidSegmentName]
      }
    }
    setErrors(error)
  }

  const handleChange = (e, { name, value }) => {
    if (name === 'segmentName') {
      setName(value)
    }
    validateField(name, value)
  }
  const isFormValid = () => !Object.keys(errors).length
  const areRequiredFilled = () => {
    const requiredFields = ['segmentName']

    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const handleEditFormData = async () => {
    setIsLoading(true)
    const { addToast } = props
    const obj = {
      name: segmentName,
    }
    let response = null
    response = await SegmentService.editSegment(obj, item)

    if (response.length > 0) {
      setIsLoading(false)
      setShowEdit(false)
      addToast(response[0].message, { appearance: 'error' })
    } else {
      fetchSegmentList()
      setIsLoading(false)
      setShowEdit(false)
      addToast('segment updated successfully', { appearance: 'success' })
    }
  }
  const handlePagination = (page, recordLimit = 15) => {
    setCurrentPage(page)
    setLimit(recordLimit)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleSearchOnKeyPress)
    return () => window.removeEventListener('keydown', handleSearchOnKeyPress)
  }, [])

  const handleSearch = (e) => {
    setCurrentPage(1)
    setSearchValue(e.target.value)
    fetchSegmentList(e.target.value, 1)
  }

  const noResults = () => <Message info content={noDataFound} />

  const tableRows = () => (
    <>
      <div className="table-wrapper">
        <PerfectScrollbar>
          <Table sortable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  onClick={() => handleSort('segmentName')}
                  onKeyDown={() => handleSort('segmentName')}
                  className={`sortable ${
                    sortBy === 'segmentName'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'segmentName' ? sortOrder : null}
                >
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('updatedAt')}
                  onKeyDown={() => handleSort('updatedAt')}
                  className={`sortable ${
                    sortBy === 'updatedAt'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'updatedAt' ? sortOrder : null}
                >
                  Last Updated
                </Table.HeaderCell>
                <Table.HeaderCell>Number of Users</Table.HeaderCell>

                <Table.HeaderCell className="action-col">
                  Actions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {segmentData?.map((detail) => (
                <Table.Row key={detail.id}>
                  <Table.Cell data-label="Name">{detail.name}</Table.Cell>
                  <Table.Cell data-label="Last Updated">
                    {dayjs(detail.updatedAt).format('DD/MM/YY')}
                  </Table.Cell>
                  <Table.Cell data-label="Number of Users">
                    {detail.users.length}
                  </Table.Cell>

                  <Table.Cell data-label="Actions" className="action-col">
                    <Popup
                      open={showAction}
                      onOpen={() => handleActionOpen(this, true)}
                      onClose={() => handleActionOpen(this, false)}
                      className="action-popup"
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
                              onClick={() => openEditSegment(detail)}
                              onKeyDown={() => openEditSegment(detail)}
                            >
                              Edit
                            </div>
                          </li>
                          <li>
                            <div
                              onClick={() => openDeleteSegment(detail.id)}
                              onKeyDown={() => openDeleteSegment(detail.id)}
                            >
                              Delete
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Popup>
                  </Table.Cell>
                </Table.Row>
              ))}
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
      {isLoading && <Loader className="screen-centered" />}
      <Input
        iconPosition="left"
        onBlur={(e) => e.target.value && handleSearch(e)}
        placeholder="Search"
        className="blurOnEnter segment-search"
        onChange={(e) => !e.target.value && handleSearch(e)}
      >
        <Search />
        <input maxLength="255" />
      </Input>
      {segmentData?.length > 0 ? tableRows() : !isLoading ? noResults() : ''}
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
              Are you sure you want to delete the segment?
            </Header>
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={() => deleteSegment(item)}>
              Delete
            </Button>
            <Button secondary onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
      {/* EDIT SEGMENT */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onOpen={() => setShowEdit(true)}
        className="create-segment-popup"
      >
        <Modal.Header className="a-center">Edit Segment</Modal.Header>
        <Form error={!isFormValid()} onSubmit={handleEditFormData}>
          <Modal.Content>
            <Grid columns={1}>
              <Grid.Column>
                <Form.Field>
                  <Input
                    iconPosition="left"
                    name="segmentName"
                    placeholder={placeholder.segmentName}
                    value={segmentName}
                    onChange={handleChange}
                    // maxLength="11"
                  >
                    <PieChart />
                    <input />
                  </Input>
                  {renderFieldError([...(errors.name || [])])}
                </Form.Field>
              </Grid.Column>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              onClick={() => setShowEdit(true)}
              disabled={!isFormValid() || !areRequiredFilled()}
            >
              Update
            </Button>
            <Button secondary onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
    </>
  )
}
export default withToast(SegmentList)

SegmentList.propTypes = {
  addToast: propTypes.func.isRequired,
  callSegmentList: propTypes.bool.isRequired,
}
