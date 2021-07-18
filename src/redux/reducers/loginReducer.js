import * as actionTypes from '../actions/Types'

const initialState = {
  userLoginInfo: {
    loading: false,
    data: [],
  },
  callUser: false,
  countryList: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_INIT:
      return {
        ...state,
        userLoginInfo: { ...state.userLoginInfo, loading: true },
      }
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        userLoginInfo: {
          ...state.userLoginInfo,
          loading: false,
          data: action.payload,
        },
      }
    case actionTypes.LOGIN_FAIL:
      return {
        ...state,
        userLoginInfo: { ...state.userLoginInfo, loading: false, data: [] },
      }
    case actionTypes.COUNTRY_INIT:
      return {
        ...state,
        countryList: [],
      }
    case actionTypes.COUNTRY_SUCCESS:
      return {
        ...state,
        countryList: action.payload,
      }
    case actionTypes.COUNTRY_FAIL:
      return {
        ...state,
        countryList: [],
      }
    case actionTypes.CALL_USER_LIST:
      return {
        ...state,
        callUser: !state.callUser,
      }
    default:
      return state
  }
}
