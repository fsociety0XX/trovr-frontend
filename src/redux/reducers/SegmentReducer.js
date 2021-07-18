import * as actionTypes from '../actions/Types'

const initialState = {
  segment: {
    loading: false,
    list: [],
  },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEGMENT_INIT:
      return {
        ...state,
        segment: {
          ...state.segment,
          loading: true,
          list: [],
        },
      }
    case actionTypes.SEGMENT_SUCCESS:
      return {
        ...state,
        segment: {
          ...state.segment,
          loading: false,
          list: action.payload,
        },
      }
    case actionTypes.SEGMENT_FAIL:
      return {
        ...state,
        segment: {
          ...state.segment,
          loading: false,
          list: [],
        },
      }

    default:
      return state
  }
}
