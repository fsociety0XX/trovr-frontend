import api from '../index'

class MerchantService {
  static merchantList = async (data) =>
    api({
      method: 'GET',
      endpoint: '/merchant',
      usingAuthToken: true,
      queryParam: data,
    })

  static updateMerchant = async (data, queryParam) =>
    api({
      method: 'PUT',
      endpoint: '/merchant',
      usingAuthToken: true,
      data,
      queryParam,
    })

  static approveMerchant = async (data) =>
    api({
      method: 'PUT',
      endpoint: '/user/verifyMerchant',
      usingAuthToken: true,
      data,
    })

  static getOrganisationList = async () =>
    api({
      method: 'GET',
      endpoint: '/organisation/listAll',
      usingAuthToken: true,
    })

  static getSpecificMerchantDetails = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/merchant',
      usingAuthToken: true,
      queryParam,
    })

  static deleteMerchant = async (queryParam) =>
    api({
      method: 'DELETE',
      endpoint: '/user',
      usingAuthToken: true,
      queryParam,
    })

  static createMerchant = async (data) =>
    api({
      method: 'POST',
      endpoint: '/merchant',
      usingAuthToken: true,
      data,
    })
}

export default MerchantService
