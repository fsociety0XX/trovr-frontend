import api from '../index'

class CMSService {
  static createBannerAd = async (data) =>
    api({
      method: 'POST',
      endpoint: '/ads',
      usingAuthToken: true,
      data,
    })

  static fetchBannerAds = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/ads',
      usingAuthToken: true,
      queryParam,
    })

  static getSpecificAdDetails = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/ads',
      usingAuthToken: true,
      queryParam,
    })

  static updateBannerAd = async (data, queryParam) =>
    api({
      method: 'PUT',
      endpoint: `/ads`,
      usingAuthToken: true,
      data,
      queryParam,
    })

  static deleteBannerAd = async (queryParam) =>
    api({
      method: 'DELETE',
      endpoint: `/ads`,
      usingAuthToken: true,
      queryParam,
    })

  static updateBannerStatus = async (data, queryParam) =>
    api({
      method: 'PUT',
      endpoint: `/ads/status`,
      usingAuthToken: true,
      data,
      queryParam,
    })
}

export default CMSService
