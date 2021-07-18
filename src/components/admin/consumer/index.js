/* eslint no-param-reassign: ["error", { "props": false }] */
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import ConsumerList from './ConsumerList'
import CreateConsumer from './CreateConsumer'
import ConsumerHistory from './ConsumerHistory'
import { withToast, getParameterByName } from '../../../utils/helper'
import * as loginAction from '../../../redux/actions/loginAction'
import * as segmentAction from '../../../redux/actions/SegmentAction'
import * as url from '../../../utils/urls'
import Segment from './segment'
import AdminService from '../../../api/services/AdminService'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      consumerDetails: [],
      consumerHistoryDetails: [],
      consuemrHistoryDownloadDetails: [],
      totalPages: 1,
    }
  }

  componentDidMount() {
    const { countryList, userLoginInfo, segmentList } = this.props
    const consumerId = getParameterByName('id')
    if (userLoginInfo.countryList.length === 0) {
      countryList()
    }
    segmentList()
    if (consumerId) {
      this.fetchConsumerDetails(consumerId)
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (prevProps.location.fromSidebar !== location.fromSidebar) {
      this.emptyConsumerDetails()
    }
  }

  emptyConsumerDetails = () => {
    this.setState({
      consumerDetails: [],
    })
  }

  fetchConsumerDetails = async (id) => {
    const { addToast } = this.props
    this.setState({ isLoading: true })
    try {
      const queryParam = `/${id}`
      const response = await AdminService.getSpecificConsumerDetails(queryParam)
      if (response.id) {
        this.setState({
          consumerDetails: response,
        })
      } else {
        addToast(response[0].message, { appearance: 'error' })
      }
      this.setState({ isLoading: false })
    } catch (err) {
      addToast(err[0].message, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  fetchAllConsumerHistory = async (data) => {
    const { addToast } = this.props
    delete data.page
    delete data.limit
    this.setState({ isLoading: true })
    try {
      const response = await AdminService.fetchConsumerHistory(data)
      if (response.history) {
        this.setState({
          consuemrHistoryDownloadDetails: response.history,
        })
      } else {
        addToast(response[0].message, { appearance: 'error' })
      }
      this.setState({ isLoading: false })
    } catch (err) {
      addToast(err[0].message, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  fetchConsumerHistory = async (queryParam) => {
    const { addToast } = this.props

    this.setState({ isLoading: true })
    try {
      const response = await AdminService.fetchConsumerHistory(queryParam)
      if (response.history) {
        this.setState({
          consumerHistoryDetails: response.history,
          totalPages: response?.totalPages,
        })
      } else {
        addToast(response[0].message, { appearance: 'error' })
      }
      this.setState({ isLoading: false })
    } catch (err) {
      addToast(err[0].message, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  switchComponent = (pathname) => {
    const { addToast, userLoginInfo, segment, segmentList } = this.props
    const {
      consumerDetails,
      isLoading,
      consumerHistoryDetails,
      consuemrHistoryDownloadDetails,
      totalPages,
    } = this.state

    window.scrollTo(0, 0)
    switch (pathname) {
      case url.consumer:
        return (
          <ConsumerList
            fetchConsumerDetails={this.fetchConsumerDetails}
            segmentDetail={segment.segment.list}
            segmentList={segmentList}
            loading={isLoading}
          />
        )
      case url.consumerCreate:
        return (
          <CreateConsumer
            addToast={addToast}
            ConsumerList={consumerDetails}
            countryList={userLoginInfo.countryList}
            segmentList={segment.segment.list}
            emptyConsumerDetails={this.emptyConsumerDetails}
          />
        )
      case url.consumerHistory:
        return (
          <ConsumerHistory
            fetchAllConsumerHistory={this.fetchAllConsumerHistory}
            consuemrHistoryDownloadDetails={consuemrHistoryDownloadDetails}
            consumerHistoryDetails={consumerHistoryDetails}
            totalPages={totalPages}
            loading={isLoading}
            fetchConsumerHistory={this.fetchConsumerHistory}
          />
        )
      case url.consumerUpdate:
        return (
          <CreateConsumer
            addToast={addToast}
            ConsumerList={consumerDetails}
            countryList={userLoginInfo.countryList}
            segmentList={segment.segment.list}
            emptyConsumerDetails={this.emptyConsumerDetails}
          />
        )

      case url.segment:
        return <Segment />

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
    fromSidebar: propTypes.string.isRequired,
  }).isRequired,
  addToast: propTypes.func.isRequired,
  countryList: propTypes.func.isRequired,
  segmentList: propTypes.func.isRequired,
  userLoginInfo: propTypes.objectOf(propTypes.object).isRequired,
  segment: propTypes.objectOf(propTypes.object).isRequired,
}

const mapStateToProps = (state) => ({
  userLoginInfo: state.userLoginInfo,
  segment: state.segment,
})

export default withToast(
  connect(mapStateToProps, { ...loginAction, ...segmentAction })(index)
)
