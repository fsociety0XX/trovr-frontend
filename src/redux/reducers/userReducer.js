import * as actionTypes from '../actions/Types'

const initialState = {
  userList: {
    loading: false,
    data: [],
  },
  notificationCount: 0,
  userHeaderData: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_INIT:
      return { ...state, userList: { ...state.userList, loading: true } }
    case actionTypes.FETCH_USER:
      return {
        ...state,
        userList: { ...state.userList, loading: false, data: action.payload },
      }
    case actionTypes.NOTIFICATION_INIT:
      return { ...state, notificationCount: 0 }
    case actionTypes.NOTIFICATION_SUCCESS:
      return {
        ...state,
        notificationCount: action.payload,
      }
    case actionTypes.USERDATA_INIT:
      return { ...state, userHeaderData: [] }
    case actionTypes.USERDATA_SUCCESS:
      return {
        ...state,
        userHeaderData: action.payload,
      }
    default:
      return state
  }
}
