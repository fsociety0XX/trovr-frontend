import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import UserAlertList from './UserAlertList'
import CreateUserAlert from './CreateUserAlert'
import * as url from '../../../../utils/urls'
import * as loginAction from '../../../../redux/actions/loginAction'
import * as segmentAction from '../../../../redux/actions/SegmentAction'
import NotificationService from '../../../../api/services/NotificationService'
import { withToast, getParameterByName } from '../../../../utils/helper'
import {
  createNotificationSuccess,
  updateNotificationSuccess,
} from '../../../../utils/messages'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      notificationDetails: null,
    }
  }

  componentDidMount() {
    const { countryList, userLoginInfo, segmentList } = this.props
    const notificationId = getParameterByName('id')
    if (notificationId) {
      this.getNotificationDetails(notificationId)
    }
    segmentList()
    if (userLoginInfo.countryList.length === 0) {
      countryList()
    }
  }

  getNotificationDetails = async (id) => {
    this.setState({ isLoading: true })
    try {
      const response = await NotificationService.fetchNotificationDetail(id)
      this.setState({ notificationDetails: response })
      this.setState({ isLoading: false })
    } catch (error) {
      this.setState({ isLoading: false })
      console.warn('getNotificationDetails', error)
    }
  }

  emptyAlertDetails = () => {
    this.setState({ notificationDetails: null })
  }

  createNotification = async (data) => {
    const { addToast, history } = this.props
    this.setState({ isLoading: true })
    try {
      const response = await NotificationService.createNotification(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else addToast(createNotificationSuccess, { appearance: 'success' })
      history.push(url.userAlert)
      this.setState({ isLoading: false })
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  updateNotification = async (data, id) => {
    const { addToast, history } = this.props
    this.setState({ isLoading: true })
    try {
      const response = await NotificationService.updateNotification(data, id)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(updateNotificationSuccess, { appearance: 'success' })
        this.emptyAlertDetails()
      }
      history.push(url.userAlert)
      this.setState({ isLoading: false })
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  switchComponent = (pathname) => {
    const { userLoginInfo, segment, addToast } = this.props
    const { isLoading, notificationDetails } = this.state
    window.scrollTo(0, 0)
    switch (pathname) {
      case url.userAlert:
        return (
          <UserAlertList
            isLoading={isLoading}
            addToast={addToast}
            getNotificationDetails={this.getNotificationDetails}
          />
        )
      case url.userAlertCreate:
      case url.userAlertUpdate:
        return (
          <CreateUserAlert
            isLoading={isLoading}
            notificationDetails={notificationDetails}
            emptyAlertDetails={this.emptyAlertDetails}
            createNotification={this.createNotification}
            updateNotification={this.updateNotification}
            countryList={userLoginInfo.countryList}
            segmentList={segment.segment.list}
          />
        )
      default:
        return ''
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
  segment: propTypes.objectOf(propTypes.object).isRequired,
  userLoginInfo: propTypes.objectOf(propTypes.object).isRequired,
  countryList: propTypes.func.isRequired,
  segmentList: propTypes.func.isRequired,
  addToast: propTypes.func.isRequired,
  history: propTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  userLoginInfo: state.userLoginInfo,
  segment: state.segment,
})

export default withToast(
  connect(mapStateToProps, { ...loginAction, ...segmentAction })(index)
)
