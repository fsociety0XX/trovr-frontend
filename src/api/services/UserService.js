import api from '../index'

class UserService {
  static async getUsers() {
    return api({ endpoint: '/posts', usingAuthToken: false })
  }

  static forgotPassword = async (data) =>
    api({
      method: 'POST',
      endpoint: '/user/forgotPassword',
      usingAuthToken: false,
      data,
    })

  static resetPassword = async (data) =>
    api({
      method: 'POST',
      endpoint: '/user/resetPassword',
      usingAuthToken: false,
      data,
    })

  static fetchUserDetails = async () =>
    api({
      endpoint: '/user/userDetails',
      usingAuthToken: true,
    })

  static updateUserProfile = async (data) =>
    api({
      method: 'PUT',
      endpoint: '/user',
      usingAuthToken: true,
      data,
    })

  static linkSocialAccount = async (data) =>
    api({
      method: 'POST',
      endpoint: '/user/social',
      usingAuthToken: true,
      data,
    })

  static removeSocialAccount = async (data) =>
    api({
      method: 'DELETE',
      endpoint: '/user/social',
      usingAuthToken: true,
      queryParam: data,
    })

  static changeUserPassword = async (data) =>
    api({
      method: 'POST',
      endpoint: '/user/changePassword',
      usingAuthToken: true,
      data,
    })

  static setUserPassword = async (data) =>
    api({
      method: 'POST',
      endpoint: '/user/setPassword',
      usingAuthToken: true,
      data,
    })

  static contactUsService = async (data) =>
    api({
      method: 'POST',
      endpoint: '/settings/contactUs',
      usingAuthToken: true,
      data,
    })
}

export default UserService
