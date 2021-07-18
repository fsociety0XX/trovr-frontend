import api from '../index'

class ConsumerService {
  static fetchRewards = async (data, endpoint) =>
    api({
      method: 'POST',
      endpoint,
      usingAuthToken: true,
      data,
    })

  static saveLaterRewards = async (queryParam, data, endpoint) =>
    api({
      method: 'PUT',
      endpoint,
      usingAuthToken: true,
      data,
      queryParam,
    })

  static redeemVoucherByConsumer = async (data) =>
    api({
      method: 'POST',
      endpoint: '/voucher/redeemVoucherByConsumer',
      usingAuthToken: true,
      data,
    })
}

export default ConsumerService
