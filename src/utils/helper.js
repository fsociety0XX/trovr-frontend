import React, { useRef, useEffect } from 'react'
import { Message } from 'semantic-ui-react'
import { useToasts } from 'react-toast-notifications'
import dayjs from 'dayjs'

const { Parser } = require('json2csv')

/**
 * @author Kushagra Garg
 * @use {logout user from system and clear localStorage, sessionStorage and reducer}
 * @param {*} history
 * @param {*} userLoginSuccess
 * @param {*} message {to show in toastify}
 */
export const handleLogOut = (userLoginSuccess = null, history = null) => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('role')
  localStorage.removeItem('ip')

  sessionStorage.removeItem('csrfToken')
  userLoginSuccess && userLoginSuccess([]) // this is the reducer that stores current logged in user's information
  history.push('/')
}

/**
 * @author Kushagra Garg
 * @param {value} Number
 * @use {it will convert number greater than 1000 into a format with "K" in last. For eg: 1K,2.5K}
 */
export const convertNumberWithKInLast = (value) => {
  const number = Number(value)
  if (number < 1000) {
    return number.toFixed(1)
  } else {
    return `${(number / 1000).toFixed(1)}K`
  }
}

/**
 * @author Kushagra
 * @param {*} date
 * @returns {boolean}
 * @use {user can enter only today's date and date in future. **PREVIOUS DATES NOT ALLOWED**}
 */
export const excludePastDate = (date) => {
  try {
    const tempDate = dayjs(date, 'DD/MM/YYYY', true).format('MM/DD/YYYY')
    const userDate = new Date(tempDate) // this will remove time from the date
    const now = new Date().toDateString()
    if (dayjs(userDate).unix() >= dayjs(now).unix()) {
      return true
    }
    return false
  } catch (exception) {
    return false
  }
}

/**
 * @author Kushagra Garg
 * @use {handles search when enter key is pressed}
 * @param {*} e
 */
export const handleSearchOnKeyPress = (e) => {
  if (e.code === 'Enter') {
    if (document.querySelectorAll('.blurOnEnter input')) {
      document.activeElement.blur()
    }
  }
}

/**
 * @author Kushagra Garg
 * @use give string with first letter in capital as output
 * @param {*} string
 * @returns {String}
 */
export const capitalizeFirstLetter = (string) =>
  string.charAt?.(0)?.toUpperCase() + string?.slice(1)

/**
 * @author Kushagra Garg
 * @returns {boolean}
 * @use It can be used when you don't want to execute useEffect on first render.
 */
export const useIsMount = () => {
  const isMountRef = useRef(true)
  useEffect(() => {
    isMountRef.current = false
  }, [])
  return isMountRef.current
}

/**
 * @author Kushagra
 * @param {*} name
 * @param {*} url
 * @returns this method will return value of the specific parameters from URL query string
 * @external https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
 */
export const getParameterByName = (name, url = window.location.href) => {
  const parameter = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp(`[?&]${parameter}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * @author Kushagra
 * @param {*} errors
 * @returns this will render errors below the fields of semantic UI form if any
 */
export const renderFieldError = (errors = []) => {
  if (!errors.length) {
    return null
  }
  return (
    <Message error>
      <Message.List>
        {errors.map((error) => (
          <Message.Item key={Math.random()}> {error} </Message.Item>
        ))}
      </Message.List>
    </Message>
  )
}

/**
 * @author Kushagra Garg
 * @returns pushes user to dashboard
 * @use check if user is already logged in then don't allow to open this page and redirect to dashboard
 */
export const restrictUrlChange = (history) => {
  if (
    localStorage.getItem('accessToken') &&
    localStorage.getItem('refreshToken')
  ) {
    return history.push('/dashboard')
  } else {
    return false
  }
}

/**
 * @author Kushagra Garg
 * @param {*} Components
 * @returns all the props from react-toast-notifications
 * @use It'll help class components to access the properties of useToasts() hook
 * @external https://www.npmjs.com/package/react-toast-notifications
 */
export const withToast = (Components) =>
  function WrappedComponent(props) {
    const toastFuncs = useToasts()
    return <Components {...props} {...toastFuncs} />
  }

/**
 * @author Kushagra Garg
 * @param {*} response
 * @param {*} type
 * @use this method will handle response from google and facebook sign in which will be further used to send to proper service
 */
export const handleThirdPartyResponse = async (
  response = null,
  type = null
) => {
  let reqObj = null
  if (type === 'facebook' && response.id) {
    const { name, email, id, picture } = response
    reqObj = {
      email,
      firstName: name.substr(0, name.indexOf(' ')),
      token: id,
      socialType: 'facebook',
      lastName: name.substr(name.indexOf(' ') + 1),
      avatar: picture.data.url,
    }
  } else if (type === 'google' && response.googleId) {
    const { name, email, googleId, imageUrl } = response.profileObj
    reqObj = {
      email,
      firstName: name.substr(0, name.indexOf(' ')),
      token: googleId,
      socialType: 'google',
      lastName: name.substr(name.indexOf(' ') + 1),
      avatar: imageUrl,
    }
  } else if (type === 'apple' && response.authorization.id_token) {
    reqObj = {
      token: response.authorization.id_token,
      socialType: 'apple',
    }
    if (response.user) {
      const { email, name } = response.user
      const tempObj = {
        email,
        firstName: name.firstName,
        lastName: name.lastName,
      }
      Object.assign(reqObj, tempObj)
    }
  }
  return reqObj
}

/**
 * @author Sadikali
 * @param pathname
 * @use get parent name from pathname
 */

export const getParentFromUrl = (pathname) => {
  const [parent] = pathname.split('/').slice(1)
  const [children] = pathname.split('/').slice(2)
  const [grandchildren] = pathname.split('/').slice(3)
  const path = {
    parent,
    children,
    grandchildren,
  }
  return path
}
export const formatDataForXLSandCSV = (jsonData, columns) => {
  const currentRecords = jsonData
  const dataToDownload = []
  const headerForData = []

  for (let index = 0; index < currentRecords.length; index += 1) {
    const RecordToDownload = {}

    for (let colIndex = 0; colIndex < columns.length; colIndex += 1) {
      if (columns[colIndex].id !== undefined) {
        if (columns[colIndex].id === 'status') {
          RecordToDownload[columns[colIndex].Header] = Capitalize(
            currentRecords[index].status ? 'success' : 'fail'
          )
        } else if (columns[colIndex].id === 'createdAt') {
          RecordToDownload[columns[colIndex].Header] = Capitalize(
            dayjs(new Date(`${currentRecords[index].createdAt} UTC`)).format(
              'DD/MM/YY - hh:mm A'
            )
          )
        } else if (columns[colIndex].id === 'voucherMerchant') {
          RecordToDownload[columns[colIndex].Header] = Capitalize(
            currentRecords[index].voucher?.organisation?.name
          )
        } else if (columns[colIndex].id === 'reedemAt') {
          RecordToDownload[columns[colIndex].Header] = Capitalize(
            dayjs(new Date(`${currentRecords[index].redeemAt} UTC`)).format(
              'DD/MM/YY - hh:mm A'
            )
          )
        } else if (columns[colIndex].id === 'voucherType') {
          RecordToDownload[columns[colIndex].Header] = Capitalize(
            currentRecords[index].voucher.type
          )
        } else if (columns[colIndex].id === 'voucherName') {
          RecordToDownload[columns[colIndex].Header] = Capitalize(
            currentRecords[index].voucher.name
          )
        } else if (columns[colIndex].id === 'voucherQRCode') {
          RecordToDownload[columns[colIndex].Header] = Capitalize(
            currentRecords[index].voucher.qrCode
          )
        } else if (columns[colIndex].id === 'segment') {
          RecordToDownload[columns[colIndex].Header] = Capitalize(
            currentRecords[index].segment?.join()
          )
        } else {
          RecordToDownload[columns[colIndex].Header] = Capitalize(
            currentRecords[index][columns[colIndex].id]
          )
        }
      }
    }

    dataToDownload.push(RecordToDownload)
  }

  Object.keys(dataToDownload[0]).forEach((key) => {
    headerForData.push(key)
  })
  return { headerForData, dataToDownload }
}

/**
 * @author Priyanka Patel
 * download table data in csv file
 * @param {*} data
 * @param {*} finalHeaders
 */
export function downloadCsvFiles(data, finalHeaders, fileName) {
  const json2csvParser = new Parser({ finalHeaders })
  const csv = json2csvParser.parse(data)
  const csvContent = `data:text/csv;charset=utf-8,${csv}`
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.href = encodedUri
  link.style = 'visibility:hidden'
  link.download = `${fileName}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
/**
 * @author Priyanka Patel
 * @param {*} str
 * @returns
 * @use {to make first letter of any string capital}
 */
export function Capitalize(str) {
  if (/^[A-Za-z]+$/g.test(str) && str !== undefined && str !== null) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  } else {
    return str
  }
}
