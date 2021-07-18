import React, { Component } from 'react'
import propTypes from 'prop-types'
import TriggerList from './TriggerList'
import CreateTrigger from './CreateTrigger'
import * as url from '../../../../utils/urls'
import TriggerService from '../../../../api/services/TriggerService'
import { withToast, getParameterByName } from '../../../../utils/helper'
import {
  createTriggerSuccess,
  updateTriggerSuccess,
} from '../../../../utils/messages'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      triggerDetails: null,
    }
  }

  componentDidMount() {
    const triggerId = getParameterByName('id')
    if (triggerId) {
      this.getTriggerDetails(triggerId)
    }
  }

  getTriggerDetails = async (id) => {
    this.setState({ isLoading: true })
    try {
      const response = await TriggerService.fetchTriggerDetail(id)
      this.setState({ triggerDetails: response })
      this.setState({ isLoading: false })
    } catch (error) {
      this.setState({ isLoading: false })
      console.warn('getTriggerDetails', error)
    }
  }

  emptyTriggerDetails = () => {
    this.setState({ triggerDetails: null })
  }

  createTrigger = async (data) => {
    const { addToast, history } = this.props
    this.setState({ isLoading: true })
    try {
      const response = await TriggerService.createTrigger(data)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else addToast(createTriggerSuccess, { appearance: 'success' })
      history.push(url.trigger)
      this.setState({ isLoading: false })
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  updateTrigger = async (data, id) => {
    const { addToast, history } = this.props
    this.setState({ isLoading: true })
    try {
      const response = await TriggerService.updateTrigger(data, id)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(updateTriggerSuccess, { appearance: 'success' })
        this.emptyTriggerDetails()
      }
      history.push(url.trigger)
      this.setState({ isLoading: false })
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      this.setState({ isLoading: false })
    }
  }

  switchComponent = (pathname) => {
    const { addToast } = this.props
    const { isLoading, triggerDetails } = this.state

    window.scrollTo(0, 0)
    switch (pathname) {
      case url.trigger:
        return (
          <TriggerList
            isLoading={isLoading}
            addToast={addToast}
            getTriggerDetails={this.getTriggerDetails}
          />
        )
      case url.triggerCreate:
      case url.triggerUpdate:
        return (
          <CreateTrigger
            isLoading={isLoading}
            triggerDetails={triggerDetails}
            emptyTriggerDetails={this.emptyTriggerDetails}
            createTrigger={this.createTrigger}
            updateTrigger={this.updateTrigger}
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
  addToast: propTypes.func.isRequired,
  history: propTypes.func.isRequired,
  location: propTypes.shape({
    pathname: propTypes.string.isRequired, // shape it as reducer have multiple states which we need to address and this is for object
  }).isRequired,
}

export default withToast(index)
