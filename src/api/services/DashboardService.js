import api from '../index'

class DashboardService {
  static fetchScanPoints = async () =>
    api({
      method: 'GET',
      endpoint: '/scan/dashboard',
      usingAuthToken: true,
    })

  static fetchConsumerBannerList = async () =>
    api({
      method: 'GET',
      endpoint: '/ads/consumerBanner',
      usingAuthToken: true,
    })

  static adsImpression = async (data) =>
    api({
      method: 'POST',
      endpoint: '/ads/impression',
      usingAuthToken: true,
      data,
    })

  static getConsumerChartdata = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/dashBoard/consumer',
      usingAuthToken: true,
      queryParam,
    })

  static getRedemptionChartdata = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/dashBoard/redemptions',
      usingAuthToken: true,
      queryParam,
    })

  static getMerchantChartdata = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/dashBoard/merchant',
      usingAuthToken: true,
      queryParam,
    })

  static getRecycledBottleChartdata = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/dashBoard/recycledBottle',
      usingAuthToken: true,
      queryParam,
    })

  static getActiveConsumerChartdata = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/dashBoard/activeConsumer',
      usingAuthToken: true,
      queryParam,
    })
}

export default DashboardService
