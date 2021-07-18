import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import VoucherList from './VoucherList'
import CreateVoucher from './CreateVoucher'
import * as url from '../../../utils/urls'
import * as segmentAction from '../../../redux/actions/SegmentAction'
import { withToast, getParameterByName } from '../../../utils/helper'
import AdminService from '../../../api/services/AdminService'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      voucherDetails: [],
      isLoading: false,
      orgDetails: [],
    }
  }

  componentDidMount() {
    const { segmentList } = this.props
    const voucherId = getParameterByName('id')
    if (voucherId) {
      this.fetchVoucherDetails(voucherId)
    }
    segmentList()
    this.organisationList()
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (prevProps.location.fromSidebar !== location.fromSidebar) {
      this.emptyVoucherDetails()
    }
  }

  emptyVoucherDetails = () => {
    this.setState({
      voucherDetails: [],
    })
  }

  fetchVoucherDetails = async (id) => {
    const { addToast } = this.props
    this.setState({ isLoading: true })
    try {
      const queryParam = `/${id}`
      const response = await AdminService.getSpecificVoucherDetails(queryParam)
      if (response.id) {
        this.setState({
          voucherDetails: response,
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

  switchComponent = (pathname) => {
    const { segment } = this.props
    const { isLoading, voucherDetails, orgDetails } = this.state

    window.scrollTo(0, 0)
    switch (pathname) {
      case url.voucher:
        return (
          <VoucherList
            fetchVoucherDetails={this.fetchVoucherDetails}
            loading={isLoading}
          />
        )
      case url.voucherCreate:
        return (
          <CreateVoucher
            segmentList={segment.segment.list}
            voucherDetails={voucherDetails}
            orgDetails={orgDetails}
            emptyVoucherDetails={this.emptyVoucherDetails}
          />
        )
      case url.voucherUpdate:
        return (
          <CreateVoucher
            orgDetails={orgDetails}
            segmentList={segment.segment.list}
            voucherDetails={voucherDetails}
            emptyVoucherDetails={this.emptyVoucherDetails}
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
    fromSidebar: propTypes.string.isRequired,
  }).isRequired,
  segmentList: propTypes.func.isRequired,
  segment: propTypes.objectOf(propTypes.object).isRequired,
  addToast: propTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  segment: state.segment,
})

export default withToast(connect(mapStateToProps, { ...segmentAction })(index))
