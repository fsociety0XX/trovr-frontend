import React, { Component } from 'react'
import propTypes from 'prop-types'
import StaffList from './StaffList'
import Create from './Create'
import * as url from '../../../../utils/urls'
import AdminService from '../../../../api/services/AdminService'
import { withToast, getParameterByName } from '../../../../utils/helper'

import {
  deleteStaffSucccess,
  updateStaffSuccess,
} from '../../../../utils/messages'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      staffData: [],
      staffDetailbyId: [],
      totalPages: 1,
    }
  }

  componentDidMount() {
    const staffId = getParameterByName('id')

    if (staffId) {
      this.fetchStaffDetail(staffId)
    }
  }

  emptyStaffDetails = () => {
    this.setState({
      staffDetailbyId: [],
      staffData: [],
    })
  }

  switchComponent = (pathname) => {
    const { isLoading, staffData, totalPages, staffDetailbyId } = this.state
    window.scrollTo(0, 0)
    switch (pathname) {
      case url.adminSettings:
        return <StaffList />
      case url.staff:
        return (
          <StaffList
            emptyStaffData={this.emptyStaffData}
            isLoading={isLoading}
            staffArray={staffData}
            totalPages={totalPages}
            fetchStaffList={this.fetchStaffList}
            fetchStaffDetail={this.fetchStaffDetail}
            handleDeleteStaff={this.handleDeleteStaff}
          />
        )
      case url.staffCreate:
        return (
          <Create
            createStaffOnSubmit={this.createStaffOnSubmit}
            isLoading={isLoading}
            staffDetailbyId={staffDetailbyId}
            emptyStaffDetails={this.emptyStaffDetails}
            updateStaffOnSubmit={this.updateStaffOnSubmit}
          />
        )
      case url.staffUpdate:
        return (
          <Create
            createStaffOnSubmit={this.createStaffOnSubmit}
            isLoading={isLoading}
            staffDetailbyId={staffDetailbyId}
            emptyStaffDetails={this.emptyStaffDetails}
            updateStaffOnSubmit={this.updateStaffOnSubmit}
          />
        )
      default:
        return ''
    }
  }

  createStaffOnSubmit = async (data) => {
    try {
      const { addToast, history } = this.props
      this.setState({
        isLoading: true,
      })
      const response = await AdminService.createStaff(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(
          `${
            data.userLevel === 'systemUser' ? 'System user' : 'System manager'
          } created successfully`,
          { appearance: 'success' }
        )
        this.emptyStaffDetails()
        history.push('/admin/settings/staff')
      }
      this.setState({
        isLoading: false,
      })
    } catch (error) {
      console.warn('Create staff(createStaffOnSubmit):', error)
      this.setState({
        isLoading: false,
      })
    }
  }

  updateStaffOnSubmit = async (data, staffId) => {
    try {
      const { addToast, history } = this.props
      const queryParam = `/${staffId}`

      this.setState({
        isLoading: true,
      })
      const response = await AdminService.updateStaff(data, queryParam)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(updateStaffSuccess, { appearance: 'success' })
        this.emptyStaffDetails()

        history.push('/admin/settings/staff')
      }
      this.setState({
        isLoading: false,
      })
    } catch (error) {
      console.warn('Create staff(createStaffOnSubmit):', error)
      this.setState({
        isLoading: false,
      })
    }
  }

  fetchStaffDetail = async (id) => {
    const { addToast } = this.props

    this.setState({
      isLoading: true,
    })

    try {
      const response = await AdminService.fetchStaffDetail(id)
      if (response.id) {
        this.setState({
          staffDetailbyId: response,
        })
      } else {
        addToast(response[0].message, { appearance: 'error' })
      }

      this.setState({
        isLoading: false,
      })
    } catch (e) {
      console.warn('banner ads List:', e)

      this.setState({
        isLoading: false,
      })
    }
  }

  handleDeleteStaff = async (id) => {
    const { addToast } = this.props

    this.setState({
      isLoading: true,
    })
    let response = null
    response = await AdminService.deleteUser(id)

    if (response.length > 0) {
      this.setState({
        isLoading: false,
      })
      addToast(response[0].message, { appearance: 'error' })
    } else {
      this.setState({
        isLoading: false,
        staffData: [],
      })
      addToast(deleteStaffSucccess, { appearance: 'success' })
      this.fetchStaffList(1)
    }
  }

  emptyStaffData = () => {
    this.setState({ staffData: [] })
  }

  fetchStaffList = async (currentPage, search = null) => {
    const { staffData } = this.state
    let queryString = ''

    queryString = `?page=${currentPage}&limit=9${
      search ? `&search=${search}` : ''
    }`

    this.setState({
      isLoading: true,
    })

    try {
      const response = await AdminService.fetchStaffList(queryString)
      this.setState({
        totalPages: response?.totalPages,
      })
      if (search) {
        if (currentPage > 1) {
          this.setState({
            staffData: [...staffData, ...response?.users],
          })
        } else {
          this.setState({
            staffData: response?.users,
          })
        }
      } else if (search === '') {
        this.setState({
          staffData: response?.users,
        })
      } else {
        this.setState({
          staffData: [...staffData, ...response?.users],
        })
      }

      this.setState({
        isLoading: false,
      })
    } catch (e) {
      console.warn('banner ads List:', e)

      this.setState({
        isLoading: false,
      })
    }
  }

  render() {
    const { location } = this.props

    return <div>{this.switchComponent(location.pathname)}</div>
  }
}
index.propTypes = {
  location: propTypes.shape({
    pathname: propTypes.string.isRequired, // shape it as reducer have multiple states which we need to address and this is for object
  }).isRequired,
  history: propTypes.func.isRequired,
  addToast: propTypes.func.isRequired,
}
export default withToast(index)
