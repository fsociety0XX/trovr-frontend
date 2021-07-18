import * as actionTypes from './Types'
import AdminService from '../../api/services/AdminService'

// create consumer
export const createConsumerInit = () => ({
  type: actionTypes.CREATE_CONSUMER_INIT,
})
export const createConsumerComplete = () => ({
  type: actionTypes.CREATE_CONSUMER_COMPLETE,
})

export const createConsumer = (data) => async (dispatch) => {
  dispatch(createConsumerInit())
  const consumerCreateFlag = await AdminService.createConsumer(data)
  if (!consumerCreateFlag) {
    dispatch(createConsumerComplete())
  } else {
    dispatch(createConsumerComplete())
  }
}

// edit consumer
export const editConsumerInit = () => ({
  type: actionTypes.EDIT_CONSUMER_INIT,
})
export const editConsumerComplete = () => ({
  type: actionTypes.EDIT_CONSUMER_COMPLETE,
})

export const editConsumer = (id, data) => async (dispatch) => {
  dispatch(editConsumerInit())
  const consumerEditFlag = await AdminService.editConsumer(id, data)
  if (!consumerEditFlag) {
    dispatch(editConsumerComplete())
  } else {
    dispatch(editConsumerComplete())
  }
}

// consumer list
export const fetchConsumerInit = () => ({
  type: actionTypes.FETCH_CONSUMER_INIT,
})
export const fetchConsumerSuccess = (data) => ({
  type: actionTypes.FETCH_CONSUMER_SUCCESS,
  payload: data,
})
export const fetchConsumerFail = () => ({
  type: actionTypes.FETCH_CONSUMER_FAIL,
})

export const fetchConsumerAction = () => async (dispatch) => {
  dispatch(fetchConsumerInit())
  const fetchConsumer = await AdminService.fetchConsumer()
  if (!fetchConsumer) {
    dispatch(fetchConsumerFail())
  } else {
    dispatch(fetchConsumerSuccess(fetchConsumer))
  }
}
