import React, { useState, useEffect } from 'react'
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
import propTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import CustomPagination from '../../../../utils/customPagination'
import Add from '../../../../svgs/Add'
import Delete from '../../../../svgs/Delete'
import Dots from '../../../../svgs/Dots'
import * as url from '../../../../utils/urls'
import Search from '../../../../svgs/Search'
import {
  noDataFound,
  deleteTriggerSuccess,
  deleteTriggerMessage,
} from '../../../../utils/messages'
import { actionTypeOptions } from '../../../../utils/constants'
import TriggerService from '../../../../api/services/TriggerService'
import { handleSearchOnKeyPress } from '../../../../utils/helper'
import Loader from '../../../../utils/Loader'

const TriggerList = (props) => {
  const history = useHistory()
  const { isLoading, getTriggerDetails, addToast } = props
  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showDelete, setShowDelete] = useState(false)
  const [showAction, setShowAction] = useState(false)
  const [loading, setLoading] = useState(false)
  const [triggerList, setTriggerList] = useState([])
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [triggerId, setTriggerId] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const fetchTriggerList = async (search = null, pageNo = null) => {
    const queryParam = `?page=${pageNo || currentPage}&limit=${limit}${
      sortBy !== '' ? `&orderBy=${sortBy}:${sortOrder}` : ''
    }${search ? `&search=${search}` : ''}`
    setLoading(true)
    try {
      const response = await TriggerService.fetchTriggerList(queryParam)
      setTriggerList(response?.triggers)
      setTotalPages(response?.totalPages)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.warn('fetchTriggerList:', error)
    }
  }

  useEffect(() => {
    fetchTriggerList(searchValue)
  }, [currentPage, limit, sortBy, sortOrder])

  useEffect(() => {
    window.addEventListener('keydown', handleSearchOnKeyPress)
    return () => window.removeEventListener('keydown', handleSearchOnKeyPress)
  }, [])

  const handlePagination = (currentPage, limit = 15) => {
    setCurrentPage(currentPage)
    setLimit(limit)
  }
  const updateTrigger = (id) => {
    getTriggerDetails(id)
    history.push(`${url.triggerUpdate}?id=${id}`)
  }
  const deleteTrigger = (status, id) => {
    setTriggerId(id)
    setShowAction(false)
    setShowDelete(status)
  }

  const handleActionOpen = (status) => {
    setShowAction(status)
  }

  const handleDeleteTrigger = async () => {
    setLoading(true)
    try {
      const response = await TriggerService.deleteTrigger(triggerId)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else addToast(deleteTriggerSuccess, { appearance: 'success' })
      setShowDelete(false)
      fetchTriggerList()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.warn('handleDeleteTrigger:', error)
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
    fetchTriggerList(e.target.value, 1)
  }

  const noResults = () => <Message info content={noDataFound} />

  const renderTriggerTable = () => (
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
                  onClick={() => handleSort('action')}
                  onKeyDown={() => handleSort('action')}
                  className={`sortable ${
                    sortBy === 'action'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'action' ? sortOrder : null}
                >
                  Action Type
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('tag')}
                  onKeyDown={() => handleSort('tag')}
                  className={`sortable ${
                    sortBy === 'tag'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'tag' ? sortOrder : null}
                >
                  Tag
                </Table.HeaderCell>
                <Table.HeaderCell>Count</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            {triggerList?.map((trigger) => {
              const { name, action, tag, id, users } = trigger
              return (
                <Table.Body>
                  <Table.Row>
                    <Table.Cell data-label="Name"> {name} </Table.Cell>
                    <Table.Cell data-label="Action Type">
                      {
                        actionTypeOptions?.filter((d) => d?.value === action)[0]
                          ?.text
                      }
                    </Table.Cell>
                    <Table.Cell data-label="Tag"> {tag} </Table.Cell>
                    <Table.Cell data-label="Tag"> {users?.length} </Table.Cell>
                    <Table.Cell data-label="Action" className="action-col">
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
                                onClick={() => updateTrigger(id)}
                                onKeyDown={() => updateTrigger(id)}
                              >
                                Edit
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => deleteTrigger(true, id)}
                                onKeyDown={() => deleteTrigger(true, id)}
                              >
                                Delete
                              </div>
                            </li>
                          </ul>
                        </div>
                      </Popup>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              )
            })}
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
      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1">Triggers</Header>
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
          <Link to={url.triggerCreate} className="ui button secondary icon">
            <Add />
            Create Trigger
          </Link>
        </div>
      </div>
      {loading || isLoading ? (
        <Loader className="screen-centered" />
      ) : (
        <>
          {triggerList?.length > 0 ? renderTriggerTable() : noResults()}
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
                <Header as="h2">{deleteTriggerMessage}</Header>
              </Modal.Content>
              <Modal.Actions>
                <Button primary onClick={() => handleDeleteTrigger()}>
                  Delete
                </Button>
                <Button secondary onClick={() => deleteTrigger(false)}>
                  Cancel
                </Button>
              </Modal.Actions>
            </Form>
          </Modal>
        </>
      )}
    </div>
  )
}

TriggerList.propTypes = {
  isLoading: propTypes.bool.isRequired,
  addToast: propTypes.func.isRequired,
  getTriggerDetails: propTypes.func.isRequired,
}

export default TriggerList
