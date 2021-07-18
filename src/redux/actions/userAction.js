import * as actionTypes from './Types'
import UserService from '../../api/services/UserService'
import NotificationService from '../../api/services/NotificationService'

/**
 * will return users list
 * @author Yamin Lawar
 * @params
 * @returns post list
 */

export const fetchUsersInit = () => ({
  type: actionTypes.FETCH_USER_INIT,
})

export const fetchUsersSuccess = (posts) => ({
  type: actionTypes.FETCH_USER,
  payload: posts,
})

export const fetchUsersFail = () => ({
  type: actionTypes.FETCH_USER,
  payload: [],
})

export const fetchUsers = () => async (dispatch) => {
  dispatch(fetchUsersInit())
  const userList = await UserService.getUsers()
  if (!userList) {
    dispatch(fetchUsersFail(userList))
  } else {
    dispatch(fetchUsersSuccess(userList))
  }
}

/**
 * @author Kushagra
 * @returns Unread notification count
 */
export const userNotificationCountInit = () => ({
  type: actionTypes.NOTIFICATION_INIT,
})

export const userNotificationCountSuccess = (count) => ({
  type: actionTypes.NOTIFICATION_SUCCESS,
  payload: count,
})

export const userNotificationCountFail = () => ({
  type: actionTypes.NOTIFICATION_FAIL,
  payload: [],
})

export const fetchNotificationCount = () => async (dispatch) => {
  dispatch(userNotificationCountInit())
  const count = await NotificationService.fetchNotificationCount()
  if (!count) {
    dispatch(fetchUsersFail())
  } else {
    dispatch(userNotificationCountSuccess(count))
  }
}

export const fetchUserDataInit = () => ({
  type: actionTypes.USERDATA_INIT,
})

export const fetchUserDataSuccess = (currentUserData) => ({
  type: actionTypes.USERDATA_SUCCESS,
  payload: currentUserData,
})

export const fetchUserDataFail = () => ({
  type: actionTypes.USERDATA_FAIL,
  payload: [],
})

export const fetchUserDetailsActionCreator = () => async (dispatch) => {
  dispatch(fetchUserDataInit())
  const currentUserData = await UserService.fetchUserDetails()
  if (!currentUserData) {
    dispatch(fetchUserDataFail())
  } else {
    dispatch(fetchUserDataSuccess(currentUserData))
  }
}
