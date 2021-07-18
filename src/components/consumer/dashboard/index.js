import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import Card from './Card'
import Advertisement from './Advertisement'
import CreditGraph from '../common/CreditGraph'
import Transactions from '../common/Transactions'
import RewardList from '../rewards'
import DashboardService from '../../../api/services/DashboardService'
import Loader from '../../../utils/Loader'
import * as url from '../../../utils/urls'
import { withToast } from '../../../utils/helper'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      pointBalance: 0,
      cashBalance: 0,
      spentPoints: 0,
      earnedCash: 0,
      totalEarnedPoints: 0,
      bannerList: [],
    }
  }

  componentDidMount() {
    this.getScanPoints()
    this.getConsumerBannerList()
  }

  getConsumerBannerList = async () => {
    this.setState({ isLoading: true })
    try {
      const response = await DashboardService.fetchConsumerBannerList()
      if (response?.[0]?.message) {
        return
      } else {
        this.setState({
          bannerList: response,
        })
      }
      this.setState({ isLoading: false })
    } catch (err) {
      this.setState({ isLoading: false })
      console.warn('Consumer Dashboard(getConsumerBannerList):', err)
    }
  }

  getScanPoints = async () => {
    this.setState({ isLoading: true })
    try {
      const response = await DashboardService.fetchScanPoints()
      const { earnCash, earnPoints, redeemCash, redeemPoints } = response
      this.setState({
        pointBalance: earnPoints - redeemPoints,
        cashBalance: earnCash - redeemCash,
        spentPoints: redeemPoints,
        earnedCash: redeemCash,
        totalEarnedPoints: earnPoints,
      })
      this.setState({ isLoading: false })
    } catch (err) {
      this.setState({ isLoading: false })
      console.warn('Consumer Dashboard(getScanPoints):', err)
    }
  }

  render() {
    const {
      pointBalance,
      isLoading,
      bannerList,
      totalEarnedPoints,
      cashBalance,
      spentPoints,
      earnedCash,
    } = this.state
    return (
      <>
        <div className="consumer-dashboard container" id="consumer-dashboard">
          <Grid columns={2} stackable doubling>
            <Grid.Column width={11}>
              {isLoading ? (
                <div className="loader-wrapper">
                  <Loader active className="section-centered" />
                </div>
              ) : (
                <>
                  <Card
                    pointBalance={pointBalance}
                    cashBalance={cashBalance}
                    spentPoints={spentPoints}
                    earnedCash={earnedCash}
                  />
                  {bannerList?.length ? (
                    <Advertisement bannerList={bannerList} />
                  ) : (
                    ''
                  )}
                </>
              )}

              <Grid columns={2} className="rewards-columns">
                <Grid.Column>
                  <RewardList
                    columns={1}
                    noOfItems={2}
                    seemore={url.rewards}
                    location="dashboard"
                    isFav={false}
                  />
                </Grid.Column>
                <Grid.Column>
                  <RewardList
                    columns={1}
                    noOfItems={2}
                    seemore={url.wallet}
                    location="dashboard"
                    isFav
                  />
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column width={5}>
              <Grid columns={1}>
                <Grid.Column>
                  {isLoading ? (
                    <div className="loader-wrapper">
                      <Loader active className="section-centered" />
                    </div>
                  ) : (
                    <CreditGraph
                      spentPoints={spentPoints}
                      totalEarnedPoints={totalEarnedPoints}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  <Transactions />
                </Grid.Column>
              </Grid>
            </Grid.Column>
          </Grid>
        </div>
      </>
    )
  }
}

export default withToast(index)
