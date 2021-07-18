import * as actionTypes from '../actions/Types'

const initialState = {
  list: [],
  loading: false,
  rewardSaved: false,
  page: 1,
  vouchers: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_WALLET_INIT:
      return {
        ...state,
        list: [],
        loading: true,
      }
    case actionTypes.FETCH_WALLET_SUCCESS:
      return {
        ...state,
        list: action.payload,
        vouchers: action.payload.vouchers,
        page: action.page,
        loading: false,
      }
    case actionTypes.FETCH_WALLET_MORE:
      return {
        ...state,
        list: action.payload,
        vouchers: [...state.vouchers, ...action.payload.vouchers],
        page: action.page,
        loading: false,
      }
    case actionTypes.FETCH_WALLET_FAIL:
      return {
        ...state,
        list: [],
        vouchers: [],
        loading: false,
      }
    case actionTypes.FETCH_WALLET_SAVEFORLATER:
      return {
        ...state,
        loading: false,
      }

    default:
      return state
  }
}
