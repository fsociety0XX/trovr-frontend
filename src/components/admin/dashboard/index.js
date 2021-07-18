import React, { Component } from 'react'
import { Header, Grid, Dropdown } from 'semantic-ui-react'
import dayjs from 'dayjs'
import DashboardBarChart from './DashboardBarChart'
import DashboardService from '../../../api/services/DashboardService'
import { dropdownOptions } from '../../../utils/constants'
import { capitalizeFirstLetter } from '../../../utils/helper'
import Loader from '../../../utils/Loader'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      consumerFilter: 'week',
      consumerData: [],
      loading: false,
      merchantFilter: 'week',
      merchantData: [],
      bottleFilter: 'week',
      bottleData: [],
      voucherFilter: 'week',
      voucherData: [],
      activeConsumerData: [],
      activeConsumerFilter: 'week',
    }
  }

  componentDidMount() {
    this.getConsumerChartdata()
    this.getMerchantChartdata()
    this.getBottleChartdata()
    this.getVoucherChartdata()
    this.getActiveConsumerChartdata()
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      consumerFilter,
      merchantFilter,
      voucherFilter,
      bottleFilter,
      activeConsumerFilter,
    } = this.state
    if (consumerFilter !== prevState.consumerFilter) {
      this.getConsumerChartdata()
    }
    if (merchantFilter !== prevState.merchantFilter) {
      this.getMerchantChartdata()
    }
    if (voucherFilter !== prevState.voucherFilter) {
      this.getVoucherChartdata()
    }
    if (bottleFilter !== prevState.bottleFilter) {
      this.getBottleChartdata()
    }
    if (activeConsumerFilter !== prevState.activeConsumerFilter) {
      this.getActiveConsumerChartdata()
    }
  }

  handleChartFilterChange = (chartType, filter) => {
    if (chartType === 'Consumers') {
      this.setState({ consumerFilter: filter })
    } else if (chartType === 'Voucher redemptions') {
      this.setState({ voucherFilter: filter })
    } else if (chartType === 'Bottle Recycled') {
      this.setState({ bottleFilter: filter })
    } else if (chartType === 'Merchants') {
      this.setState({ merchantFilter: filter })
    } else {
      this.setState({ activeConsumerFilter: filter })
    }
  }

  getActiveConsumerChartdata = async () => {
    const { activeConsumerFilter } = this.state
    const queryParam = `?timeSpan=${activeConsumerFilter}`
    const label = []
    this.setState({
      loading: true,
    })
    try {
      const response = await DashboardService.getActiveConsumerChartdata(
        queryParam
      )
      const data = []
      response?.forEach((result) => {
        data.push(result.count)
      })
      if (response?.length === 7) {
        response?.forEach((result) => {
          label.push(result.title.charAt(0))
        })
      } else {
        response?.forEach((result) => {
          label.push(capitalizeFirstLetter(result.title))
        })
      }
      const activeConsumerChartData = {
        labels: label,
        datasets: [
          {
            label: 'Consumer',
            data,
            backgroundColor: '#66CDEA',
            borderColor: '#C5E8F0',
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      }
      this.setState({
        activeConsumerData: activeConsumerChartData,
        loading: false,
      })
    } catch (e) {
      this.setState({ loading: false })
      console.warn('getActiveConsumerChartData:', e)
    }
  }

  getConsumerChartdata = async () => {
    const { consumerFilter } = this.state
    const queryParam = `?timeSpan=${consumerFilter}`
    const label = []
    this.setState({
      loading: true,
    })
    try {
      const response = await DashboardService.getConsumerChartdata(queryParam)
      const data = []
      response?.forEach((result) => {
        data.push(result.count)
      })
      if (response?.length === 7) {
        response?.forEach((result) => {
          label.push(result.title.charAt(0))
        })
      } else {
        response?.forEach((result) => {
          label.push(capitalizeFirstLetter(result.title))
        })
      }
      const consumerChartData = {
        labels: label,
        datasets: [
          {
            label: 'Consumer',
            data,
            backgroundColor: '#66CDEA',
            borderColor: '#C5E8F0',
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      }
      this.setState({
        consumerData: consumerChartData,
        loading: false,
      })
    } catch (e) {
      this.setState({ loading: false })
      console.warn('getConsumerChartData:', e)
    }
  }

  getMerchantChartdata = async () => {
    const { merchantFilter } = this.state
    const queryParam = `?timeSpan=${merchantFilter}`
    const label = []
    this.setState({
      loading: true,
    })
    try {
      const response = await DashboardService.getMerchantChartdata(queryParam)
      const data = []
      response?.forEach((result) => {
        data.push(result.count)
      })
      if (response?.length === 7) {
        response?.forEach((result) => {
          label.push(result.title.charAt(0))
        })
      } else {
        response?.forEach((result) => {
          label.push(capitalizeFirstLetter(result.title))
        })
      }
      const merchantChartData = {
        labels: label,
        datasets: [
          {
            label: 'Merchant',
            data,
            backgroundColor: '#66CDEA',
            borderColor: '#C5E8F0',
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      }
      this.setState({
        merchantData: merchantChartData,
        loading: false,
      })
    } catch (e) {
      this.setState({ loading: false })
      console.warn('getMerchantChartdata:', e)
    }
  }

  getBottleChartdata = async () => {
    const { bottleFilter } = this.state
    const queryParam = `?timeSpan=${bottleFilter}`
    const label = []
    this.setState({
      loading: true,
    })
    try {
      const response = await DashboardService.getRecycledBottleChartdata(
        queryParam
      )
      const data = []
      response?.forEach((result) => {
        data.push(result.count)
      })
      if (response?.length === 7) {
        response?.forEach((result) => {
          label.push(result.title.charAt(0))
        })
      } else {
        response?.forEach((result) => {
          label.push(capitalizeFirstLetter(result.title))
        })
      }
      const bottleChartData = {
        labels: label,
        datasets: [
          {
            label: 'Bottle',
            data,
            backgroundColor: '#66CDEA',
            borderColor: '#C5E8F0',
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      }
      this.setState({
        bottleData: bottleChartData,
        loading: false,
      })
    } catch (e) {
      this.setState({ loading: false })
      console.warn('bottleChartData:', e)
    }
  }

  getVoucherChartdata = async () => {
    const { voucherFilter } = this.state
    const queryParam = `?timeSpan=${voucherFilter}`
    const label = []
    this.setState({
      loading: true,
    })
    try {
      const response = await DashboardService.getRedemptionChartdata(queryParam)
      const data = []
      response?.forEach((result) => {
        data.push(result.count)
      })
      if (response?.length === 7) {
        response?.forEach((result) => {
          label.push(result.title.charAt(0))
        })
      } else {
        response?.forEach((result) => {
          label.push(capitalizeFirstLetter(result.title))
        })
      }
      const voucherChartData = {
        labels: label,
        datasets: [
          {
            label: 'Voucher',
            data,
            backgroundColor: '#66CDEA',
            borderColor: '#C5E8F0',
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      }
      this.setState({
        voucherData: voucherChartData,
        loading: false,
      })
    } catch (e) {
      this.setState({ loading: false })
      console.warn('voucherChartData:', e)
    }
  }

  render() {
    const {
      loading,
      consumerData,
      merchantData,
      bottleData,
      voucherData,
      activeConsumerData,
    } = this.state
    return (
      <div className="admin-dashboard-page">
        {loading && <Loader className="screen-centered" />}
        <div className="page-header">
          <div className="page-left-header">
            <Header as="h1">Dashboard</Header>
            <div className="date">
              <span> {`${dayjs().format('dddd')}`}, </span>{' '}
              {`${dayjs().format('D MMMM YYYY')}`}
            </div>
          </div>
        </div>

        <Grid columns="2">
          <Grid.Column>
            <DashboardBarChart
              datasetLabel="Consumer"
              chartData={consumerData}
              yAxesLabel="Number of New Consumers"
              xAxesLabel="Duration"
              dropdownOptions={dropdownOptions}
              handleChartFilterChange={this.handleChartFilterChange}
              title="Consumers"
            />
          </Grid.Column>

          <Grid.Column>
            <DashboardBarChart
              datasetLabel="Consumer"
              chartData={activeConsumerData}
              yAxesLabel="Number of Active Consumers"
              xAxesLabel="Duration"
              dropdownOptions={dropdownOptions}
              handleChartFilterChange={this.handleChartFilterChange}
              title="Active Consumers"
            />
          </Grid.Column>

          <Grid.Column>
            <DashboardBarChart
              datasetLabel="Merchant"
              chartData={merchantData}
              yAxesLabel="Number of New Merchants"
              xAxesLabel="Duration"
              dropdownOptions={dropdownOptions}
              handleChartFilterChange={this.handleChartFilterChange}
              title="Merchants"
            />
          </Grid.Column>

          <Grid.Column>
            <DashboardBarChart
              datasetLabel="Bottle"
              chartData={bottleData}
              yAxesLabel="Number of Bottles Recycled"
              xAxesLabel="Duration"
              dropdownOptions={dropdownOptions}
              handleChartFilterChange={this.handleChartFilterChange}
              title="Bottle Recycled"
            />
          </Grid.Column>

          <Grid.Column>
            <DashboardBarChart
              datasetLabel="Voucher"
              chartData={voucherData}
              yAxesLabel="Number of New Redemptions"
              xAxesLabel="Duration"
              dropdownOptions={dropdownOptions}
              handleChartFilterChange={this.handleChartFilterChange}
              title="Voucher redemptions"
            />
          </Grid.Column>

          <Grid.Column>
            <div className="header-with-filter">
              <div className="title">DRS</div>
              <Dropdown
                options={dropdownOptions}
                placeholder="last week"
                fluid
                selection
              />
            </div>
            <div className="card-content tbd-card">TBD</div>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}
export default index
