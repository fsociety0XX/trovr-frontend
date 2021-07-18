import * as actionTypes from './Types'
import ConsumerService from '../../api/services/ConsumerService'
// rewards
export const fetchRewardListInit = () => ({
  type: actionTypes.FETCH_REWARD_INIT,
})
export const fetchRewardListSuccess = (data = '', page) => ({
  type: actionTypes.FETCH_REWARD_SUCCESS,
  payload: data,
  page,
})

export const fetchRewardListFail = () => ({
  type: actionTypes.FETCH_REWARD_FAIL,
  payload: [],
})

export const fetchSavedReward = () => ({
  type: actionTypes.FETCH_REWARD_SAVEFORLATER,
  payload: [],
})

export const fetchSavedRewardDone = () => ({
  type: actionTypes.FETCH_REWARD_SAVEFORLATER_DONE,
  payload: [],
})

export const fetchMoreRewardListSuccess = (data = '', page) => ({
  type: actionTypes.FETCH_REWARD_MORE,
  payload: data,
  page,
})

// Wallet
export const fetchWalletListInit = () => ({
  type: actionTypes.FETCH_WALLET_INIT,
})
export const fetchWalletListSuccess = (data = '', page) => ({
  type: actionTypes.FETCH_WALLET_SUCCESS,
  payload: data,
  page,
})

export const fetchWalletListFail = () => ({
  type: actionTypes.FETCH_WALLET_FAIL,
  payload: [],
})

export const fetchSavedWallet = () => ({
  type: actionTypes.FETCH_WALLET_SAVEFORLATER,
  payload: [],
})

export const fetchSavedWalletDone = () => ({
  type: actionTypes.FETCH_WALLET_SAVEFORLATER_DONE,
  payload: [],
})

export const fetchMoreWalletList = () => ({
  type: actionTypes.FETCH_WALLET_MORE,
  payload: [],
})

export const fetchMoreWalletListSuccess = (data = '', page) => ({
  type: actionTypes.FETCH_WALLET_MORE,
  payload: data,
  page,
})

export const fetchRewardList = (
  page = 1,
  isfav,
  postcode,
  fetchMore = false
) => async (dispatch) => {
  const queryString = {
    page,
    limit: 9,
    frequentlyUsed: false,
  }
  let endpoint = '/voucher/consumer/wallet'
  if (!isfav) {
    dispatch(fetchRewardListInit())
    endpoint = '/voucher/consumerVoucher'
    postcode && Object.assign(queryString, { postcode })
  } else {
    dispatch(fetchWalletListInit())
  }

  const response = await ConsumerService.fetchRewards(queryString, endpoint)
  if (!isfav) {
    if (Object.keys(response).length > 0) {
      if (fetchMore) {
        dispatch(fetchMoreRewardListSuccess(response, page))
      } else {
        dispatch(fetchRewardListSuccess(response, page))
      }
    } else {
      dispatch(fetchRewardListFail(response))
    }
  } else if (Object.keys(response).length > 0) {
    if (fetchMore) {
      dispatch(fetchMoreWalletListSuccess(response, page))
    } else {
      dispatch(fetchWalletListSuccess(response, page))
    }
  } else {
    dispatch(fetchWalletListFail(response))
  }
}
