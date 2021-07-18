import React, { Component } from 'react'
import propTypes from 'prop-types'
import MerchantList from './MerchantList'
import CreateMerchant from './CreateMerchant'
import * as url from '../../../utils/urls'
import MerchantService from '../../../api/services/MerchantService'
import { getParameterByName, withToast } from '../../../utils/helper'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      merchantDetails: [],
    }
  }

  componentDidMount() {
    const merchantId = getParameterByName('id')
    if (merchantId) {
      this.fetchMerchantDetails(merchantId)
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (prevProps.location.fromSidebar !== location.fromSidebar) {
      this.emptyMerchantDetails()
    }
  }

  emptyMerchantDetails = () => {
    this.setState({
      merchantDetails: [],
    })
  }

  fetchMerchantDetails = async (id) => {
    const { addToast } = this.props
    this.setState({ isLoading: true })
    try {
      const queryParam = `/${id}`
      const response = await MerchantService.getSpecificMerchantDetails(
        queryParam
      )
      if (response.id) {
        this.setState({
          merchantDetails: response,
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
    const { isLoading, merchantDetails } = this.state
    window.scrollTo(0, 0)
    switch (pathname) {
      case url.merchant:
        return (
          <MerchantList
            loading={isLoading}
            fetchMerchantDetails={this.fetchMerchantDetails}
          />
        )
      case url.merchantCreate:
        return (
          <CreateMerchant
            merchantDetails={merchantDetails}
            emptyMerchantDetails={this.emptyMerchantDetails}
          />
        )
      case url.merchantUpdate:
        return (
          <CreateMerchant
            merchantDetails={merchantDetails}
            emptyMerchantDetails={this.emptyMerchantDetails}
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
}
export default withToast(index)
