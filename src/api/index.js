// import { useHistory } from 'react-router-dom'
// import { useToasts } from 'react-toast-notifications'
// import { handleLogOut } from '../utils/helper'

/**
 * check status of API and if status code is not right than handle the exception
 * @author Yamin
 * @param {*} response
 * @returns {response}
 */
const checkStatus = async (response) => {
  if (response.status >= 400 && response.status < 600) {
    console.warn('API error:', response)
    // const responseBody = await response.json().catch(() => ({}))
  }
  if (
    response.contentType &&
    response.contentType.indexOf('application/json') !== -1
  ) {
    console.warn(
      `Incorrect contentType; expected: application/json, actual: ${response.contentType}`
    )
  }
  return response
}
/**
 * format api request before it send with headers, token and url
 * @author Yamin
 * @param {*} param
 * @returns
 */
const sendRequest = async ({
  method = 'GET',
  endpoint,
  data,
  queryParam = null,
  headers = {},
  usingAuthToken = true,
  rawBody = false,
}) => {
  let url = `${process.env.APIURL}${endpoint}` // change the url with the env value
  const params = {
    method,
    headers,
  }
  // eslint-disable-next-line no-use-before-define
  // const csrfToken = await getCsrfToken(endpoint)
  // params.headers['CSRF-Token'] = csrfToken

  if (Object.keys(headers).length === 0) {
    params.headers['Content-Type'] = 'application/json'
  }
  const ip =
    localStorage.getItem('ip') !== null ? localStorage.getItem('ip') : false
  // by defauly usingAuthToken for most of the API call but for some API which doesn't need it will skip it
  if (usingAuthToken) {
    const accessToken =
      localStorage.getItem('accessToken') !== null
        ? localStorage.getItem('accessToken')
        : false
    const refreshToken =
      localStorage.getItem('refreshToken') !== null
        ? localStorage.getItem('refreshToken')
        : false

    if (accessToken && refreshToken) {
      params.headers.authorization = `Bearer ${accessToken}`
      params.headers.refreshToken = refreshToken
    }
  }
  params.headers.ip = ip

  // Set the body for the requests except for GET.
  if (data && method !== 'GET') {
    params.body = rawBody ? data : JSON.stringify(data)
  }
  // If query paramter is there than encode that
  if (queryParam !== null) {
    url += encodeURI(queryParam)
  }
  return fetch(url, params)
}

/**
 * General function for unified call of API with proper response handling
 * @author Yamin
 * @param {*} params
 * @returns {JSON}
 */
const api = async (params) =>
  // const history = useHistory();
  // const { addToast } = useToasts();
  new Promise((resolve, reject) => {
    sendRequest(params).then((resp) => {
      resp
        .json()
        .catch((error) => {
          console.warn("Response from API wasn't JSON serializable", error)
          reject(false)
        })
        .then(checkStatus)
        .then(async (response) => {
          if (response.status === 401) {
            // TODO: provide history and addToast props
            // addToast(message, { appearance: 'error' }) // to show 401 error message
            // handleLogOut(null, history)
            throw Error('Authetication error 401.')
          }
          resolve(response)
        })
    })
  })

/**
 * get CSRF token and store it in session
 * @author Yamin
 * @param {*} endpoint
 * @returns {csrfToken}
 */
// const getCsrfToken = async (endpoint) => {
//   const csrfToken = sessionStorage.getItem('csrfToken')
//   if (csrfToken) {
//     return csrfToken
//   } else if (!csrfToken && endpoint !== '/auth/csrf-token') {
//     const response = await fetch(`${process.env.APIURL}/auth/csrf-token`)
//     const csrf = await response.json()
//     sessionStorage.setItem('csrfToken', csrf.csrfToken)
//     return csrf.csrfToken
//   } else {
//     return null
//   }
// }
export default api
