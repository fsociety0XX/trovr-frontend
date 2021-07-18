import api from '../index'

class LoginService {
  /**
   * @author Kushagra
   * @use this method will be required to pass the response of social media login to Backend
   * @param {*} data
   * @returns
   */
  static socialLogin = async (data) =>
    api({
      method: 'POST',
      endpoint: '/auth/loginWithSocial',
      usingAuthToken: false,
      data,
    })

  static login = async (data) =>
    api({
      method: 'POST',
      endpoint: '/auth/login',
      usingAuthToken: false,
      data,
    })

  static getCountryList = async () =>
    api({
      method: 'GET',
      endpoint: '/user/countryList',
      usingAuthToken: false,
    })

  static consumerRegistration = async (data) =>
    api({
      method: 'POST',
      endpoint: '/user/registerConsumer',
      usingAuthToken: false,
      data,
    })

  static verifyConsumer = async (data) =>
    api({
      method: 'PUT',
      endpoint: '/user/verifyUser',
      usingAuthToken: false,
      data,
    })
}

export default LoginService
