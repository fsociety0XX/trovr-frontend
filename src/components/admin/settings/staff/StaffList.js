import React, { useState, useEffect } from 'react'
import { Header, Grid, Modal, Button, Form, Input } from 'semantic-ui-react'
import dayjs from 'dayjs'
import { Link, useHistory } from 'react-router-dom'
import propTypes from 'prop-types'
import AddStaff from '../../../../svgs/AddStaff'
import Edit from '../../../../svgs/Edit'
import Delete from '../../../../svgs/Delete'
import RoundArrow from '../../../../svgs/RoundArrow'
import defaultAvatar from '../../../../assets/images/profile-image.png'
import * as url from '../../../../utils/urls'
import Loader from '../../../../utils/Loader'
import Search from '../../../../svgs/Search'
import { handleSearchOnKeyPress } from '../../../../utils/helper'

const StaffList = (props) => {
  const history = useHistory()
  const {
    fetchStaffList,
    isLoading,
    staffArray,
    totalPages,
    fetchStaffDetail,
    handleDeleteStaff,
    emptyStaffData,
  } = props
  const [showDelete, setShowDelete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [staffData, setStaffData] = useState([])
  const [item, setItem] = useState('')
  const [searchValue, setSearchValue] = useState(null)

  const deleteStaff = (status, id = null) => {
    setShowDelete(status)
    if (id) {
      setItem(id)
    }
  }
  const deleteStaffUser = (id) => {
    setShowDelete(false)
    handleDeleteStaff(id)
  }
  const handlePagination = () => {
    setCurrentPage(currentPage + 1)
  }

  useEffect(() => {
    fetchStaffList(currentPage, searchValue)
  }, [currentPage, searchValue])

  useEffect(() => {
    setStaffData(staffArray)
  }, [staffArray])

  const updateStaff = (id) => {
    fetchStaffDetail(id)
    history.push(`${url.staffUpdate}?id=${id}`)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleSearchOnKeyPress)
    return () => window.removeEventListener('keydown', handleSearchOnKeyPress)
  }, [])

  const handleSearch = (e) => {
    setCurrentPage(1)
    !e.target.value && emptyStaffData()
    setSearchValue(e.target.value ? e.target.value : null)
  }

  return (
    <div className="staff-list-page">
      {isLoading && <Loader className="screen-centered" />}
      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1">Admin Staff</Header>
          <div className="date">
            <span> {`${dayjs().format('dddd')}`}, </span>{' '}
            {`${dayjs().format('D MMMM YYYY')}`}{' '}
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
        </div>
      </div>

      <Grid className="staff-list-wrapper">
        <Grid.Column>
          <Link className="create-admin-card" to={url.staffCreate}>
            <span className="icon-wrapper">
              <AddStaff />
            </span>
            <span className="text">Create new admin</span>
          </Link>
        </Grid.Column>
        {staffData?.map((detail) => (
          <Grid.Column>
            <div className="staff-card">
              <div className="staff-card-inner">
                <div className="staff-image-wrapper">
                  <img
                    src={detail.avatar ? detail.avatar : defaultAvatar}
                    alt="profile"
                  />
                </div>
                <div className="right-column">
                  <div className="name">{`${detail.firstName} ${detail.lastName}`}</div>
                  <div className="email">{detail.email}</div>
                  <div className="user-level">
                    {detail?.role?.[0]?.name === 'systemUser'
                      ? 'System user'
                      : 'System manager'}
                  </div>
                </div>
              </div>
              <div className="btn-wrapper">
                <Button className="edit" onClick={() => updateStaff(detail.id)}>
                  <Edit />
                  Edit
                </Button>
                <Button
                  className="delete"
                  onClick={() => deleteStaff(true, detail.id)}
                >
                  <Delete />
                  Delete
                </Button>
              </div>
            </div>
          </Grid.Column>
        ))}
      </Grid>
      {currentPage !== totalPages && totalPages !== 0 && (
        <div className="read-more-btn-wrapper">
          <Button onClick={handlePagination}>
            Show more
            <RoundArrow />
          </Button>
        </div>
      )}
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
            <Header as="h2">Are you sure you want to delete?</Header>
            <p>The user will not be allowed to use assigned privileges.</p>
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={() => deleteStaffUser(item)}>
              Delete
            </Button>
            <Button secondary onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
    </div>
  )
}

StaffList.propTypes = {
  handleDeleteStaff: propTypes.func.isRequired,
  isLoading: propTypes.bool.isRequired,
  fetchStaffDetail: propTypes.func.isRequired,
  fetchStaffList: propTypes.func.isRequired,
  staffArray: propTypes.arrayOf(propTypes.array).isRequired,
  totalPages: propTypes.string.isRequired,
  emptyStaffData: propTypes.func.isRequired,
}
export default StaffList
