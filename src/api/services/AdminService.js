import api from '../index'

class AdminService {
  static createConsumer = async (data) =>
    api({
      method: 'POST',
      endpoint: '/consumer',
      usingAuthToken: true,
      data,
    })

  static fetchConsumer = async (data) =>
    api({
      method: 'GET',
      endpoint: '/consumer',
      usingAuthToken: true,
      queryParam: data,
    })

  static fetchConsumerHistory = async (data) =>
    api({
      method: 'POST',
      endpoint: '/consumer/history',
      usingAuthToken: true,
      data,
    })

  static editConsumer = async (data, queryParam) =>
    api({
      method: 'PUT',
      endpoint: `/consumer`,
      usingAuthToken: true,
      data,
      queryParam,
    })

  static deleteUser = async (id) =>
    api({
      method: 'DELETE',
      endpoint: `/user/${id}`,
      usingAuthToken: true,
    })

  static activeConsumer = async (data) =>
    api({
      method: 'PUT',
      endpoint: `/consumer/activate/user`,
      usingAuthToken: true,
      data,
    })

  static getSpecificConsumerDetails = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/consumer',
      usingAuthToken: true,
      queryParam,
    })

  static createVoucher = async (data) =>
    api({
      method: 'POST',
      endpoint: '/voucher',
      usingAuthToken: true,
      data,
    })

  static voucherList = async (queryParam, data) =>
    api({
      method: 'POST',
      endpoint: '/voucher/voucherlist',
      usingAuthToken: true,
      data,
      queryParam,
    })

  static organisationList = async () =>
    api({
      method: 'GET',
      endpoint: '/organisation/listAll',
      usingAuthToken: true,
    })

  static updateVoucherStatus = async (data) =>
    api({
      method: 'PUT',
      endpoint: '/voucher/updateStatus',
      usingAuthToken: true,
      data,
    })

  static deleteVoucher = async (id) =>
    api({
      method: 'DELETE',
      endpoint: `/voucher/${id}`,
      usingAuthToken: true,
    })

  static getSpecificVoucherDetails = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/voucher',
      usingAuthToken: true,
      queryParam,
    })

  static editVoucher = async (data, queryParam) =>
    api({
      method: 'PUT',
      endpoint: `/voucher`,
      usingAuthToken: true,
      data,
      queryParam,
    })

  static createStaff = async (data) =>
    api({
      method: 'POST',
      endpoint: '/staff',
      usingAuthToken: true,
      data,
    })

  static fetchStaffList = async (data) =>
    api({
      method: 'GET',
      endpoint: '/staff',
      usingAuthToken: true,
      queryParam: data,
    })

  static fetchStaffDetail = async (id) =>
    api({
      method: 'GET',
      endpoint: `/staff/${id}`,
      usingAuthToken: true,
    })

  static updateStaff = async (data, queryParam) =>
    api({
      method: 'PUT',
      endpoint: `/staff`,
      usingAuthToken: true,
      data,
      queryParam,
    })

  static fetchVoucherReedemption = async (data) =>
    api({
      method: 'POST',
      endpoint: '/voucher/redemption/report',
      usingAuthToken: true,
      data,
    })
}

export default AdminService
