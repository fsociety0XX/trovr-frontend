import * as actionTypes from '../actions/Types'

const initialState = {
  createEditConsumerLoading: false,
  consumer: {
    loading: false,
    data: [],
  },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_CONSUMER_INIT:
      return { ...state, createEditConsumerLoading: true }
    case actionTypes.CREATE_CONSUMER_COMPLETE:
      return { ...state, createEditConsumerLoading: false }
    case actionTypes.EDIT_CONSUMER_INIT:
      return { ...state, createEditConsumerLoading: true }
    case actionTypes.EDIT_CONSUMER_COMPLETE:
      return { ...state, createEditConsumerLoading: false }
    case actionTypes.FETCH_CONSUMER_INIT:
      return { ...state, consumer: { ...state.consumer, loading: true } }
    case actionTypes.FETCH_CONSUMER_SUCCESS:
      return {
        ...state,
        consumer: { ...state.consumer, loading: false, data: action.payload },
      }
    case actionTypes.FETCH_CONSUMER_FAIL:
      return { ...state, consumer: { ...state.consumer, loading: false } }
    default:
      return state
  }
}
