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
import { Link, useHistory, useLocation } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useToasts } from 'react-toast-notifications'
import CustomPagination from '../../../utils/customPagination'
import { noDataFound } from '../../../utils/messages'
import Loader from '../../../utils/Loader'
import Add from '../../../svgs/Add'
import Dots from '../../../svgs/Dots'
import Delete from '../../../svgs/Delete'
import Image from '../../../svgs/Image'
import Location from '../../../svgs/Location'
import AdminService from '../../../api/services/AdminService'
import * as urls from '../../../utils/urls'
import { handleSearchOnKeyPress } from '../../../utils/helper'
import { imageURLRegx } from '../../../utils/constants'
import Search from '../../../svgs/Search'

const VoucherList = (props) => {
  const roles = ['systemAdmin', 'systemManager']
  const { addToast } = useToasts()
  const history = useHistory()
  const location = useLocation()
  const { fetchVoucherDetails, loading } = props
  const [voucherData, setVoucherData] = useState([])
  const [showAction, setShowAction] = React.useState(false)
  const [limit, setLimit] = useState(15)
  const [showDelete, setShowDelete] = React.useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [item, setItem] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(
    location.state !== undefined ? location.state.page : 1
  )
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const handleActionOpen = (status) => {
    setShowAction(status)
  }
  const deleteVoucher = (status, id = null) => {
    setItem(id)
    setShowAction(false)
    setShowDelete(status)
  }
  const updateVoucher = (id) => {
    fetchVoucherDetails(id)
    //   history.push({
    //     pathname: `${urls.voucherUpdate}?id=${id}`,
    //    // state: { page: currentPage }
    // });
    history.push(`${urls.voucherUpdate}?id=${id}`, { page: currentPage })
  }
  const handlePagination = (page, recordLimit = 15) => {
    setCurrentPage(page)
    setLimit(recordLimit)
  }
  const noResults = () => <Message info content={noDataFound} />

  const fetchVoucherList = async (search = null, pageNo = null) => {
    const queryString = `?page=${pageNo || currentPage}&limit=${limit}${
      sortBy !== '' ? `&orderBy=${sortBy}:${sortOrder}` : ''
    }`
    const obj = {
      frequentlyUsed: false,
    }
    search && Object.assign(obj, { search })
    setIsLoading(true)

    try {
      const response = await AdminService.voucherList(queryString, obj)

      setVoucherData(response?.vouchers)

      setTotalPages(response?.totalPages)

      setIsLoading(false)
    } catch (e) {
      console.warn('Merchant List:', e)

      setIsLoading(false)
    }
  }
  const handleVoucherStatus = async (id, status) => {
    setIsLoading(true)
    const obj = {
      voucherId: id,
      type: status,
    }
    let response = null
    const message =
      status === 'active'
        ? 'approved'
        : status === 'inactive'
        ? 'rejected'
        : status === 'pause'
        ? 'paused'
        : 'restarted'

    response = await AdminService.updateVoucherStatus(obj)
    if (response.length > 0) {
      setIsLoading(false)
      setShowAction(false)
      addToast(response[0]?.message, { appearance: 'error' })
    } else {
      setIsLoading(false)
      setShowAction(false)
      addToast(`Voucher ${message} successfully`, { appearance: 'success' })
      fetchVoucherList()
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
      setSortOrder('DESC')
    }
  }
  useEffect(() => {
    fetchVoucherList(searchValue)
  }, [currentPage, limit, sortBy, sortOrder])

  const handleDeleteVoucher = async (id) => {
    setIsLoading(true)
    let response = null
    response = await AdminService.deleteVoucher(id)

    if (response.length > 0) {
      setIsLoading(false)
      setShowDelete(false)
      addToast(response[0]?.message, { appearance: 'error' })
    } else {
      setIsLoading(false)
      setShowDelete(false)
      addToast('Voucher deleted successfully', { appearance: 'success' })
      fetchVoucherList()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleSearchOnKeyPress)
    return () => window.removeEventListener('keydown', handleSearchOnKeyPress)
  }, [])

  const handleSearch = (e) => {
    setCurrentPage(1)
    setSearchValue(e.target.value)
    fetchVoucherList(e.target.value)
  }

  const tableRows = () => (
    <>
      <div className="table-wrapper">
        <PerfectScrollbar>
          <Table sortable>
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
                  onClick={() => handleSort('startedAt')}
                  onKeyDown={() => handleSort('startedAt')}
                  className={`sortable ${
                    sortBy === 'startedAt'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'startedAt' ? sortOrder : null}
                >
                  Duration
                </Table.HeaderCell>
                <Table.HeaderCell>Image</Table.HeaderCell>
                <Table.HeaderCell
                  onClick={() => handleSort('quantity')}
                  onKeyDown={() => handleSort('quantity')}
                  className={`sortable ${
                    sortBy === 'quantity'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'quantity' ? sortOrder : null}
                >
                  Quantity
                </Table.HeaderCell>
                <Table.HeaderCell>Segment</Table.HeaderCell>
                <Table.HeaderCell>Pinned Locations</Table.HeaderCell>
                {roles.includes(localStorage.getItem('role')) && (
                  <Table.HeaderCell className="action-col">
                    Actions
                  </Table.HeaderCell>
                )}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {voucherData?.map((detail) => {
                let segmentString = ''
                detail?.voucherSegment.forEach((segment, key) => {
                  segmentString +=
                    key === 0 ? segment.name : `, ${segment.name}`
                })
                const status = detail.status ? 'Pause' : 'Restart'
                return (
                  <Table.Row>
                    <Table.Cell data-label="Name">{detail.name}</Table.Cell>
                    <Table.Cell
                      className="voucher-description"
                      data-label="Description"
                    >
                      {detail.description}
                    </Table.Cell>
                    <Table.Cell data-label="Type">{detail.type}</Table.Cell>
                    <Table.Cell data-label="Duration">
                      <div className="duration">
                        {`${dayjs(detail.startedAt).format(
                          'DD/MM/YY'
                        )} - ${dayjs(detail.expiredAt).format('DD/MM/YY')}`}
                      </div>
                    </Table.Cell>
                    <Table.Cell data-label="Image">
                      <div className="icon">
                        {detail.image && imageURLRegx.test(detail.image) ? (
                          <img src={detail.image} alt="Profile" />
                        ) : (
                          <Image />
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell data-label="Quantity">
                      {detail.quantity}
                    </Table.Cell>
                    <Table.Cell data-label="Segment">
                      <div className="table-segment-data">{segmentString}</div>
                    </Table.Cell>
                    <Table.Cell data-label="Pinned Locations">
                      <div className="icon-wrapper">
                        <div className="icon">
                          <Location />
                        </div>
                        {detail.voucherAvailability.length}
                      </div>
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
                              {detail.isPending || detail.isApproved ? (
                                <li>
                                  <div
                                    onClick={() => updateVoucher(detail.id)}
                                    onKeyDown={() => updateVoucher(detail.id)}
                                  >
                                    Edit
                                  </div>
                                </li>
                              ) : (
                                ''
                              )}
                              <li>
                                <div
                                  onClick={() => deleteVoucher(true, detail.id)}
                                  onKeyDown={() =>
                                    deleteVoucher(true, detail.id)
                                  }
                                >
                                  Delete
                                </div>
                              </li>

                              {detail.isPending ? (
                                <>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleVoucherStatus(detail.id, 'active')
                                      }
                                      onKeyDown={() =>
                                        handleVoucherStatus(detail.id, 'active')
                                      }
                                    >
                                      Approve
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleVoucherStatus(
                                          detail.id,
                                          'inactive'
                                        )
                                      }
                                      onKeyDown={() =>
                                        handleVoucherStatus(
                                          detail.id,
                                          'inactive'
                                        )
                                      }
                                    >
                                      Reject
                                    </div>
                                  </li>
                                </>
                              ) : (
                                ''
                              )}
                              {detail.isApproved && (
                                <li>
                                  <div
                                    onClick={() =>
                                      handleVoucherStatus(
                                        detail.id,
                                        status.toLowerCase()
                                      )
                                    }
                                    onKeyDown={() =>
                                      handleVoucherStatus(
                                        detail.id,
                                        status.toLowerCase()
                                      )
                                    }
                                  >
                                    {status}
                                  </div>
                                </li>
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
          <Header as="h1">Voucher</Header>
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
          <Link
            to={{
              pathname: '/admin/voucher/create',
              state: { page: currentPage },
            }}
            className="ui button secondary icon"
          >
            <Add />
            Create voucher
          </Link>
        </div>
      </div>
      <div className="voucher-list-page">
        {(isLoading || loading) && <Loader className="screen-centered" />}

        {voucherData?.length > 0 ? tableRows() : !isLoading ? noResults() : ''}

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
                Are you sure you want to delete the voucher?
              </Header>
            </Modal.Content>
            <Modal.Actions>
              <Button primary onClick={() => handleDeleteVoucher(item)}>
                Delete
              </Button>
              <Button secondary onClick={() => deleteVoucher(false)}>
                Cancel
              </Button>
            </Modal.Actions>
          </Form>
        </Modal>
      </div>
    </>
  )
}
export default VoucherList
VoucherList.propTypes = {
  loading: propTypes.bool.isRequired,
  fetchVoucherDetails: propTypes.func.isRequired,
}
