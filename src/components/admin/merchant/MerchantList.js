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
import { useToasts } from 'react-toast-notifications'
import dayjs from 'dayjs'
import { Link, useHistory } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Search from '../../../svgs/Search'
import Add from '../../../svgs/Add'
import Dots from '../../../svgs/Dots'
import Delete from '../../../svgs/Delete'
import MerchantService from '../../../api/services/MerchantService'
import CustomPagination from '../../../utils/customPagination'
import Loader from '../../../utils/Loader'
import {
  noDataFound,
  deleteMerchantConfirmation,
  merchantApproveSuccess,
  merchantDeleteSuccess,
} from '../../../utils/messages'
import * as urls from '../../../utils/urls'
import { handleSearchOnKeyPress } from '../../../utils/helper'

const MerchantList = (props) => {
  const roles = ['systemAdmin', 'systemManager']
  const { addToast } = useToasts()
  const history = useHistory()
  const { loading, fetchMerchantDetails } = props
  const [merchantData, setMerchantData] = useState([])
  const [showDelete, setShowDelete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [totalPages, setTotalPages] = useState(1)
  const [showAction, setShowAction] = useState(false)
  const [merchantId, setMerchantId] = useState(null)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const fetchMerchantList = async (search = null, pageNo = null) => {
    const queryString = `?page=${pageNo || currentPage}&limit=${limit}${
      sortBy !== '' ? `&orderBy=${sortBy}:${sortOrder}` : ''
    }${search ? `&search=${search}` : ''}`
    setIsLoading(true)
    try {
      const response = await MerchantService.merchantList(queryString)
      setMerchantData(response?.merchants)
      setTotalPages(response?.totalPages)
      setIsLoading(false)
    } catch (e) {
      console.warn('Merchant List:', e)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMerchantList(searchValue)
  }, [currentPage, limit, sortBy, sortOrder])

  const handleActionOpen = (status) => {
    setShowAction(status)
  }

  const deletemerchant = (status = null, id = null) => {
    setMerchantId(id)
    setShowDelete(status)
    setShowAction(false)
  }

  const handleDeleteMerchant = async () => {
    const queryParam = `/${merchantId}`
    setIsLoading(true)
    try {
      const response = await MerchantService.deleteMerchant(queryParam)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(merchantDeleteSuccess, { appearance: 'success' })
        setShowDelete(false)
        fetchMerchantList()
      }
      setIsLoading(false)
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      setIsLoading(false)
    }
  }

  const handlePagination = (currentPage, limit = 15) => {
    setCurrentPage(currentPage)
    setLimit(limit)
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

  const updateMerchant = (id) => {
    fetchMerchantDetails(id)
    history.push(`${urls.merchantUpdate}?id=${id}`)
  }

  const handleApproveMerchant = async (id) => {
    setIsLoading(true)
    const data = {
      userId: id,
      status: true,
    }
    try {
      const response = await MerchantService.approveMerchant(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(merchantApproveSuccess, { appearance: 'success' })
        fetchMerchantList()
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      addToast(error[0].message, { appearance: 'error' })
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleSearchOnKeyPress)
    return () => window.removeEventListener('keydown', handleSearchOnKeyPress)
  }, [])

  const handleSearch = (e) => {
    setCurrentPage(1)
    setSearchValue(e.target.value)
    fetchMerchantList(e.target.value, 1)
  }

  const noResults = () => <Message info content={noDataFound} />

  const renderMerchantTable = () => (
    <div>
      <div className="table-wrapper">
        <PerfectScrollbar>
          <Table sortable>
            <Table.Header>
              <Table.Row>
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
                  onClick={() => handleSort('OrganisationName')}
                  onKeyDown={() => handleSort('OrganisationName')}
                  className={`sortable ${
                    sortBy === 'OrganisationName'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'OrganisationName' ? sortOrder : null}
                >
                  Company Name
                </Table.HeaderCell>

                <Table.HeaderCell
                  onClick={() => handleSort('OrganisationPrimaryAddress')}
                  onKeyDown={() => handleSort('OrganisationPrimaryAddress')}
                  className={`sortable ${
                    sortBy === 'OrganisationPrimaryAddress'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={
                    sortBy === 'OrganisationPrimaryAddress' ? sortOrder : null
                  }
                >
                  Primary Company Address
                </Table.HeaderCell>

                <Table.HeaderCell
                  onClick={() => handleSort('OrganisationPostcode')}
                  onKeyDown={() => handleSort('OrganisationPostcode')}
                  className={`sortable ${
                    sortBy === 'OrganisationPostcode'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  sorted={sortBy === 'OrganisationPostcode' ? sortOrder : null}
                >
                  Postcode
                </Table.HeaderCell>

                <Table.HeaderCell
                  sorted={sortBy === 'country' ? sortOrder : null}
                  onClick={() => handleSort('country')}
                  className={`sortable ${
                    sortBy === 'country'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  onKeyDown={() => handleSort('country')}
                >
                  Country Location
                </Table.HeaderCell>

                <Table.HeaderCell
                  sorted={sortBy === 'OrganisationTelephone' ? sortOrder : null}
                  onClick={() => handleSort('OrganisationTelephone')}
                  className={`sortable ${
                    sortBy === 'OrganisationTelephone'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  onKeyDown={() => handleSort('OrganisationTelephone')}
                >
                  Primary Company Telephone No.
                </Table.HeaderCell>

                <Table.HeaderCell
                  sorted={
                    sortBy === 'OrganisationDescription' ? sortOrder : null
                  }
                  className={`sortable ${
                    sortBy === 'OrganisationDescription'
                      ? sortOrder === 'ASC'
                        ? 'ascending'
                        : sortOrder === 'DESC'
                        ? 'descending'
                        : ''
                      : ''
                  }`}
                  onClick={() => handleSort('OrganisationDescription')}
                  onKeyDown={() => handleSort('OrganisationDescription')}
                >
                  Company Description
                </Table.HeaderCell>

                <Table.HeaderCell>No. of Branches</Table.HeaderCell>
                {roles.includes(localStorage.getItem('role')) && (
                  <Table.HeaderCell className="action-col">
                    Actions
                  </Table.HeaderCell>
                )}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {merchantData?.map((data) => {
                const { id, email, firstName, lastName, role, status } = data
                const {
                  name,
                  noOfBranch,
                  description,
                  primaryAddress,
                  postcode,
                  country,
                  telephone,
                } = role[0].organisation
                return (
                  <Table.Row key={Math.random()}>
                    <Table.Cell data-label="Email"> {email} </Table.Cell>
                    <Table.Cell data-label="Name">
                      {' '}
                      {`${firstName} ${lastName || ''}`}{' '}
                    </Table.Cell>
                    <Table.Cell data-label="Company Name"> {name} </Table.Cell>
                    <Table.Cell data-label="Primary Company Add.">
                      {primaryAddress}
                    </Table.Cell>
                    <Table.Cell data-label="Postcode">{postcode}</Table.Cell>
                    <Table.Cell data-label="Country Location">
                      {country}
                    </Table.Cell>
                    <Table.Cell data-label="Primary Company Telephone No.">
                      {telephone}
                    </Table.Cell>
                    <Table.Cell data-label="Company Description">
                      {description}
                    </Table.Cell>
                    <Table.Cell data-label="No. of Branches">
                      {noOfBranch}
                    </Table.Cell>
                    {roles.includes(localStorage.getItem('role')) && (
                      <Table.Cell data-label="Actions" className="action-col">
                        <Popup
                          className="action-popup"
                          on="click"
                          open={showAction}
                          onOpen={() => handleActionOpen(this, true)}
                          onClose={() => handleActionOpen(this, false)}
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
                              {!status && (
                                <li>
                                  <div
                                    onClick={() => handleApproveMerchant(id)}
                                    onKeyDown={() => handleApproveMerchant(id)}
                                  >
                                    Approve
                                  </div>
                                </li>
                              )}
                              <li>
                                <div
                                  onClick={() => updateMerchant(id)}
                                  onKeyDown={() => updateMerchant(id)}
                                >
                                  Edit
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => deletemerchant(true, id)}
                                  onKeyDown={() => deletemerchant(true, id)}
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
    </div>
  )

  return (
    <div className="merchant-list-page">
      <>
        <div className="page-header">
          <div className="page-left-header">
            <Header as="h1">Merchant</Header>
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
              to="/admin/merchant/create"
              className="ui button primary icon"
            >
              <Add />
              Create merchant
            </Link>
          </div>
        </div>
        {isLoading || loading ? (
          <Loader className="screen-centered" />
        ) : (
          <>
            {merchantData?.length > 0 ? renderMerchantTable() : noResults()}
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
                  <Header as="h2">{deleteMerchantConfirmation}</Header>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    primary
                    loading={isLoading}
                    onClick={handleDeleteMerchant}
                  >
                    Yes
                  </Button>
                  <Button secondary onClick={() => deletemerchant(false, null)}>
                    No
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
export default MerchantList

MerchantList.propTypes = {
  loading: propTypes.bool.isRequired,
  fetchMerchantDetails: propTypes.func.isRequired,
}
