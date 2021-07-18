/* eslint no-param-reassign: ["error", { "props": false }] */
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import TransactionReport from './TransactionReport'
import VoucherRedemptionReport from './VoucherRedemptionReport'
import * as url from '../../../utils/urls'
import AdminService from '../../../api/services/AdminService'
import { withToast } from '../../../utils/helper'
import * as segmentAction from '../../../redux/actions/SegmentAction'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      voucherReedemptionDetails: [],
      voucherReedemptionDownloadDetails: [],
      totalPages: 1,
      orgDetails: [],
    }
  }

  componentDidMount() {
    const { segmentList } = this.props
    segmentList()
    this.organisationList()
  }

  fetchAllVoucherReedemption = async (data) => {
    const { addToast } = this.props
    delete data.page
    delete data.limit
    this.setState({ isLoading: true })
    try {
      const response = await AdminService.fetchVoucherReedemption(data)
      if (response.results) {
        this.setState({
          voucherReedemptionDownloadDetails: response.results,
        })
      } else {
        addToast(response[0]?.message, { appearance: 'error' })
      }
      this.setState({ isLoading: false })
    } catch (err) {
      addToast(err[0]?.message, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  organisationList = async () => {
    const { addToast } = this.props
    this.setState({ isLoading: true })
    try {
      const response = await AdminService.organisationList()
      if (response[0]?.message) {
        addToast(response[0]?.message, { appearance: 'error' })
      } else {
        this.setState({
          orgDetails: response,
        })
      }
      this.setState({ isLoading: false })
    } catch (err) {
      addToast(err[0]?.message, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  fetchVoucherReedemption = async (queryParam) => {
    const { addToast } = this.props

    this.setState({ isLoading: true })
    try {
      const response = await AdminService.fetchVoucherReedemption(queryParam)
      if (response.results) {
        this.setState({
          voucherReedemptionDetails: response.results,
          totalPages: response?.totalPages,
        })
      } else {
        addToast(response[0]?.message, { appearance: 'error' })
      }
      this.setState({ isLoading: false })
    } catch (err) {
      addToast(err[0]?.message, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  switchComponent = (pathname) => {
    const {
      isLoading,
      voucherReedemptionDetails,
      voucherReedemptionDownloadDetails,
      totalPages,
      orgDetails,
    } = this.state
    const { segment } = this.props

    window.scrollTo(0, 0)
    switch (pathname) {
      case url.voucherRedemptionReport:
        return (
          <VoucherRedemptionReport
            loading={isLoading}
            fetchVoucherReedemption={this.fetchVoucherReedemption}
            voucherReedemptionDownloadDetails={
              voucherReedemptionDownloadDetails
            }
            voucherReedemptionDetails={voucherReedemptionDetails}
            totalPages={totalPages}
            orgDetails={orgDetails}
            segmentList={segment.segment.list}
            fetchAllVoucherReedemption={this.fetchAllVoucherReedemption}
          />
        )
      case url.transactionReport:
        return <TransactionReport loading={isLoading} />

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
  addToast: propTypes.func.isRequired,
  segmentList: propTypes.func.isRequired,
  segment: propTypes.objectOf(propTypes.object).isRequired,
}
const mapStateToProps = (state) => ({
  segment: state.segment,
})

export default withToast(connect(mapStateToProps, { ...segmentAction })(index))
