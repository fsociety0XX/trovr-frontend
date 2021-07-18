import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import * as url from '../../../../utils/urls'
import BannerAdList from './BannerAdList'
import CreateBannerAd from './CreateBannerAd'
import * as segmentAction from '../../../../redux/actions/SegmentAction'
import CMSService from '../../../../api/services/CMSService'
import { getParameterByName } from '../../../../utils/helper'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      adDetails: [],
    }
  }

  componentDidMount() {
    const bannerAdId = getParameterByName('id')
    const { segmentList } = this.props
    segmentList()
    if (bannerAdId) {
      this.fetchBannerAdDetails(bannerAdId)
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (prevProps.location.fromSidebar !== location.fromSidebar) {
      this.emptyBannerDetails()
    }
  }

  emptyBannerDetails = () => {
    this.setState({
      adDetails: [],
    })
  }

  fetchBannerAdDetails = async (id) => {
    const { addToast } = this.props
    this.setState({ isLoading: true })
    try {
      const queryParam = `/${id}`
      const response = await CMSService.getSpecificAdDetails(queryParam)
      if (response.id) {
        this.setState({
          adDetails: response,
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
    const { segment } = this.props
    const { isLoading, adDetails } = this.state

    window.scrollTo(0, 0)
    switch (pathname) {
      case url.banner:
        return (
          <BannerAdList
            fetchBannerAdDetails={this.fetchBannerAdDetails}
            loading={isLoading}
          />
        )

      case url.bannerCreate:
        return (
          <CreateBannerAd
            segmentDetail={segment.segment.list}
            adDetails={adDetails}
            emptyBannerDetails={this.emptyBannerDetails}
          />
        )
      case url.bannerUpdate:
        return (
          <CreateBannerAd
            segmentDetail={segment.segment.list}
            adDetails={adDetails}
            emptyBannerDetails={this.emptyBannerDetails}
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
  addToast: propTypes.func.isRequired,
  segmentList: propTypes.func.isRequired,
  segment: propTypes.objectOf(propTypes.object).isRequired,
}
const mapStateToProps = (state) => ({
  segment: state.segment,
})
export default connect(mapStateToProps, { ...segmentAction })(index)
