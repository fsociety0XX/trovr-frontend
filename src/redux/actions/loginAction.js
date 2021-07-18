import _ from 'lodash'
import * as actionTypes from './Types'
import LoginService from '../../api/services/LoginService'
import UserService from '../../api/services/UserService'

/**
 * @author Kushagra Garg
 * @use { sending the response of social login / data of normal login to backend service }
 * @params
 * @returns Response of Login API (logged in user information)
 */

export const userLoginInit = () => ({
  type: actionTypes.LOGIN_INIT,
})

export const userLoginSuccess = (data) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload: data,
})

export const userLoginFail = () => ({
  type: actionTypes.LOGIN_FAIL,
  payload: [],
})
async function getMyIp() {
  await fetch('https://api.ipify.org?format=json')
    .then((response) => response.json())
    .then((res) => {
      const myIp = _.get(res, 'ip')
      localStorage.setItem('ip', myIp)
    })
    .catch((err) => console.warn('Problem fetching my IP', err))
}

export const userLogin = (
  data = null,
  addToast,
  history,
  type = null
) => async (dispatch) => {
  if (!localStorage.getItem('ip')) {
    await getMyIp()
  }
  dispatch(userLoginInit())
  let response = null
  if (type === 'social') {
    response = await LoginService.socialLogin(data)
  } else {
    response = await LoginService.login(data)
  }
  if (response.user === undefined) {
    addToast(response[0].message, { appearance: 'error' })
    dispatch(userLoginFail(response))
  } else {
    // do not forget to empty these storage on logout
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
    localStorage.setItem('role', response.user.role[0].name)

    dispatch(userLoginSuccess(response))
    if (response.user.isFirstTime) {
      history.push(
        `/forgot-password?email=${response.user.email}&fromLogin=true`
      )
    } else {
      history.push('/dashboard')
    }
  }
}

/**
 * @author Priyanka Patel
 * @use { fetch country list }
 * @params
 * @returns Response of country list API
 */

export const countryListInit = () => ({
  type: actionTypes.COUNTRY_INIT,
})

export const countryListSuccess = (data) => ({
  type: actionTypes.COUNTRY_SUCCESS,
  payload: data,
})

export const countryListFail = () => ({
  type: actionTypes.COUNTRY_FAIL,
  payload: [],
})
export const callUserAPI = () => ({
  type: actionTypes.CALL_USER_LIST,
})
export const countryList = () => async (dispatch) => {
  dispatch(countryListInit())
  let response = null
  response = await LoginService.getCountryList()

  if (response.length > 0) {
    dispatch(countryListSuccess(response))
  } else {
    dispatch(countryListFail(response))
  }
}

export const fetchUserDetail = () => async (dispatch) => {
  const response = await UserService.fetchUserDetails()
  if (response.id !== undefined) {
    dispatch(userLoginSuccess(response))
  } else {
    dispatch(userLoginFail(response))
  }
}
